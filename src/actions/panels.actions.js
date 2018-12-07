/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

export const showLeftPanel = () => ({
  type: ActionType.SHOW_LEFT_PANEL,
})

export const hideLeftPanel = () => ({
  type: ActionType.HIDE_LEFT_PANEL,
})
