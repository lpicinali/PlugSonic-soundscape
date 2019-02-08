/* eslint import/prefer-default-export: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

export const setSource = (source, url) => ({
  type: ActionType.SET_SOURCE,
  payload: { source, url },
})

export const setEditingSource = (source) => ({
  type: ActionType.SET_EDITING_SOURCE,
  payload: { source },
})

export const setSourcePosition = (source, position) => ({
  type: ActionType.SET_SOURCE_POSITION,
  payload: { source, position },
})

export const setSourceReach = (source, radius, fadeDuration) => ({
  type: ActionType.SET_SOURCE_REACH,
  payload: { source, radius, fadeDuration },
})

export const setSourceVolume = (source, volume) => ({
  type: ActionType.SET_SOURCE_VOLUME,
  payload: { source, volume },
})

export const addSource = (filename, name, raw) => ({
  type: ActionType.ADD_SOURCE,
  payload: { filename, name, raw },
})

export const deleteSources = sources => ({
  type: ActionType.DELETE_SOURCES,
  payload: { sources },
})

export const importSources = sources => ({
  type: ActionType.IMPORT_SOURCES,
  payload: { sources },
})

export const importSelected = selected => ({
  type: ActionType.IMPORT_SELECTED,
  payload: { selected },
})
