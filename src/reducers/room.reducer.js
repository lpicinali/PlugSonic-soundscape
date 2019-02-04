/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType, RoomShape } from 'src/constants.js'

const initialState = {
  shape: RoomShape.RECTANGULAR,
  size: { width: 30, depth: 20, height: 4  },
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
  if (type === ActionType.IMPORT_ROOM) {
    const newRoom = Object.assign({}, payload.room)
    return { ...state, shape: newRoom.shape, size: newRoom.size }
  }
  return state
}
