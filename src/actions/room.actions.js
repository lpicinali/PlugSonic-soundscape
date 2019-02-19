/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

export const setRoomShape = shape => ({
  type: ActionType.SET_ROOM_SHAPE,
  payload: { shape },
})

export const setRoomSize = size => ({
  type: ActionType.SET_ROOM_SIZE,
  payload: { size },
})

export const setRoomImage = image => ({
  type: ActionType.SET_ROOM_IMAGE,
  payload: { image },
})

export const importRoom = room => ({
  type: ActionType.IMPORT_ROOM,
  payload: { room },
})
