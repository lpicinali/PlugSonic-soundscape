/* eslint import/prefer-default-export: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

export const setListenerPosition = position => ({
  type: ActionType.SET_LISTENER_POSITION,
  payload: { position },
})

export const setHeadRadius = radius => ({
  type: ActionType.SET_HEAD_RADIUS,
  payload: { radius },
})
//
export const setHighPerformanceMode = () => ({
  type: ActionType.SET_HIGH_PERFORMANCE_MODE,
})

export const setHighQualityMode = () => ({
  type: ActionType.SET_HIGH_QUALITY_MODE,
})

export const importListener = listener => ({
  type: ActionType.IMPORT_LISTENER,
  payload: { listener },
})

export const setHrtfFilename = filename => ({
  type: ActionType.SET_HRTF_FILENAME,
  payload: { filename },
})
