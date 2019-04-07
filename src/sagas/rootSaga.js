import { all, call, put, select, take } from 'redux-saga/effects'

import { ActionType, PlaybackState, ReachAction } from 'src/constants.js'
import { addSource } from 'src/actions/sources.actions.js'
import { getInstance as getBinauralSpatializer } from 'src/audio/binauralSpatializer.js'
import {
  playSource,
  stopSource,
  setSourceLoop,
  // setMasterVolume,
  setSourceVolume,
  // spatializeSource,
  // deleteSources,
  deleteAllSources,
} from 'src/audio/engine.js'

/* ======================================================================== */
// PLAY/STOP
/* ======================================================================== */
function* applyPlayStop() {
  while (true) {
    const { payload } = yield take(ActionType.SET_PLAYBACK_STATE)

    const sources = yield select(state => state.sources.sources)

    // eslint-disable-next-line
    for (const source of Object.values(sources)) {
      if (payload.state === PlaybackState.PLAY) {
        if (source.selected === true) {
          yield call(playSource, source)
        }
      } else {
        yield call(stopSource, source)
      }
    }
  }
}

/* ======================================================================== */
// ADD SOURCE
/* ======================================================================== */
function* manageAddSource() {
  while (true) {
    const { payload } = yield take(ActionType.ADD_SOURCE)

    const source = yield select(state => state.sources.sources[payload.name])
    const playbackState = yield select(state => state.controls.playbackState)

    if (source.selected === true && playbackState === PlaybackState.PLAY) {
      yield call(playSource, source)
    }
  }
}

/* ======================================================================== */
// SOURCE ON/OFF
/* ======================================================================== */
function* applySourceOnOff() {
  while (true) {
    const { payload } = yield take(ActionType.SOURCE_ONOFF)

    const source = yield select(state => state.sources.sources[payload.name])
    const playbackState = yield select(state => state.controls.playbackState)

    if (source.selected === true && playbackState === PlaybackState.PLAY) {
      yield call(playSource, source)
    } else {
      yield call(stopSource, source)
    }
  }
}

/* ======================================================================== */
// IMPORT SOURCES
/* ======================================================================== */
function* manageImportSources() {
  while (true) {
    const {
      payload: { sources },
    } = yield take(ActionType.IMPORT_SOURCES)

    yield call(deleteAllSources)

    for (let i = 0; i < sources.length; i++) {
      yield put(addSource(sources[i]))
    }
  }
}

// function* applyDeleteSources() {
//   while (true) {
//     const { type, payload } = yield take(ActionType.DELETE_TARGETS)
//     const selected = payload.targets
//     Stop()
//
//     yield call(DeleteSources, selected)
//
//     const playbackState = yield select(state => state.controls.playbackState)
//     if (playbackState === PlaybackState.PLAYING) {
//       yield call(Play)
//     }
//   }
// }

/* ======================================================================== */
// LOOP
/* ======================================================================== */
function* applyLoopChanges() {
  while (true) {
    const { payload } = yield take(ActionType.SET_SOURCE_LOOP)

    const source = yield select(state => state.sources.sources[payload.source])
    const playbackState = yield select(state => state.controls.playbackState)

    yield call(setSourceLoop, source.name, payload.loop)

    if (playbackState === PlaybackState.PLAY) {
      yield call(stopSource, source)
      yield call(playSource, source)
    }
  }
}

/* ======================================================================== */
// SOURCE POSITION
/* ======================================================================== */
function* applySourcePosition() {
  while (true) {
    const { payload } = yield take(ActionType.SET_SOURCE_POSITION)
    const name = payload.source
    const { x, y, z } = payload.position

    const spatializer = yield call(getBinauralSpatializer)
    spatializer.setSourcePosition(name, { x, y, z })
  }
}

/* ======================================================================== */
// LISTENER POSITION
/* ======================================================================== */
function* applyListenerPosition() {
  while (true) {
    const { payload } = yield take(ActionType.SET_LISTENER_POSITION)
    const { x, y, z, rotZAxis } = payload.position

    const spatializer = yield call(getBinauralSpatializer)
    spatializer.setListenerPosition({ x, y, z, rotZAxis })
  }
}

// function* applyMasterVolume() {
//   while (true) {
//     const { type, payload } = yield take(ActionType.SET_MASTER_VOLUME)
//     setMasterVolume(payload.volume)
//   }
// }

