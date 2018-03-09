/* ------------------- NOTES -------------------- *//*

TO DO:
  - transfer listener controls/actions from controls to listener.reducer

*//* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

const initialState = {
  position: { azimuth: Math.PI/2, distance: 0, rotYAxis: 0 },
  isPerformanceModeEnabled: false,
  headRadius: 0.0875,
  // isDirectionalityEnabled: true,
  // directionalityValue: 0,
}


export default function(state = initialState, { type, payload }) {
  if (type === ActionType.SET_LISTENER_POSITION) {
    const newPosition = Object.assign({},state.position);
    Object.assign(newPosition, payload.position);
      // console.log();
      // console.log();
      // console.log("Action: SET LISTENER POSITION");
      // console.log(`Payload.position: ${payload.position.azimuth} , ${payload.position.distance}`);
      // console.log();
      // console.log();
      // console.log("NEW STATE");
      // console.log({ ...state, position: newPosition });
    return { ...state, position: newPosition };
  }
  if (type === ActionType.SET_HEAD_RADIUS) {
    return { ...state, headRadius: payload.radius }
  }
  if (type === ActionType.SET_PERFORMANCE_MODE_ENABLED) {
    // console.log("Reducer: SET PERFORMANCE MODE");
    // console.log(`Payload: ${payload}`);
    return { ...state, isPerformanceModeEnabled: payload.isEnabled }
  }

  return state


  // if (type === ActionType.SET_DIRECTIONALITY_ENABLED) {
  //   return { ...state, isDirectionalityEnabled: payload.isEnabled }
  // }
  // if (type === ActionType.SET_DIRECTIONALITY_VALUE) {
  //   return { ...state, directionalityValue: payload.value }
  // }
}
