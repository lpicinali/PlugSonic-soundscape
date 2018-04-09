/* eslint import/prefer-default-export: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

export const setTarget = (target, url) => ({
  type: ActionType.SET_TARGET,
  payload: { target, url },
})

export const setTargetPosition = (target, position) => ({
  type: ActionType.SET_TARGET_POSITION,
  payload: { target, position },
})

export const setTargetVolume = (target, volume) => ({
  type: ActionType.SET_TARGET_VOLUME,
  payload: { target, volume },
})

export const addTarget = (title, filename, url) => ({
  type: ActionType.ADD_TARGET,
  payload: { title, filename, url },
})

export const deleteTargets = targets => ({
  type: ActionType.DELETE_TARGETS,
  payload: { targets },
})
