/* eslint import/prefer-default-export: 0 */

/* ------------------- NOTES -------------------- *//*

*//* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

export const setListenerPosition = position => ({
  type: ActionType.SET_LISTENER_POSITION,
  payload: { position },
})

export const setHeadRadius = radius => ({
  type: ActionType.SET_HEAD_RADIUS,
  payload: { radius },
})

export const setPerformanceMode = isEnabled => ({
  type: ActionType.SET_PERFORMANCE_MODE_ENABLED,
  payload: { isEnabled },
})

// export const setDirectionalityEnabled = isEnabled => ({
//   type: ActionType.SET_DIRECTIONALITY_ENABLED,
//   payload: { isEnabled },
// })
//
// export const setDirectionalityValue = value => ({
//   type: ActionType.SET_DIRECTIONALITY_VALUE,
//   payload: { value },
// })
