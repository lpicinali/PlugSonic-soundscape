import { all, call, put, select, spawn, take } from 'redux-saga/effects'

import {
  ActionType,
  PlaybackState,
  PlaybackTiming,
  ReachAction,
  SourceOrigin,
  TimingStatus,
} from 'src/constants.js'
import { createSubscriptionSource, fetchAudioBuffer } from 'src/utils.js'
import { setListenerPosition } from 'src/actions/listener.actions.js'
import {
  addSource,
  deleteSources,
  setSourceIsPlaying,
  setSourceIsWithinReach,
  setSourceTiming,
  setSourceTimingStatus,
} from 'src/actions/sources.actions.js'
import { getInstance as getBinauralSpatializer } from 'src/audio/binauralSpatializer.js'
import {
  playSource,
  stopSource,
  recordStart,
  recordStop,
  setSourceLoop,
  setSourceVolume,
  setSourceReachGain,
  setSourceMuted,
  destroySourceAudioChain,
  storeSourceAudioBuffer,
  subscribeToSourceEnd,
} from 'src/audio/engine.js'

function isWithinReach(listener, source) {
  const distance = Math.sqrt(
    (listener.position.x - source.position.x) ** 2 +
      (listener.position.y - source.position.y) ** 2
  )
  return distance <= source.reach.radius
}

/**
 * Plays a source if all a source's necessary conditions are met.
 * This prevents this logic to be all over the place.
 */
function* requestPlaySource(source) {
  const shouldPlay =
    source.gameplay.isPlaying === true &&
    ((source.reach.isEnabled === true &&
      source.gameplay.isWithinReach === true) ||
      source.reach.action === ReachAction.TOGGLE_VOLUME ||
      source.reach.isEnabled === false)

  if (shouldPlay === true) {
    yield call(playSource, source)
  }
}

/* ======================================================================== */
// PLAY/STOP
/* ======================================================================== */
function* applyPlayStop() {
  while (true) {
    const { payload } = yield take(ActionType.SET_PLAYBACK_STATE)

    const sources = yield select(state => state.sources.sources)

    // eslint-disable-next-line
    for (const source of Object.values(sources)) {
      if (
        payload.state === PlaybackState.PLAY ||
        payload.state === PlaybackState.RECORD
      ) {
        if (source.timings[PlaybackTiming.PLAY_AFTER] === null) {
          yield put(setSourceIsPlaying(source.name, true))
        } else {
          yield put(setSourceTimingStatus(source.name, TimingStatus.CUED))
        }
      } else {
        const timingStatus =
          source.timings[PlaybackTiming.PLAY_AFTER] === null
            ? TimingStatus.INDEPENDENT
            : TimingStatus.CUED
        yield put(setSourceTimingStatus(source.name, timingStatus))
        yield put(setSourceIsPlaying(source.name, false))
      }
    }
  }
}

