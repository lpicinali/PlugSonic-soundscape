/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */
/* ------------------- NOTES -------------------- */ /*

*//* ---------------------------------------------- */
import { set } from 'lodash/fp'
import { ADEtoXYZ } from 'src/utils'
// import { audioFiles, getFileUrl } from 'src/audio/audio-files.js'

const initialState = {
  sources: [],
  editing: null,
}

let azimuthIndex = Object.keys(initialState.sources).length


export default function(state = initialState, { type, payload }) {

  switch (type) {

    case 'SET_SOURCE': {
      const newSelected = state.selected.map(x => x)
      const index = newSelected.indexOf(payload.target)
      if (index >= 0) {
        newSelected.splice(index, 1)
      } else {
        newSelected.push(payload.target)
      }
      return { ...state, selected: newSelected }
    }

    case 'SET_EDITING_SOURCE': {
      return set('editing', payload.target, state)
    }

    case 'SET_SOURCE_POSITION': {
      const newTargets = Object.assign({}, state.targets)
      Object.assign(newTargets[payload.target].position, payload.position)
      return { ...state, targets: newTargets }
    }

    case 'SET_SOURCE_REACH': {
      const { radius, fadeDuration } = payload
      return set(
        ['targets', payload.target, 'reach'],
        { radius, fadeDuration },
        state
      )
    }

    case 'SET_SOURCE_VOLUME': {
      const newTargets = Object.assign({}, state.targets)
      newTargets[payload.target].volume = payload.volume
      return { ...state, targets: newTargets }
    }


    case 'ADD_SOURCE': {
      const newSource = {
        filename: payload.filename,
        hidden: false,
        name: payload.name,
        platform_id: null,
        position: ADEtoXYZ(azimuthIndex * Math.PI/6, 3, 0),
        raw: payload.raw,
        reach: { radius: 3, fadeDuration: 1000 },
        selected: true,
        spatialised: true,
        url: null,
        volume: 1.0,
      }
      const newSources = state.sources.slice(0,-1)
      newSources.push(newSource)
      azimuthIndex += 1
      return { ...state, sources: newSources }
    }

    case 'DELETE_TARGETS': {
      const newTargets = Object.assign({}, state.targets)
      payload.targets.forEach(filename => {
        delete newTargets[filename]
      })
      const newSelected = []
      return { ...state, targets: newTargets, selected: newSelected }
    }

    case 'IMPORT_TARGETS': {
      const newTargets = Object.assign({}, payload.targets)
      return { ...state, targets: newTargets }
    }

    case 'IMPORT_SELECTED': {
      const newSelected = payload.selected
      return { ...state, selected: newSelected }
    }

    default:
      return state
  }
}
