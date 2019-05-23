/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */
/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */
import { omit, set } from 'lodash/fp'

import { PlaybackTiming, ReachAction, TimingStatus } from 'src/constants.js'
import { ADEtoXYZ } from 'src/utils.js'

const initialState = {
  sources: {},
}

let azimuthIndex = Object.keys(initialState.sources).length

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case 'ADD_SOURCE': {
      const newSource = {
        enabled: true,
        filename: payload.filename,
        gameplay: {
          isPlaying: false,
          timingStatus: TimingStatus.INDEPENDENT,
          isWithinReach: false,
        },
        hidden: false,
        loop: true,
        name: payload.name,
        origin: payload.origin,
        platform_asset_id: payload.platform_asset_id || null,
        platform_media_id: payload.platform_media_id || null,
        position:
          payload.position || ADEtoXYZ((azimuthIndex * Math.PI) / 6, 3, 0),
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

    case 'DELETE_SOURCES':
      return set('sources', omit(payload.sources, state.sources), state)

    case 'IMPORT_SOURCES': {
      // const newSources = {}
      // payload.sources.forEach(source => {
      //   newSources[source.name] = source
      // })
      // return { ...state, sources: newSources }
      return { ...state }
    }

    case 'SOURCE_ONOFF':
      return set(['sources', payload.name, 'enabled'], payload.enabled, state)

    case 'SET_SOURCE_SELECTED':
      return set(
        ['sources', payload.source, 'selected'],
        payload.selected,
        state
      )

    case 'SET_SOURCE_HIDDEN':
      return set(['sources', payload.source, 'hidden'], payload.hidden, state)

    case 'SET_SOURCE_LOOP':
      return set(['sources', payload.source, 'loop'], payload.loop, state)

    case 'SET_SOURCE_POSITION':
      return set(
        ['sources', payload.source, 'position'],
        payload.position,
        state
      )

    case 'SET_SOURCE_REACH_ACTION':
      return set(
        ['sources', payload.source, 'reach', 'action'],
        payload.action,
        state
      )

    case 'SET_SOURCE_REACH_ENABLED':
      return set(
        ['sources', payload.source, 'reach', 'enabled'],
        payload.enabled,
        state
      )

    case 'SET_SOURCE_REACH_FADE_DURATION':
      return set(
        ['sources', payload.source, 'reach', 'fadeDuration'],
        payload.fadeDuration,
        state
      )

    case 'SET_SOURCE_REACH_RADIUS':
      return set(
        ['sources', payload.source, 'reach', 'radius'],
        payload.radius,
        state
      )

    case 'SET_SOURCE_SPATIALISED':
      return set(['sources', payload.source, 'spatialised'], payload.spatialised, state)

    case 'SET_SOURCE_TIMING':
      return set(
        ['sources', payload.source, 'timings', payload.timing],
        payload.target,
        state
      )

    case 'SET_SOURCE_VOLUME':
      return set(['sources', payload.source, 'volume'], payload.volume, state)

    // GAMEPLAY STATE
    case 'SET_SOURCE_IS_PLAYING':
      return set(
        ['sources', payload.name, 'gameplay', 'isPlaying'],
        payload.isPlaying,
        state
      )

    case 'SET_SOURCE_TIMING_STATUS':
      return set(
        ['sources', payload.name, 'gameplay', 'timingStatus'],
        payload.status,
        state
      )

    case 'SET_SOURCE_IS_WITHIN_REACH':
      return set(
        ['sources', payload.name, 'gameplay', 'isWithinReach'],
        payload.isWithinReach,
        state
      )

    default:
      return state
  }
}