/* ======================================================================== */
// RECORD
/* ======================================================================== */
function* applyRecordStartStop() {
  while (true) {
    const prevState = yield select(state => state.controls.playbackState)
    const { payload } = yield take(ActionType.SET_PLAYBACK_STATE)
    if (payload.state === PlaybackState.RECORD) {
      yield call(recordStart)
    } else if (
      payload.state === PlaybackState.STOP &&
      prevState === PlaybackState.RECORD
    ) {
      yield call(recordStop)
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

    if (source.origin === SourceOrigin.REMOTE) {
      yield spawn(fetchAndStoreSourceAudio(source.name, source.url))
    }

    if (
      playbackState === PlaybackState.PLAY ||
      playbackState === PlaybackState.RECORD
    ) {
      yield call(playSource, source)
    }
  }
}

function fetchAndStoreSourceAudio(name, url) {
  return function*() {
    const audioBuffer = yield call(fetchAudioBuffer, url)
    yield call(storeSourceAudioBuffer, name, audioBuffer)
  }
}

/* ======================================================================== */
// SOURCE ON/OFF
/* ======================================================================== */
function* applySourceOnOff() {
  while (true) {
    const { payload } = yield take(ActionType.SOURCE_ONOFF)

    const source = yield select(state => state.sources.sources[payload.name])
    yield call(setSourceMuted, source.name, source.selected === false)
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

    // Delete current sources
    const currentSources = yield select(state =>
      Object.values(state.sources.sources)
    )
    yield put(deleteSources(currentSources.map(x => x.name)))

    // Add the new ones
    for (let i = 0; i < sources.length; i++) {
      yield put(addSource({ ...sources[i], origin: SourceOrigin.REMOTE }))
    }
  }
}

/* ======================================================================== */
// DELETE SOURCES
/* ======================================================================== */
function* applyDeleteSource() {
  while (true) {
    const {
      payload: { sources },
    } = yield take(ActionType.DELETE_SOURCES)

    for (let i = 0; i < sources.length; i++) {
      const dangerousMockSourceObject = {
        name: sources[i],
      }
      yield call(destroySourceAudioChain, dangerousMockSourceObject)

      // Remove PLAY_AFTER timings pointing to the deleted source
      const dependants = yield select(state =>
        Object.values(state.sources.sources).filter(
          x => x.timings[PlaybackTiming.PLAY_AFTER] === sources[i]
        )
      )
      for (let j = 0; j < dependants.length; j++) {
        yield put(
          setSourceTiming(dependants[j].name, PlaybackTiming.PLAY_AFTER, null)
        )
      }
    }
  }
}

/* ======================================================================== */
// LOOP
/* ======================================================================== */
function* applyLoopChanges() {
  while (true) {
    const { payload } = yield take(ActionType.SET_SOURCE_LOOP)

    const source = yield select(state => state.sources.sources[payload.source])
    const playbackState = yield select(state => state.controls.playbackState)

    // Each time a source's node is played, its effect chain gets
    // reinitialized, so simply re-playing it will create a node
    // with looping enabled.
    //
    // (Changing the node's loop property while playing is not
    // possible.)
    if (
      playbackState === PlaybackState.PLAY ||
      playbackState === PlaybackState.RECORD
    ) {
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

/* ======================================================================== */
// IMPORT LISTENER
/* ======================================================================== */
function* applyImportListener() {
  while (true) {
    const { payload } = yield take(ActionType.IMPORT_LISTENER)
    yield put(setListenerPosition(payload.listener.position))
  }
}

// function* applyMasterVolume() {
//   while (true) {
//     const { type, payload } = yield take(ActionType.SET_MASTER_VOLUME)
//     setMasterVolume(payload.volume)
//   }
// }

function* applySourceVolume() {
  while (true) {
    const {
      payload: { source, volume },
    } = yield take(ActionType.SET_SOURCE_VOLUME)
    yield call(setSourceVolume, source, volume)
  }
}

function* updateSourcesReachedState() {
  while (true) {
    yield take([
      ActionType.SET_LISTENER_POSITION,
      ActionType.ADD_SOURCE,
      ActionType.SET_SOURCE_POSITION,
      ActionType.SET_SOURCE_REACH_RADIUS,
    ])

    const [listener, sources] = yield all([
      select(state => state.listener),
      select(state => Object.values(state.sources.sources)),
    ])

    // eslint-disable-next-line
    for (const source of sources) {
      const isSourceReached = isWithinReach(listener, source)
      if (isSourceReached !== source.gameplay.isWithinReach) {
        yield put(setSourceIsWithinReach(source.name, isSourceReached))
      }
    }
  }
}

/**
 * Applies reach state changes that affects a source's (reach gain) volume.
 */
function* applySourceReachChangesAffectingVolume() {
  while (true) {
    const { type, payload } = yield take([
      ActionType.SET_SOURCE_REACH_ENABLED,
      ActionType.SET_SOURCE_IS_WITHIN_REACH,
    ])

    const name = payload.name || payload.source
    const source = yield select(state => state.sources.sources[name])

    if (source.reach.action !== ReachAction.TOGGLE_VOLUME) {
      continue
    }

    // Toggling reach doesn't trigger fades, only mute/unmute
    if (type === ActionType.SET_SOURCE_REACH_ENABLED) {
      const reachGain =
        source.reach.isEnabled === true &&
        source.gameplay.isWithinReach === false
          ? 0
          : 1

      yield call(setSourceReachGain, source.name, reachGain, 0)
    }
    // Reach changes
    else if (type === ActionType.SET_SOURCE_IS_WITHIN_REACH) {
      // Entering and leaving the reach area only triggers fades
      // when reach is enabled
      if (source.reach.isEnabled === true) {
        const reachGain = source.gameplay.isWithinReach ? 1 : 0
        yield call(
          setSourceReachGain,
          source.name,
          reachGain,
          source.reach.fadeDuration
        )
      }
    }
  }
}

/**
 * Applies reach state changes that affects a source's playback.
 */
function* applySourceReachChangesAffectingPlayback() {
  while (true) {
    const { type, payload } = yield take([
      ActionType.SET_SOURCE_REACH_ENABLED,
      ActionType.SET_SOURCE_IS_WITHIN_REACH,
    ])

    const name = payload.name || payload.source
    const source = yield select(state => state.sources.sources[name])

    if (source.reach.action !== ReachAction.TOGGLE_PLAYBACK) {
      continue
    }

    if (type === ActionType.SET_SOURCE_REACH_ENABLED) {
      if (
        source.reach.isEnabled === true &&
        source.gameplay.isWithinReach === false
      ) {
        yield call(stopSource, source)
      } else {
        yield call(requestPlaySource, source)
      }
    } else if (type === ActionType.SET_SOURCE_IS_WITHIN_REACH) {
      if (source.reach.isEnabled === true) {
        if (source.gameplay.isWithinReach === true) {
          yield call(requestPlaySource, source)
        } else {
          yield call(stopSource, source)
        }
      }
    }
  }
}

function* applySourcePlaybackState() {
  while (true) {
    const { payload } = yield take(ActionType.SET_SOURCE_IS_PLAYING)

    const source = yield select(state => state.sources.sources[payload.name])

    if (source.gameplay.isPlaying === true) {
      yield call(requestPlaySource, source)
    } else {
      yield call(stopSource, source)
    }
  }
}

/* ======================================================================== */
// SOURCE TIMINGS
/* ======================================================================== */
function* updateSourcesTimingStatus() {
  const callbackSource = yield call(
    createSubscriptionSource,
    subscribeToSourceEnd
  )

  while (true) {
    const { source } = yield call(callbackSource.nextMessage)

    const playbackState = yield select(state => state.controls.playbackState)
    const dependants = yield select(state =>
      Object.values(state.sources.sources).filter(
        x => x.timings[PlaybackTiming.PLAY_AFTER] === source.name
      )
    )

    if (playbackState !== PlaybackState.STOP) {
      // eslint-disable-next-line
      for (const dependant of dependants) {
        if (dependant.gameplay.timingStatus === TimingStatus.CUED) {
          yield put(setSourceIsPlaying(dependant.name, true))
          yield put(
            setSourceTimingStatus(dependant.name, TimingStatus.ADMITTED)
          )
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
    applyRecordStartStop(),
    applySourceOnOff(),
    manageAddSource(),
    applyDeleteSource(),
    manageImportSources(),
    applyImportListener(),
    // applyMasterVolume(),
    applySourceVolume(),
    applyLoopChanges(),
    updateSourcesReachedState(),
    applySourceReachChangesAffectingVolume(),
    applySourceReachChangesAffectingPlayback(),
    applySourcePlaybackState(),
    updateSourcesTimingStatus(),
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
