/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType, PlaybackState } from 'src/constants.js'

const initialState = {
  playbackState: PlaybackState.STOP,
  masterVolume: 0.5,
  showSettingsDrawer: true,
  showArrowsDrawer: true,
}

export default function(state = initialState, { type, payload }) {
  if (type === ActionType.SET_MASTER_VOLUME) {
    return { ...state, masterVolume: payload.volume }
  }
  if (type === ActionType.SET_PLAYBACK_STATE) {
    console.log(`Controls -> ${payload.state}`)
    return { ...state, playbackState: payload.state }
  }
  if (type === ActionType.SHOW_SETTINGS_DRAWER) {
    return { ...state, showSettingsDrawer: true, }
  }
  if (type === ActionType.HIDE_SETTINGS_DRAWER) {
    return { ...state, showSettingsDrawer: false, }
  }
  if (type === ActionType.SHOW_ARROWS_DRAWER) {
    return { ...state, showArrowsDrawer: true, }
  }
  if (type === ActionType.HIDE_ARROWS_DRAWER) {
    return { ...state, showArrowsDrawer: false, }
  }
  return state
}
