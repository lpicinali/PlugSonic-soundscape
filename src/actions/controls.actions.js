/* ------------------- NOTES -------------------- *//*

    from z_controls.actions_0.0_original

     - setTargetPosition moved to target.actions
     - setPerformanceMode added back

*//* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

export const setTargetVolume = volume => ({
  type: ActionType.SET_TARGET_VOLUME,
  payload: { volume },
})

export const setHeadRadius = radius => ({
  type: ActionType.SET_HEAD_RADIUS,
  payload: { radius },
})

export const setPlaybackState = state => ({
  type: ActionType.SET_PLAYBACK_STATE,
  payload: { state },
})

export const setPerformanceMode = isEnabled => ({
  type: ActionType.SET_PERFORMANCE_MODE_ENABLED,
  payload: { isEnabled },
})
//
// export const setDirectionalityEnabled = isEnabled => ({
//   type: ActionType.SET_DIRECTIONALITY_ENABLED,
//   payload: { isEnabled },
// })
//
// export const setDirectionalityValue = value => ({
//   type: ActionType.SET_DIRECTIONALITY_VALUE,
//   payload: { value },
// })
