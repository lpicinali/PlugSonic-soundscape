import { ActionType } from 'src/constants.js'

export const selectTab = tabIndex => ({
  type: ActionType.SELECT_TAB,
  payload: { tabIndex },
})

/**
 * This is essntially a side-effect action which doesn't
 * affect the state, but triggers a saga that performs a
 * sequence of actions.
 */
export const navigateToSourceInMenu = source => ({
  type: ActionType.NAVIGATE_TO_SOURCE_IN_MENU,
  payload: { source },
})
