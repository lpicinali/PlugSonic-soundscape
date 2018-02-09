/* eslint no-unused-vars:0 */

/* ------------------- NOTES --------------------------------------------------- *//*

    from z_rootSaga_0.0_original:
      - rename import to play as enginePlay etc. etc.
      - functions modified to new audioFiles data structure (no SonicComponent.TARGET)

    from z_rootSaga_0.1_renaming_filestructure:
      -

*//* ----------------------------------------------------------------------------- */

import {
  call,
//  put,
  select,
  take,
  fork,
  spawn
} from 'redux-saga/effects'
import {
  // get,
  // reduce,
  // values
} from 'lodash'

import {
  ActionType,
  PlaybackState,
} from 'src/constants.js'
import { getFileUrl } from 'src/audio/audio-files.js'
import {
  play as enginePlay,
  pause as enginePause,
  setTargetSource as engineSetTargetSource,
  unsetTargetSource as engineUnsetTargetSource,
  setComponentVolume as engineSetComponentVolume,
  setComponentPosition as engineSetComponentPosition,
  setHeadRadius as engineSetHeadRadius,
  setPerformanceMode as engineSetPerformanceMode
} from 'src/audio/engine.js';

const selected = [];

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

function* manageComponentSource(target) {
  const index = selected.indexOf(target);
  if (index  >= 0) {
    selected.splice(index,1);
    // console.log("rootSaga: UNSET TARGET");
    // console.log(`target: ${target}`);
    // console.log(`selected: ${selected}`);
    yield call(engineUnsetTargetSource, target);
  } else {
    selected.push(target);
    // console.log("rootSaga: SET TARGET");
    // console.log(`target: ${target}`);
    // console.log(`selected: ${selected}`);
    yield call(engineSetTargetSource, getFileUrl(target), target);
  };
  const playbackState = yield select(state => state.controls.playbackState)

  if (playbackState === PlaybackState.PLAYING) {
    yield call(enginePlay)
  }
  // console.log(`rootSaga: SET TARGET -> DONE`)
}

function* applyComponentSource() {
  while (true) {
    const { type, payload } = yield take(ActionType.SET_TARGET);
    yield spawn(manageComponentSource, payload.target);
  }
}

function* applyTargetPosition() {
  while (true) {
    const { payload } = yield take(ActionType.SET_TARGET_POSITION);
    const filename = payload.target;
    const { azimuth, distance } = payload.position;
    // console.log("rootSaga: SET TARGET POSITION");
    // console.log(`filename: ${payload.target} , azimuth: ${azimuth} , distance: ${distance}`);

    engineSetComponentPosition(filename, { azimuth, distance });
    // engineSetComponentPosition(SonicComponent.TARGET, { azimuth, distance })
    // console.log(`rootSaga: SET TARGET POSITION -> DONE`)
  }
}

function* applyComponentVolume() {
  while (true) {
    const { type, payload } = yield take(ActionType.SET_TARGET_VOLUME)
    engineSetComponentVolume(payload.volume)
  }
}

function* applyHeadRadius() {
  while (true) {
    const { payload } = yield take(ActionType.SET_HEAD_RADIUS);
    engineSetHeadRadius(payload.radius);
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
    applyComponentVolume(),
    applyPerformanceMode(),
    applyHeadRadius(),
    // applyDirectionalityEnabled(),
    // applyDirectionalityAttenuation(),
    applyTargetPosition(),
  ]
}
