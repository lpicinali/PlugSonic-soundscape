/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType, RoomShape } from 'src/constants.js'

const initialState = {
  backgroundImage: {
    assetId: '',
    mediaId: '',
    raw: '',
  },
  shape: RoomShape.RECTANGULAR,
  size: { width: 30, depth: 20, height: 4 },
}

export default function(state = initialState, { type, payload }) {
  if (type === ActionType.IMPORT_ROOM) {
    return {
      ...state,
      shape: payload.room.shape,
      size: payload.room.size,
      backgroundImage: payload.room.backgroundImage,
    }
  }

  if (type === ActionType.SET_ROOM_IMAGE) {
    const newImage = Object.assign({}, state.backgroundImage)
    Object.assign(newImage, payload.image)
    return { ...state, backgroundImage: newImage }
  }

  if (type === ActionType.SET_ROOM_SHAPE) {
    return { ...state, shape: payload.shape }
  }

  if (type === ActionType.SET_ROOM_SIZE) {
    const newSize = Object.assign({}, state.size)
    Object.assign(newSize, payload.size)
    return { ...state, size: newSize }
  }

  return state
}
