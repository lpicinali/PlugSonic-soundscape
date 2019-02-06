/* ------------------- NOTES -------------------- */ /*

TO DO:
  - transfer listener controls/actions from controls to listener.reducer

*/ /* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

const initialState = {
  position: {
    x: 0,
    y: 0,
    z: 0,
    rotZAxis: 0
  },
  isPerformanceModeEnabled: false,
  headRadius: 0.0875,
  // isDirectionalityEnabled: true,
  // directionalityValue: 0,
}

export default function(state = initialState, { type, payload }) {

  if (type === ActionType.SET_LISTENER_POSITION) {
    const newPosition = Object.assign({}, state.position)
    Object.assign(newPosition, payload.position)
    return { ...state, position: newPosition }
  }
  if (type === ActionType.SET_HEAD_RADIUS) {
    return { ...state, headRadius: payload.radius }
  }
  if (type === ActionType.SET_PERFORMANCE_MODE_ENABLED) {
    return { ...state, isPerformanceModeEnabled: payload.isEnabled }
  }

  return state
}
