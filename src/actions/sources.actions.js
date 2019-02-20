/* eslint import/prefer-default-export: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

export const sourceOnOff = (name) => ({
  type: ActionType.SOURCE_ONOFF,
  payload: { name },
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

export const addSourceLocal = (filename, name, raw) => ({
  type: ActionType.ADD_SOURCE_LOCAL,
  payload: { filename, name, raw },
})

export const addSourceRemote = (filename, name, url, assetId, mediaId) => ({
  type: ActionType.ADD_SOURCE_REMOTE,
  payload: { filename, name, url, assetId, mediaId },
})

export const deleteSources = sources => ({
  type: ActionType.DELETE_SOURCES,
  payload: { sources },
})

export const importSources = sources => ({
  type: ActionType.IMPORT_SOURCES,
  payload: { sources },
})
