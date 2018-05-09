/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType, PlaybackState } from 'src/constants.js'

const initialState = {
  playbackState: PlaybackState.PAUSED,
  masterVolume: 0.5,
}

export default function(state = initialState, { type, payload }) {
  if (type === ActionType.SET_MASTER_VOLUME) {
    return { ...state, masterVolume: payload.volume }
  }
  if (type === ActionType.SET_PLAYBACK_STATE) {
    return { ...state, playbackState: payload.state }
  }

  return state
}
