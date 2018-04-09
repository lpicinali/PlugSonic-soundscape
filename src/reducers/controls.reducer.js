/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType, PlaybackState } from 'src/constants.js'

const initialState = {
  playbackState: PlaybackState.PAUSED,
  masterVolume: 0.5,
  // isPerformanceModeEnabled: false,
  // headRadius: 0.0875,
  // isDirectionalityEnabled: true,
  // directionalityValue: 0,
}

export default function(state = initialState, { type, payload }) {
  if (type === ActionType.SET_MASTER_VOLUME) {
    return { ...state, masterVolume: payload.volume }
  }
  // if (type === ActionType.SET_HEAD_RADIUS) {
  //   return { ...state, headRadius: payload.radius }
  // }
  if (type === ActionType.SET_PLAYBACK_STATE) {
    return { ...state, playbackState: payload.state }
  }
  // if (type === ActionType.SET_PERFORMANCE_MODE_ENABLED) {
  //   // console.log("Action: SET PERFORMANCE MODE");
  //   // console.log(`Payload: ${payload}`);
  //   // console.log("NEW STATE");
  //   // console.log({ ...state, isPerformanceModeEnabled: payload.isEnabled });
  //   return { ...state, isPerformanceModeEnabled: payload.isEnabled }
  // }

  return state

  // if (type === ActionType.SET_DIRECTIONALITY_ENABLED) {
  //   return { ...state, isDirectionalityEnabled: payload.isEnabled }
  // }
  // if (type === ActionType.SET_DIRECTIONALITY_VALUE) {
  //   return { ...state, directionalityValue: payload.value }
  // }
}
