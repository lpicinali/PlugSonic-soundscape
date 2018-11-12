/* eslint import/prefer-default-export:0 */
import { ActionType } from 'src/constants.js'

export const setDisclaimerRead = isRead => ({
  type: ActionType.SET_DISCLAIMER_READ,
  payload: { isRead },
})
