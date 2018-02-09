/* eslint import/prefer-default-export: 0 */

/* ------------------- NOTES -------------------- *//*

    from z_target.actions_0.0_original

     - setTargetPosition moved from controls.actions
     - setTargetPosition changed for multiple sources (id,position)

*//* ---------------------------------------------- */

import { ActionType } from 'src/constants.js';

export const setTarget = target => ({
  type: ActionType.SET_TARGET,
  payload: { target },
})

export const setTargetPosition = (target, position) => ({
  type: ActionType.SET_TARGET_POSITION,
  payload: {target, position},
})
