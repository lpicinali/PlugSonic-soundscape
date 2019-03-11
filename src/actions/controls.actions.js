/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

export const setMasterVolume = volume => ({
  type: ActionType.SET_MASTER_VOLUME,
  payload: { volume },
})

export const setPlaybackState = state => ({
  type: ActionType.SET_PLAYBACK_STATE,
  payload: { state },
})

export const showSettingsDrawer = () => ({
  type: ActionType.SHOW_SETTINGS_DRAWER,
})

export const hideSettingsDrawer = () => ({
  type: ActionType.HIDE_SETTINGS_DRAWER,
})

export const showArrowsDrawer = () => ({
  type: ActionType.SHOW_ARROWS_DRAWER,
})

export const hideArrowsDrawer = () => ({
  type: ActionType.HIDE_ARROWS_DRAWER,
})
