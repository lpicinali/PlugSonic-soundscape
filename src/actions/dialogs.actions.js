/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

// export const importSoundscapeCompleted = completed => ({
//   type: ActionType.IMPORT_SOUNDSCAPE_COMPLETED,
//   payload: { completed },
// })

export const setShouldShowDialog = (dialog, show) => ({
  type: ActionType.SET_SHOULD_SHOW_DIALOG,
  payload: { dialog, show },
})
