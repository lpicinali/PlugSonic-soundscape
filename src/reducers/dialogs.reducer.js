import { set } from 'lodash/fp'

import { ActionType, Dialog } from 'src/constants.js'

const initialState = {
  dialogs: {
    [Dialog.CLOSE_PROMPT]: false,
  },
}

export default function(state = initialState, { type, payload }) {
  if (type === ActionType.SET_SHOULD_SHOW_DIALOG) {
    return set(['dialogs', payload.dialog], payload.show, state)
  }

  return state
}
