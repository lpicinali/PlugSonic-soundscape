/* eslint no-unused-vars:0 */
/* eslint prefer-destructuring: 0 */

/* ------------------- NOTES --------------------------------------------------- */ /*

*/ /* ----------------------------------------------------------------------------- */

import { all, call, put, select, take, fork, spawn } from 'redux-saga/effects'
import { map } from 'lodash'

import { ActionType, PlaybackState } from 'src/constants.js'
import { getFileUrl } from 'src/audio/audio-files.js'
import {
  play as enginePlay,
  pause as enginePause,
  setTargetSource as engineSetTargetSource,
  unsetTargetSource as engineUnsetTargetSource,
  setMasterVolume as engineSetMasterVolume,
  setTargetVolume as engineSetTargetVolume,
  setComponentPosition as engineSetComponentPosition,
  setListenerPosition as engineSetListenerPosition,
  setHeadRadius as engineSetHeadRadius,
  setPerformanceMode as engineSetPerformanceMode,
  addSource as engineAddSource,
  deleteSources as engineDeleteSources,
  importSources as engineImportSources,
} from 'src/audio/engine.js'
import { getDistanceBetweenSphericalPoints } from 'src/utils.js'

function* applyPlayPause() {
  while (true) {
    const { payload: { state } } = yield take(ActionType.SET_PLAYBACK_STATE)

    if (state === PlaybackState.PLAYING) {
      enginePlay()
    } else if (state === PlaybackState.PAUSED) {
      enginePause()
    }
  }
}

function* manageComponentSource(filename, url) {
  const selected = yield select(state => state.target.selected)
  const index = selected.indexOf(filename)
  if (index >= 0) {
    const targetObject = yield select(state => state.target.targets[filename])
    yield call(engineSetTargetSource, targetObject)
  } else {
    yield call(engineUnsetTargetSource, filename)
  }
  const playbackState = yield select(state => state.controls.playbackState)

  if (playbackState === PlaybackState.PLAYING) {
    yield call(enginePlay)
  }
}

function* applyComponentSource() {
  while (true) {
    const { type, payload } = yield take(ActionType.SET_TARGET)
    yield spawn(manageComponentSource, payload.target, payload.url)
  }
}

function* manageAddSource(filename) {
  const targets = yield select(state => state.target.targets)
  yield call(engineAddSource, targets[filename])

  const selected = yield select(state => state.target.selected)
  for (let i = 0; i < selected.length; i++) {
    const targetObject = targets[selected[i]]
    yield call(engineSetTargetSource, targetObject)
  }

  const playbackState = yield select(state => state.controls.playbackState)
  if (playbackState === PlaybackState.PLAYING) {
    yield call(enginePlay)
  }
}

function* applyAddSource() {
  while (true) {
    const { type, payload } = yield take(ActionType.ADD_TARGET)
    yield spawn(manageAddSource, payload.filename)
  }
}

function* applyDeleteSources() {
  while (true) {
    const { type, payload } = yield take(ActionType.DELETE_TARGETS)
    const selected = payload.targets
    enginePause()

    yield call(engineDeleteSources, selected)

    const playbackState = yield select(state => state.controls.playbackState)
    if (playbackState === PlaybackState.PLAYING) {
      yield call(enginePlay)
    }
  }
}

function* applyImportSources() {
  while (true) {
    const { type, payload } = yield take(ActionType.IMPORT_TARGETS)
    const sources = payload.targets
    engineImportSources(sources)
  }
}

function* applyImportSelected() {
  while (true) {
    yield take(ActionType.IMPORT_SELECTED)

    const selected = yield select(state => state.target.selected.map(filename => state.target.targets[filename]))

    let alertMessage = ''
    // eslint-disable-next-line
    for (const targetObject of selected) {
      const response = yield call(engineSetTargetSource, targetObject)
      if ( response === null ) {
        if ( alertMessage === '' )
          alertMessage = targetObject.title
        else
          alertMessage = `${alertMessage}, ${targetObject.title}`
      }
    }

    if ( alertMessage !== '' ) {
      // eslint-disable-next-line
      alert(`Please import : ${alertMessage}`)
    }

    const playbackState = yield select(state => state.controls.playbackState)
    if (playbackState === PlaybackState.PLAYING) {
      yield call(enginePlay)
    }
  }
}

function* applyTargetPosition() {
  while (true) {
    const { payload } = yield take(ActionType.SET_TARGET_POSITION)
    const filename = payload.target
    const { azimuth, distance } = payload.position
    engineSetComponentPosition(filename, { azimuth, distance })
  }
}

function* applyListenerPosition() {
  while (true) {
    const { payload } = yield take(ActionType.SET_LISTENER_POSITION)
    const { azimuth, distance, rotYAxis } = payload.position
    engineSetListenerPosition({ azimuth, distance, rotYAxis })
  }
}

function* applyMasterVolume() {
  while (true) {
    const { type, payload } = yield take(ActionType.SET_MASTER_VOLUME)
    engineSetMasterVolume(payload.volume)
  }
}

function* applyTargetVolume() {
  while (true) {
    const { type, payload } = yield take(ActionType.SET_TARGET_VOLUME)
    const { target, volume } = payload
    engineSetTargetVolume(target, volume)
  }
}

function* rampTargetVolumesByTheirReach() {
  while (true) {
    yield take([
      ActionType.SET_LISTENER_POSITION,
      ActionType.SET_TARGET_POSITION,
      ActionType.SET_TARGET_REACH,
      ActionType.SET_PLAYBACK_STATE,
    ])

    const [listener, targets] = yield all([
      select(state => state.listener),
      select(state => state.target.selected.map(filename => state.target.targets[filename])),
    ])

    // eslint-disable-next-line
    for (const target of targets) {
      const distanceToListener = getDistanceBetweenSphericalPoints(listener.position, target.position)
      const volume = distanceToListener <= target.reach.radius ? target.volume : 0

      yield call(engineSetTargetVolume, target.filename, volume, target.reach.fadeDuration)
    }
  }
}

function* applyHeadRadius() {
  while (true) {
    const { payload } = yield take(ActionType.SET_HEAD_RADIUS)
    engineSetHeadRadius(payload.radius)
  }
}

function* applyPerformanceMode() {
  while (true) {
    const { payload } = yield take(ActionType.SET_PERFORMANCE_MODE_ENABLED)
    engineSetPerformanceMode(payload.isEnabled)
  }
}
//
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

export default function* rootSaga() {
  yield [
    applyPlayPause(),
    applyComponentSource(),
    applyAddSource(),
    applyDeleteSources(),
    applyImportSources(),
    applyImportSelected(),
    applyMasterVolume(),
    applyTargetVolume(),
    rampTargetVolumesByTheirReach(),
    applyPerformanceMode(),
    applyHeadRadius(),
    // applyDirectionalityEnabled(),
    // applyDirectionalityAttenuation(),
    applyTargetPosition(),
    applyListenerPosition(),
  ]
}
