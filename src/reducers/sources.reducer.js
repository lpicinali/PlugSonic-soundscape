/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */
/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */
import { omit, set } from 'lodash/fp'

import { PlaybackTiming, ReachAction } from 'src/constants.js'
import { ADEtoXYZ } from 'src/utils.js'

const initialState = {
  sources: {},
  // editing: null,
}

let azimuthIndex = Object.keys(initialState.sources).length

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case 'SOURCE_ONOFF':
      return set(['sources', payload.name, 'selected'], payload.selected, state)

    case 'SET_EDITING_SOURCE': {
      return set('editing', payload.target, state)
    }

    case 'SET_SOURCE_LOOP':
      return set(['sources', payload.source, 'loop'], payload.loop, state)

    case 'SET_SOURCE_SPATIALISED':
      return set(['sources', payload.source, 'spatialised'], payload.spatialised, state)

    case 'SET_SOURCE_POSITION':
      return set(
        ['sources', payload.source, 'position'],
        payload.position,
        state
      )

    case 'SET_SOURCE_REACH_ENABLED':
      return set(
        ['sources', payload.source, 'reach', 'isEnabled'],
        payload.isEnabled,
        state
      )

    case 'SET_SOURCE_REACH_ACTION':
      return set(
        ['sources', payload.source, 'reach', 'action'],
        payload.action,
        state
      )

    case 'SET_SOURCE_REACH_RADIUS':
      return set(
        ['sources', payload.source, 'reach', 'radius'],
        payload.radius,
        state
      )

    case 'SET_SOURCE_REACH_FADE_DURATION':
      return set(
        ['sources', payload.source, 'reach', 'fadeDuration'],
        payload.fadeDuration,
        state
      )

    case 'SET_SOURCE_TIMING':
      return set(
        ['sources', payload.source, 'timings', payload.timing],
        payload.target,
        state
      )

    case 'SET_SOURCE_VOLUME':
      return set(['sources', payload.source, 'volume'], payload.volume, state)

    case 'ADD_SOURCE': {
      const newSource = {
        name: payload.name,
        filename: payload.filename,
        origin: payload.origin,
        hidden: false,
        platform_asset_id: payload.assetId || null,
        platform_media_id: payload.mediaId || null,
        position: payload.position || ADEtoXYZ((azimuthIndex * Math.PI) / 6, 3, 0),
        // raw: payload.raw,
        reach: payload.reach || {
          isEnabled: true,
          action: ReachAction.TOGGLE_VOLUME,
          radius: 3,
          fadeDuration: 1000,
        },
        timings: {
          [PlaybackTiming.PLAY_AFTER]: null,
        },
        loop: true,
        selected: true,
        spatialised: true,
        url: payload.url || null,
        volume: payload.volume || 1.0,
      }

      azimuthIndex += 1

      return set(['sources', payload.name], newSource, state)
    }

    case 'DELETE_SOURCES':
      return set('sources', omit(payload.sources, state.sources), state)

    case 'IMPORT_SOURCES': {
      const newSources = {}
      payload.sources.forEach(source => {
        newSources[source.name] = source
      })
      return { ...state, sources: newSources }
    }

    default:
      return state
  }
}
