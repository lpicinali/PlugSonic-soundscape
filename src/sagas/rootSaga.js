/* eslint no-unused-vars:0 */
/* eslint prefer-destructuring: 0 */

/* ------------------- NOTES --------------------------------------------------- */ /*

*/ /* ----------------------------------------------------------------------------- */

import {
  call,
  put,
  select,
  take,
  fork,
  spawn,
} from 'redux-saga/effects'
import {
  // get,
  // reduce,
  // values
  map,
} from 'lodash'

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
  importSources as engineImportSources
} from 'src/audio/engine.js'

// const selected = [];

function* applyPlayPause() {
  while (true) {
    const { payload: { state } } = yield take(ActionType.SET_PLAYBACK_STATE)

    if (state === PlaybackState.PLAYING) {
      // console.log("rootSaga: PLAY");
      enginePlay()
    } else if (state === PlaybackState.PAUSED) {
      // console.log("rootSaga: PAUSE");
      enginePause()
    }
  }
}

function* manageComponentSource(target, url) {
  const selected = yield select(state => state.target.selected)
  // console.log(`selected: ${selected}`);
  const index = selected.indexOf(target)
  if (index >= 0) {
    // selected.splice(index,1);
    // console.log("rootSaga: SET TARGET");
    // console.log(`target: ${target}`);
    // console.log(`selected: ${selected}`);
    yield call(engineSetTargetSource, target, url)
  } else {
    // selected.push(target);
    // console.log("rootSaga: UNSET TARGET");
    // console.log(`target: ${target}`);
    // console.log(`selected: ${selected}`);
    // yield call(engineSetTargetSource, getFileUrl(target), target);
    yield call(engineUnsetTargetSource, target)
  }
  const playbackState = yield select(state => state.controls.playbackState)

  if (playbackState === PlaybackState.PLAYING) {
    yield call(enginePlay)
  }
  // console.log(`rootSaga: SET TARGET -> DONE`)
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
    const file = selected[i]
    const url = targets[file].url
    yield call(engineSetTargetSource, file, url)
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
    console.log(`rootSaga: DELETE TARGETS`)
    console.log(`selected: ${selected}`)
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
    console.log(sources)
    engineImportSources(sources)
  }
}

function* applyTargetPosition() {
  while (true) {
    const { payload } = yield take(ActionType.SET_TARGET_POSITION)
    const filename = payload.target
    const { azimuth, distance } = payload.position
    // console.log("rootSaga: SET TARGET POSITION");
    // console.log(`filename: ${payload.target} , azimuth: ${azimuth} , distance: ${distance}`);
    engineSetComponentPosition(filename, { azimuth, distance })
    // engineSetComponentPosition(SonicComponent.TARGET, { azimuth, distance })
    // console.log(`rootSaga: SET TARGET POSITION -> DONE`)
  }
}

function* applyListenerPosition() {
  while (true) {
    const { payload } = yield take(ActionType.SET_LISTENER_POSITION)
    const { azimuth, distance, rotYAxis } = payload.position
    // console.log("rootSaga: SET LISTENER POSITION");
    // console.log(`azimuth: ${azimuth} , distance: ${distance}`);
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

function* applyHeadRadius() {
  while (true) {
    const { payload } = yield take(ActionType.SET_HEAD_RADIUS)
    engineSetHeadRadius(payload.radius)
  }
}

function* applyPerformanceMode() {
  while (true) {
    const { payload } = yield take(ActionType.SET_PERFORMANCE_MODE_ENABLED)
    // console.log("Saga: APPLY PERFORMANCE MODE");
    // console.log(`Payload: ${payload}`);
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
    applyMasterVolume(),
    applyTargetVolume(),
    applyPerformanceMode(),
    applyHeadRadius(),
    // applyDirectionalityEnabled(),
    // applyDirectionalityAttenuation(),
    applyTargetPosition(),
    applyListenerPosition(),
  ]
}
