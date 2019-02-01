import { set } from 'lodash/fp'

import { ActionType } from 'src/constants.js'

const initialState = {
  hasDismissedPresetInfo: false,
  hasReadDisclaimer: false,
}

export default function(state = initialState, { type, payload }) {
  if (type === ActionType.SET_DISCLAIMER_READ) {
    return set('hasReadDisclaimer', payload.isRead, state)
  }
  
  return state
}
