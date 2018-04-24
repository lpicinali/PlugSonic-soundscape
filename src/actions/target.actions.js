/* eslint import/prefer-default-export: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

export const setTarget = (target, url) => ({
  type: ActionType.SET_TARGET,
  payload: { target, url },
})

export const setEditingTarget = (target) => ({
  type: ActionType.SET_EDITING_TARGET,
  payload: { target },
})

export const setTargetPosition = (target, position) => ({
  type: ActionType.SET_TARGET_POSITION,
  payload: { target, position },
})

export const setTargetReach = (target, radius, fadeDuration) => ({
  type: ActionType.SET_TARGET_REACH,
  payload: { target, radius, fadeDuration },
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

export const importTargets = targets => ({
  type: ActionType.IMPORT_TARGETS,
  payload: { targets },
})

export const importSelected = selected => ({
  type: ActionType.IMPORT_SELECTED,
  payload: { selected },
})
