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
