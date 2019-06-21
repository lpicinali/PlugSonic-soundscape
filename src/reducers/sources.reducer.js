/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */
/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */
import { omit, set } from 'lodash/fp'

import {
  DEFAULT_Z_POSITION,
  PlaybackTiming,
  ReachAction,
  SourcePositioning,
  TimingStatus,
  ActionType,
} from 'src/constants.js'
import { ADEtoXYZ } from 'src/utils.js'

const initialState = {
  sources: {},
  focusedItem: null,
}

let azimuthIndex = Object.keys(initialState.sources).length

export default function(state = initialState, { type, payload }) {
  if (type === ActionType.ADD_SOURCE) {
    const defaultPosition = {
      ...ADEtoXYZ((azimuthIndex * Math.PI) / 6, 3, 0),
      z: DEFAULT_Z_POSITION,
    }

    const newSource = {
      enabled: true,
      filename: payload.filename,
      gameplay: {
        isPlaying: false,
        timingStatus: TimingStatus.INDEPENDENT,
        isWithinReach: false,
      },
      hidden: payload.hidden || false,
      loop: true,
      name: payload.name,
      origin: payload.origin,
      platform_asset_id: payload.platform_asset_id || null,
      platform_media_id: payload.platform_media_id || null,
      positioning: SourcePositioning.ABSOLUTE,
      position: payload.position || defaultPosition,
      relativePosition: {
        azimuth: 0,
        distance: 3,
        elevation: 1.7,
      },
      raw: null,
      reach: payload.reach || {
        action: ReachAction.TOGGLE_VOLUME,
        enabled: true,
        fadeDuration: 1000,
        radius: 3,
      },
      spatialised: true,
      timings: {
        [PlaybackTiming.PLAY_AFTER]: null,
      },
      url: payload.url || null,
      volume: payload.volume || 1.0,
      selected: false,
    }

    azimuthIndex += 1

    return set(['sources', payload.name], newSource, state)
  }

  if (type === ActionType.DELETE_SOURCES) {
    return set('sources', omit(payload.sources, state.sources), state)
  }

  if (type === ActionType.IMPORT_SOURCES) {
    // const newSources = {}
    // payload.sources.forEach(source => {
    //   newSources[source.name] = source
    // })
    // return { ...state, sources: newSources }
    return { ...state }
  }

  if (type === ActionType.SOURCE_ONOFF) {
    return set(['sources', payload.name, 'enabled'], payload.enabled, state)
  }

  if (type === ActionType.SET_SOURCE_SELECTED) {
    return set(
      ['sources', payload.source, 'selected'],
      payload.selected,
      state
    )
  }

  if (type === ActionType.SET_SOURCE_HIDDEN) {
    return set(['sources', payload.source, 'hidden'], payload.hidden, state)
  }

  if (type === ActionType.SET_SOURCE_LOOP) {
    return set(['sources', payload.source, 'loop'], payload.loop, state)
  }

  if (type === ActionType.SET_SOURCE_POSITION) {
    return set(['sources', payload.source, 'position'], payload.position, state)
  }

  if (type === ActionType.SET_SOURCE_RELATIVE_POSITION) {
    return set(
      ['sources', payload.source, 'relativePosition'],
      payload.position,
      state
    )
  }

  if (type === ActionType.SET_SOURCE_REACH_ACTION) {
    return set(
      ['sources', payload.source, 'reach', 'action'],
      payload.action,
      state
    )
  }

  if (type === ActionType.SET_SOURCE_REACH_ENABLED) {
    return set(
      ['sources', payload.source, 'reach', 'enabled'],
      payload.enabled,
      state
    )
  }

  if (type === ActionType.SET_SOURCE_REACH_FADE_DURATION) {
    return set(
      ['sources', payload.source, 'reach', 'fadeDuration'],
      payload.fadeDuration,
      state
    )
  }

  if (type === ActionType.SET_SOURCE_REACH_RADIUS) {
    return set(
      ['sources', payload.source, 'reach', 'radius'],
      payload.radius,
      state
    )
  }

  if (type === ActionType.SET_SOURCE_SPATIALISED) {
    return set(
      ['sources', payload.source, 'spatialised'],
      payload.spatialised,
      state
    )
  }

  if (type === ActionType.SET_SOURCE_POSITIONING) {
    return set(
      ['sources', payload.source, 'positioning'],
      payload.positioning,
      state
    )
  }

  if (type === ActionType.SET_SOURCE_TIMING) {
    return set(
      ['sources', payload.source, 'timings', payload.timing],
      payload.target,
      state
    )
  }

  if (type === ActionType.SET_SOURCE_VOLUME) {
    return set(['sources', payload.source, 'volume'], payload.volume, state)
  }

  // GAMEPLAY STATE
  if (type === ActionType.SET_SOURCE_IS_PLAYING) {
    return set(
      ['sources', payload.name, 'gameplay', 'isPlaying'],
      payload.isPlaying,
      state
    )
  }

  if (type === ActionType.SET_SOURCE_TIMING_STATUS) {
    return set(
      ['sources', payload.name, 'gameplay', 'timingStatus'],
      payload.status,
      state
    )
  }

  if (type === ActionType.SET_SOURCE_IS_WITHIN_REACH) {
    return set(
      ['sources', payload.name, 'gameplay', 'isWithinReach'],
      payload.isWithinReach,
      state
    )
  }

  // MISC
  if (type === ActionType.FOCUS_SOURCE_PANEL_ITEM) {
    return set('focusedItem', payload.name, state)
  }

  return state
}
