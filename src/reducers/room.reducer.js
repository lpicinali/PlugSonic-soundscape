/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType, RoomShape } from 'src/constants.js'

const initialState = {
  shape: RoomShape.RECTANGULAR,
  size: { width: 20, height: 10 },
}

export default function(state = initialState, { type, payload }) {
  if (type === ActionType.SET_ROOM_SHAPE) {
    // console.log("Action: SET ROOM SHAPE");
    // console.log(`Payload: ${payload}`);
    return { ...state, shape: payload.shape }
  }
  if (type === ActionType.SET_ROOM_SIZE) {
    const newSize = Object.assign({}, state.size)
    Object.assign(newSize, payload.size)
    // console.log("Action: SET ROOM SIZE");
    // console.log(`Payload: ${payload}`);
    // console.log("NEW STATE");
    // console.log({ ...state, size: newSize });
    return { ...state, size: newSize }
  }
  if (type === ActionType.IMPORT_ROOM) {
    const newRoom = Object.assign({}, payload.room)
    return { ...state, shape: newRoom.shape, size: newRoom.size }
  }
  return state
}
