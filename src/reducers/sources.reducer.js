/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */
/* ------------------- NOTES -------------------- */ /*

*//* ---------------------------------------------- */
import { omit, set } from 'lodash/fp'

import { ReachAction } from 'src/constants.js'
import { ADEtoXYZ } from 'src/utils.js'
// import { audioFiles, getFileUrl } from 'src/audio/audio-files.js'

const initialState = {
  sources: {},
  // editing: null,
}

let azimuthIndex = Object.keys(initialState.sources).length

export default function(state = initialState, { type, payload }) {

  switch (type) {

    case 'SOURCE_ONOFF': {
      const newSources = Object.assign({}, state.sources)
      newSources[payload.name].selected = !(newSources[payload.name].selected)
      return { ...state, sources: newSources }
    }

    case 'SET_EDITING_SOURCE': {
      return set('editing', payload.target, state)
    }

    case 'SET_SOURCE_LOOP':
      return set(
        ['sources', payload.source, 'loop'],
        payload.loop,
        state
      )

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

    case 'SET_SOURCE_VOLUME':
      return set(
        ['sources', payload.source, 'volume'],
        payload.volume,
        state
      )


    case 'ADD_SOURCE_LOCAL': {
      const newSources = Object.assign({}, state.sources)
      const newSource = {
        filename: payload.filename,
        hidden: false,
        name: payload.name,
        platform_asset_id: null,
        platform_media_id: null,
        position: ADEtoXYZ(azimuthIndex * Math.PI/6, 3, 0),
        raw: payload.raw,
        reach: {
          isEnabled: true,
          action: ReachAction.TOGGLE_VOLUME,
          radius: 3,
          fadeDuration: 1000,
        },
        loop: true,
        selected: true,
        spatialised: true,
        url: null,
        volume: 1.0,
      }
      azimuthIndex += 1
      newSources[payload.name] = newSource
      return { ...state, sources: newSources }
    }

    case 'ADD_SOURCE_REMOTE': {
      const newSources = Object.assign({}, state.sources)
      const newSource = {
        filename: payload.filename,
        hidden: false,
        name: payload.name,
        platform_asset_id: payload.assetId,
        platform_media_id: payload.mediaId,
        position: ADEtoXYZ(azimuthIndex * Math.PI/6, 3, 0),
        raw: null,
        reach: {
          isEnabled: true,
          action: ReachAction.TOGGLE_VOLUME,
          radius: 3,
          fadeDuration: 1000,
        },
        loop: true,
        selected: true,
        spatialised: true,
        url: payload.url,
        volume: 1.0,
      }
      azimuthIndex += 1
      newSources[payload.name] = newSource
      return { ...state, sources: newSources }
    }

    case 'DELETE_SOURCES':
      return set(
        'sources',
        omit(payload.sources, state.sources),
        state
      )

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
