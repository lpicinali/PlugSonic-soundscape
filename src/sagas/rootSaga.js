import { all, call, put, select, spawn, take } from 'redux-saga/effects'

import {
  ActionType,
  PlaybackState,
  PlaybackTiming,
  ReachAction,
  SourceOrigin,
  TimingStatus,
} from 'src/constants.js'
import {
  createSubscriptionSource,
  fetchAudioBuffer,
  fetchAudioBufferRaw,
  getSourceReachGain,
} from 'src/utils.js'
import { setListenerPosition } from 'src/actions/listener.actions.js'
import {
  addSource,
  deleteSources,
  setSourceSelected,
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
  setSourceVolume,
  setSourceReachGain,
  setSourceMuted,
  destroySourceAudioChain,
  storeSourceAudioBuffer,
  storeSourceRawData,
  getSourceRawData,
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
    ((source.reach.enabled === true &&
      source.gameplay.isWithinReach === true) ||
      source.reach.action === ReachAction.TOGGLE_VOLUME ||
      source.reach.enabled === false)

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
    console.log('manageAddSource - payload')
    console.log(payload)

    const source = yield select(state => state.sources.sources[payload.name])
    const playbackState = yield select(state => state.controls.playbackState)

    if (source.origin === SourceOrigin.REMOTE) {
      yield spawn(fetchAndStoreSourceAudio(source.name, source.url))
    } else if (source.origin === SourceOrigin.LOCAL && getSourceRawData(source.name) === undefined) {
      yield spawn(fetchAndStoreRawData(source.name, payload.raw))
    } else {
      console.log('rootSaga -> manageAddSource: source uploaded from local, bypass fecth audio buffer')
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

function fetchAndStoreRawData(name, rawData) {
  return function*() {
    const audioBuffer = yield call(fetchAudioBufferRaw, rawData)
    yield call(storeSourceAudioBuffer, name, audioBuffer)
    yield call(storeSourceRawData, name, rawData)
  }
}

/* ======================================================================== */
// SOURCE ON/OFF
/* ======================================================================== */
function* applySourceOnOff() {
  while (true) {
    const { payload } = yield take(ActionType.SOURCE_ONOFF)

    const source = yield select(state => state.sources.sources[payload.name])
    yield call(setSourceMuted, source.name, source.enabled === false)
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
      if (sources[i].raw !== null ) {
        yield put(addSource({ ...sources[i], origin: SourceOrigin.LOCAL }))
      } else if ( sources[i].raw === null && sources[i].url !== null) {
        yield put(addSource({ ...sources[i], origin: SourceOrigin.REMOTE }))
      } else {
        console.log('rootSaga -> manageImportSources: json not valid')
      }
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
// SPATIALISED
/* ======================================================================== */
function* applySpatialisedChanges() {
  while (true) {
    const { payload } = yield take(ActionType.SET_SOURCE_SPATIALISED)

    const source = yield select(state => state.sources.sources[payload.source])
    const playbackState = yield select(state => state.controls.playbackState)

    if (playbackState === PlaybackState.PLAY || playbackState === PlaybackState.RECORD) {
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
 * Makes sure to play sources that changes from toggling playback to
 * toggling volume, as the volume togglers should constantly be playing
 * (if not waiting for a playback timing).
 */
function* manageReachActionChanges() {
  while (true) {
    const { payload } = yield take(ActionType.SET_SOURCE_REACH_ACTION)
    console.log({ payload })

    const source = yield select(state => state.sources.sources[payload.source])
    const playbackState = yield select(state => state.controls.playbackState)

    console.log('manage', { source, playbackState })

    if (
      playbackState !== PlaybackState.STOP &&
      source.reach.action === ReachAction.TOGGLE_VOLUME &&
      source.gameplay.timingStatus !== TimingStatus.CUED
    ) {
      yield put(setSourceIsPlaying(source.name, true))
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
      const reachGain = getSourceReachGain(source)
      yield call(setSourceReachGain, source.name, reachGain, 0)
    }
    // Reach changes
    else if (type === ActionType.SET_SOURCE_IS_WITHIN_REACH) {
      // Entering and leaving the reach area only triggers fades
      // when reach is enabled
      if (source.reach.enabled === true) {
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

    const playbackState = yield select(state => state.controls.playbackState)
    if (playbackState === PlaybackState.STOP) {
      continue
    }

    if (type === ActionType.SET_SOURCE_REACH_ENABLED) {
      const isReached =
        source.reach.enabled === false ||
        source.gameplay.isWithinReach === true
      yield put(setSourceIsPlaying(source.name, isReached))
    } else if (type === ActionType.SET_SOURCE_IS_WITHIN_REACH) {
      if (source.reach.enabled === true) {
        const isReached = source.gameplay.isWithinReach === true
        yield put(setSourceIsPlaying(source.name, isReached))
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

    // If a non-looping source ended, update its playing state
    // and stop the audio node
    if (source.loop === false) {
      yield call(stopSource, source)
      yield put(setSourceIsPlaying(source.name, false))
    }

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

function* allowOnlyOneSourceToBeSelected() {
  while (true) {
    const { payload } = yield take(ActionType.SET_SOURCE_SELECTED)

    if (payload.selected === true) {
      const prevSelectedSource = yield select(state =>
        Object.values(state.sources.sources).find(
          x => x.selected === true && x.name !== payload.source
        )
      )
      if (prevSelectedSource !== undefined) {
        yield put(setSourceSelected(prevSelectedSource.name, false))
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
    manageReachActionChanges(),
    applySourceReachChangesAffectingVolume(),
    applySourceReachChangesAffectingPlayback(),
    applySourcePlaybackState(),
    updateSourcesTimingStatus(),
    applySpatialisedChanges(),
    allowOnlyOneSourceToBeSelected(),
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
