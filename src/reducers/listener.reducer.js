/* ------------------- NOTES -------------------- *//*

*//* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

const initialState = {
  position: { azimuth: 0, distance: 0 },
  // isPerformanceModeEnabled: false,
  // headRadius: 0.0875,
  // isDirectionalityEnabled: true,
  // directionalityValue: 0,
}


export default function(state = initialState, { type, payload }) {
  if (type === ActionType.SET_LISTENER_POSITION) {
    const newPosition = Object.assign({},state.position);
    Object.assign(newPosition, payload.position);
    return { ...state, position: newPosition };
  }
  // if (type === ActionType.SET_HEAD_RADIUS) {
  //   const newListener = Object.assign({},state.listener);
  //   Object.assign(newListener.headRadius, payload.radius);
  //   console.log("Action: SET LISTENER HEAD RADIUS");
  //   console.log(`Payload: ${payload}`);
  //   console.log("NEW STATE");
  //   console.log({ ...state, listener: newListener });
  //   return { ...state, listener: newListener }
  // }
  // if (type === ActionType.SET_PERFORMANCE_MODE_ENABLED) {
  //   const newListener = Object.assign({},state.listener);
  //   Object.assign(newListener.isPerformanceModeEnabled, payload.isEnabled);
  //   console.log("Action: SET PERFORMANCE MODE ENABLED");
  //   console.log(`Payload: ${payload}`);
  //   console.log("NEW STATE");
  //   console.log({ ...state, listener: newListener });
  //   return { ...state, listener: newListener }
  // }

  return state


  // if (type === ActionType.SET_DIRECTIONALITY_ENABLED) {
  //   return { ...state, isDirectionalityEnabled: payload.isEnabled }
  // }
  // if (type === ActionType.SET_DIRECTIONALITY_VALUE) {
  //   return { ...state, directionalityValue: payload.value }
  // }
}
