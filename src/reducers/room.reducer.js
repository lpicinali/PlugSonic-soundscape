/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType, RoomShape } from 'src/constants.js'

const initialState = {
  shape: RoomShape.ROUND,
  size: { width: 30, depth: 30, height: 4  },
  image: {
    filename: '',
    size: '',
    type: '',
    preview: '',
    raw: '',
    }
}

export default function(state = initialState, { type, payload }) {
  if (type === ActionType.SET_ROOM_SHAPE) {
    return { ...state, shape: payload.shape }
  }
  if (type === ActionType.SET_ROOM_SIZE) {
    const newSize = Object.assign({}, state.size)
    Object.assign(newSize, payload.size)
    return { ...state, size: newSize }
  }
  if (type === ActionType.SET_ROOM_IMAGE) {
    const newImage = Object.assign({}, state.image)
    Object.assign(newImage, payload.image)
    return { ...state, image: newImage }
  }
  if (type === ActionType.IMPORT_ROOM) {
    // const newRoom = Object.assign({}, payload.room)
    return { ...state, shape: payload.room.shape, size: payload.room.size }
  }
  return state
}
