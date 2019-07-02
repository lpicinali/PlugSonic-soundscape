/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

const initialState = {
  importSoundscapeCompleted: false,
}

export default function(state = initialState, { type, payload }) {
  if (type === ActionType.IMPORT_SOUNDSCAPE_COMPLETED) {
    console.log('IMPORT SOUNDSCAPE COMPLETED')
    return { ...state, importSoundscapeCompleted: payload.completed }
  }

  return state
}
