import { ActionType, DEFAULT_Z_POSITION, SpatializationMode } from 'src/constants.js'

const initialState = {
  headRadius: 0.0875,
  hrtfFilename: '3DTI_HRTF_IRC1032_256s_44100Hz.3dti-hrtf',
  position: {
    x: 0,
    y: 0,
    z: DEFAULT_Z_POSITION,
    rotZAxis: 0,
  },
  spatializationMode: SpatializationMode.HighQuality,
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
  if (type === ActionType.SET_HRTF_FILENAME) {
    return { ...state, hrtfFilename: payload.filename }
  }

  return state
}
