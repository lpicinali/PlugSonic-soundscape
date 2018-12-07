/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

const initialState = {
  showLeftPanel: false,
  showRightPanel: false,
}

export default function(state = initialState, type ) {
  if (type === ActionType.SHOW_LEFT_PANEL) {
    return { ...state, showLeftPanel: true }
  }
  if (type === ActionType.HIDE_LEFT_PANEL) {
    return { ...state, showLeftPanel: false }
  }
  return state
}
