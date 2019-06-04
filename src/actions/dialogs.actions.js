/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

export const importSoundscapeCompleted = completed => ({
  type: ActionType.IMPORT_SOUNDSCAPE_COMPLETED,
  payload: { completed },
})
