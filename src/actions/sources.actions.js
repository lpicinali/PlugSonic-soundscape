/* eslint import/prefer-default-export: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

export const addSource = ({
  filename,
  name,
  enabled,
  origin,
  url,
  platform_asset_id,
  platform_media_id,
  position,
  reach,
  loop,
  hidden,
  selected,
  spatialised,
  volume,
  raw,
}) => ({
  type: ActionType.ADD_SOURCE,
  payload: {
    filename,
    name,
    enabled,
    origin,
    url,
    platform_asset_id,
    platform_media_id,
    position,
    reach,
    loop,
    hidden,
    selected,
    spatialised,
    volume,
    raw,
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

export const setSourceHidden = (source, hidden) => ({
  type: ActionType.SET_SOURCE_HIDDEN,
  payload: { source, hidden },
})

export const setSourceLoop = (source, loop) => ({
  type: ActionType.SET_SOURCE_LOOP,
  payload: { source, loop },
})

export const sourceOnOff = (name, enabled) => ({
  type: ActionType.SOURCE_ONOFF,
  payload: { name, enabled },
})

export const setSourcePosition = (source, position) => ({
  type: ActionType.SET_SOURCE_POSITION,
  payload: { source, position },
})

export const setSourceReachAction = (source, action) => ({
  type: ActionType.SET_SOURCE_REACH_ACTION,
  payload: { source, action },
})

export const setSourceReachEnabled = (source, enabled) => ({
  type: ActionType.SET_SOURCE_REACH_ENABLED,
  payload: { source, enabled },
})

export const setSourceReachFadeDuration = (source, fadeDuration) => ({
  type: ActionType.SET_SOURCE_REACH_FADE_DURATION,
  payload: { source, fadeDuration },
})

export const setSourceReachRadius = (source, radius) => ({
  type: ActionType.SET_SOURCE_REACH_RADIUS,
  payload: { source, radius },
})

export const setSourceSelected = (source, selected) => ({
  type: ActionType.SET_SOURCE_SELECTED,
  payload: { source, selected },
})

export const setSourceSpatialised = (source, spatialised) => ({
  type: ActionType.SET_SOURCE_SPATIALISED,
  payload: { source, spatialised },
})

export const setSourceTiming = (source, timing, target) => ({
  type: ActionType.SET_SOURCE_TIMING,
  payload: { source, timing, target },
})

export const setSourceVolume = (source, volume) => ({
  type: ActionType.SET_SOURCE_VOLUME,
  payload: { source, volume },
})

/**
 * Source gameplay states
 */
export const setSourceIsPlaying = (name, isPlaying) => ({
  type: ActionType.SET_SOURCE_IS_PLAYING,
  payload: { name, isPlaying },
})

export const setSourceTimingStatus = (name, status) => ({
  type: ActionType.SET_SOURCE_TIMING_STATUS,
  payload: { name, status },
})

export const setSourceIsWithinReach = (name, isWithinReach) => ({
  type: ActionType.SET_SOURCE_IS_WITHIN_REACH,
  payload: { name, isWithinReach },
})

// Misc

export const focusSourcePanelItem = name => ({
  type: ActionType.FOCUS_SOURCE_PANEL_ITEM,
  payload: { name },
})
