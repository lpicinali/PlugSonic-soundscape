import { set } from 'lodash/fp'

import { ActionType } from 'src/constants.js'

const initialState = {
  currentTabIndex: 1,
}

export default function(state = initialState, { type, payload }) {
  if (type === ActionType.SELECT_TAB) {
    return set('currentTabIndex', payload.tabIndex, state)
  }

  return state
}
