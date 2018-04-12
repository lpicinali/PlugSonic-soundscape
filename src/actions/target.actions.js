/* eslint import/prefer-default-export: 0 */

/* ------------------- NOTES -------------------- *//*

*//* ---------------------------------------------- */

import { ActionType } from 'src/constants.js';

export const setTarget = target => ({
  type: ActionType.SET_TARGET,
  payload: { target },
})

export const setEditingTarget = (target) => ({
  type: ActionType.SET_EDITING_TARGET,
  payload: { target },
})

export const setTargetPosition = (target, position) => ({
  type: ActionType.SET_TARGET_POSITION,
  payload: { target , position},
})

export const setTargetReach = (target, reach) => ({
  type: ActionType.SET_TARGET_REACH,
  payload: { target, reach },
})

export const setTargetVolume = (target, volume) => ({
  type: ActionType.SET_TARGET_VOLUME,
  payload: { target , volume },
})