// function* applyTargetVolume() {
//   while (true) {
//     const { type, payload } = yield take(ActionType.SET_TARGET_VOLUME)
//     const { target, volume } = payload
//     setSourceVolume(target, volume)
//   }
// }

function* handleSourcesReach() {
  while (true) {
    yield take([
      ActionType.SET_LISTENER_POSITION,
      ActionType.SET_SOURCE_POSITION,
      ActionType.SET_SOURCE_REACH,
      ActionType.SET_PLAYBACK_STATE,
    ])

    const [listener, sources] = yield all([
      select(state => state.listener),
      select(state =>
        Object.values(state.sources.sources).filter(x => x.spatialised === true)
      ),
    ])

    // eslint-disable-next-line
    for (const source of sources) {
      const distanceToListener = Math.sqrt(
        (listener.position.x - source.position.x) ** 2 +
          (listener.position.y - source.position.y) ** 2
      )
      const isInsideReach = distanceToListener <= source.reach.radius

      if (source.reach.action === ReachAction.TOGGLE_VOLUME) {
        const volume = isInsideReach === true ? source.volume : 0
        // TODO: Put this back in
        // yield call(
        //   setSourceVolume,
        //   source.name,
        //   volume,
        //   source.reach.fadeDuration
        // )
      } else if (source.reach.action === ReachAction.TOGGLE_PLAYBACK) {
        yield call(stopSource, source)

        if (isInsideReach === true) {
          yield call(playSource, source)
        }
      }
    }
  }
}

/* ======================================================================== */
// HEAD RADIUS
/* ======================================================================== */
function* applyHeadRadius() {
  while (true) {
    const { payload } = yield take(ActionType.SET_HEAD_RADIUS)
    const spatializer = yield call(getBinauralSpatializer)
    spatializer.setHeadRadius(payload.radius)
  }
}

/* ======================================================================== */
// PERFORMANCE MODE
/* ======================================================================== */
function* applyPerformanceMode() {
  while (true) {
    yield take(ActionType.SET_HIGH_PERFORMANCE_MODE)
    const spatializer = yield call(getBinauralSpatializer)
    spatializer.setPerformanceMode()
  }
}

/* ======================================================================== */
// QUALITY MODE
/* ======================================================================== */
function* applyQualityMode() {
  while (true) {
    yield take(ActionType.SET_HIGH_QUALITY_MODE)
    const spatializer = yield call(getBinauralSpatializer)
    spatializer.setQualityMode()
  }
}

// function* applyDirectionalityEnabled() {
//   while (true) {
//     const { payload } = yield take(ActionType.SET_DIRECTIONALITY_ENABLED)
//     engine.setDirectionalityEnabled(payload.isEnabled)
//   }
// }

// function* applyDirectionalityAttenuation() {
//   while (true) {
//     const { payload } = yield take(ActionType.SET_DIRECTIONALITY_VALUE)
//     const attenuation = payload.value * 30
//     engine.setDirectionalityAttenuation(Ear.LEFT, attenuation)
//     engine.setDirectionalityAttenuation(Ear.RIGHT, attenuation)
//   }
// }

/* ======================================================================== */
// HRTF
/* ======================================================================== */
function* initDefaultHrtf() {
  const hrtfFilename = yield select(state => state.listener.hrtfFilename)
  const binauralInstance = yield call(getBinauralSpatializer)
  yield call(binauralInstance.setHrtf, hrtfFilename)
}

function* applyHrtfs() {
  while (true) {
    const {
      payload: { filename },
    } = yield take(ActionType.SET_HRTF_FILENAME)

    try {
      const binauralInstance = yield call(getBinauralSpatializer)
      yield call(binauralInstance.setHrtf, filename)
    } catch (err) {
      console.log('Could not set default HRTF:')
      console.error(err)
    }
  }
}

export default function* rootSaga() {
  yield [
    applyPlayStop(),
    applySourceOnOff(),
    manageAddSource(),
    // applyDeleteSources(),
    manageImportSources(),
    // applyMasterVolume(),
    // applyTargetVolume(),
    applyLoopChanges(),
    handleSourcesReach(),
    applyPerformanceMode(),
    applyQualityMode(),
    applyHeadRadius(),
    // applyDirectionalityEnabled(),
    // applyDirectionalityAttenuation(),
    applySourcePosition(),
    applyListenerPosition(),
    initDefaultHrtf(),
    applyHrtfs(),
  ]
}
