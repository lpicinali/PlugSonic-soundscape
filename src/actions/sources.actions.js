/* eslint import/prefer-default-export: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

export const sourceOnOff = (name, selected) => ({
  type: ActionType.SOURCE_ONOFF,
  payload: { name, selected },
})

export const setEditingSource = source => ({
  type: ActionType.SET_EDITING_SOURCE,
  payload: { source },
})

export const setSourceLoop = (source, loop) => ({
  type: ActionType.SET_SOURCE_LOOP,
  payload: { source, loop },
})

export const setSourceSpatialised = (source, spatialised) => ({
  type: ActionType.SET_SOURCE_SPATIALISED,
  payload: { source, spatialised },
})

export const setSourcePosition = (source, position) => ({
  type: ActionType.SET_SOURCE_POSITION,
  payload: { source, position },
})

export const setSourceReachEnabled = (source, isEnabled) => ({
  type: ActionType.SET_SOURCE_REACH_ENABLED,
  payload: { source, isEnabled },
})

export const setSourceReachAction = (source, action) => ({
  type: ActionType.SET_SOURCE_REACH_ACTION,
  payload: { source, action },
})

export const setSourceReachRadius = (source, radius) => ({
  type: ActionType.SET_SOURCE_REACH_RADIUS,
  payload: { source, radius },
})

export const setSourceReachFadeDuration = (source, fadeDuration) => ({
  type: ActionType.SET_SOURCE_REACH_FADE_DURATION,
  payload: { source, fadeDuration },
})

export const setSourceTiming = (source, timing, target) => ({
  type: ActionType.SET_SOURCE_TIMING,
  payload: { source, timing, target },
})

export const setSourceVolume = (source, volume) => ({
  type: ActionType.SET_SOURCE_VOLUME,
  payload: { source, volume },
})

export const addSource = ({
  filename,
  name,
  origin,
  url,
  assetId,
  mediaId,
  position,
  reach,
  loop,
  selected,
  spatialised,
  volume
}) => ({
  type: ActionType.ADD_SOURCE,
  payload: {
    filename,
    name,
    origin,
    url,
    assetId,
    mediaId,
    position,
    reach,
    loop,
    selected,
    spatialised,
    volume
  },
})

export const deleteSources = sources => ({
  type: ActionType.DELETE_SOURCES,
  payload: { sources },
})

export const importSources = sources => ({
  type: ActionType.IMPORT_SOURCES,
  payload: { sources },
})
