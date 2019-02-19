import { ActionType, SpatializationMode } from 'src/constants.js'

const initialState = {
  position: {
    x: 0,
    y: 0,
    z: 0,
    rotZAxis: 0
  },
  spatializationMode: SpatializationMode.HighQuality,
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
  if (type === ActionType.SET_HIGH_PERFORMANCE_MODE) {
    return { ...state, spatializationMode: SpatializationMode.HighPerformance }
  }
  if (type === ActionType.SET_HIGH_QUALITY_MODE) {
    return { ...state, spatializationMode: SpatializationMode.HighQuality }
  }
  if (type === ActionType.IMPORT_LISTENER) {
    return {
      ...state,
      position: payload.listener.position,
      spatializationMode: payload.listener.spatializationMode,
      headRadius: payload.listener.headRadius,
    }
  }

  return state
}
