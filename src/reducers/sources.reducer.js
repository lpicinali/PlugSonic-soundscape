/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */
/* ------------------- NOTES -------------------- */ /*

*//* ---------------------------------------------- */
import { set } from 'lodash/fp'
import { ADEtoXYZ } from 'src/utils'
// import { audioFiles, getFileUrl } from 'src/audio/audio-files.js'

const initialState = {
  // sources: {
  //   "Source_1": {
  //     filename: "river_gentle_flow_16bit.wav",
  //     hidden: false,
  //     name: "Source_1",
  //     platform_id: null,
  //     position: {x: 3, y: 0, z: 0},
  //     raw: null,
  //     reach: {radius: 3, fadeDuration: 1000},
  //     selected: true,
  //     spatialised: true,
  //     url: null,
  //     volume: 1,
  //   },
  //   "Source_2": {
  //     filename: "river_gentle_flow_16bit.wav",
  //     hidden: false,
  //     name: "Source_2",
  //     platform_id: null,
  //     position: {x: 3, y: 0, z: 0},
  //     raw: null,
  //     reach: {radius: 3, fadeDuration: 1000},
  //     selected: true,
  //     spatialised: true,
  //     url: null,
  //     volume: 1,
  //   },
  //   "Source_3": {
  //     filename: "river_gentle_flow_16bit.wav",
  //     hidden: false,
  //     name: "Source_3",
  //     platform_id: null,
  //     position: {x: 3, y: 0, z: 0},
  //     raw: null,
  //     reach: {radius: 3, fadeDuration: 1000},
  //     selected: true,
  //     spatialised: true,
  //     url: null,
  //     volume: 1,
  //   },
  // },
  editing: null,
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
      const newSources = Object.assign({}, state.sources)
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
      azimuthIndex += 1
      newSources[payload.name] = newSource
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
