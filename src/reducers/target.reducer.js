/* ------------------- NOTES -------------------- */ /*

*//* ---------------------------------------------- */
import { set } from 'lodash/fp'

// import { ActionType } from 'src/constants.js'
import { audioFiles } from 'src/audio/audio-files.js'

const initialState = {
  targets: audioFiles.reduce(
    (aggr, file, index) => ({
      ...aggr,
      [file.filename]: {
        title: file.title,
        filename: file.filename,
        url: file.url,
        position: { azimuth: index * Math.PI / 6, distance: 3, /* elevation: 0 */ },
        volume: 0.5,
        reach: {
          radius: 3,
          fadeDuration: 1000,
        },
        raw: {},
      },
    }),
    {}
  ),
  selected: [],
  editing: null,
}

let azimuthIndex = Object.keys(initialState.targets).length


export default function(state = initialState, { type, payload }) {

  switch (type) {

    case 'SET_TARGET' : {
      const newSelected = state.selected.map(x => x)
      const index = newSelected.indexOf(payload.target)
      if (index >= 0) {
        newSelected.splice(index, 1)
      } else {
        newSelected.push(payload.target)
      }
      return { ...state, selected: newSelected }
    }

    case 'SET_EDITING_TARGET': {
      return set('editing', payload.target, state)
    }

    case 'SET_TARGET_POSITION': {
      const newTargets = Object.assign({}, state.targets)
      Object.assign(newTargets[payload.target].position, payload.position)
      return { ...state, targets: newTargets }
    }

    case 'SET_TARGET_REACH': {
      const { radius, fadeDuration } = payload
      return set(
        ['targets', payload.target, 'reach'],
        { radius, fadeDuration },
        state
      )
    }

    case 'SET_TARGET_VOLUME': {
      const newTargets = Object.assign({}, state.targets)
      newTargets[payload.target].volume = payload.volume
      return { ...state, targets: newTargets }
    }


    case 'ADD_TARGET': {
      const newTargets = Object.assign({}, state.targets)
      const newTarget = {
        title: payload.title,
        filename: payload.filename,
        url: payload.url,
        position: { azimuth: azimuthIndex * Math.PI / 6, distance: 3 },
        volume: 0.5,
        reach: {
          radius: 3,
          fadeDuration: 1000,
        },
        raw: {},
      }
      azimuthIndex += 1
      newTargets[payload.filename] = newTarget
      return { ...state, targets: newTargets }
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

  // if (type === ActionType.SET_TARGET) {
  //   const newSelected = state.selected.map(x => x)
  //   const index = newSelected.indexOf(payload.target)
  //   if (index >= 0) {
  //     newSelected.splice(index, 1)
  //   } else {
  //     newSelected.push(payload.target)
  //   }
  //   return { ...state, selected: newSelected }
  // }
  //
  // if (type === ActionType.SET_EDITING_TARGET) {
  //   return set('editing', payload.target, state)
  // }
  //
  // if (type === ActionType.SET_TARGET_POSITION) {
  //   const newTargets = Object.assign({}, state.targets)
  //   Object.assign(newTargets[payload.target].position, payload.position)
  //   return { ...state, targets: newTargets }
  // }
  //
  // if (type === ActionType.SET_TARGET_REACH) {
  //   const { radius, fadeDuration } = payload
  //   return set(
  //     ['targets', payload.target, 'reach'],
  //     { radius, fadeDuration },
  //     state
  //   )
  // }
  //
  // if (type === ActionType.SET_TARGET_VOLUME) {
  //   const newTargets = Object.assign({}, state.targets)
  //   newTargets[payload.target].volume = payload.volume
  //   return { ...state, targets: newTargets }
  // }
  //
  // if (type === ActionType.ADD_TARGET) {
  //   const newTargets = Object.assign({}, state.targets)
  //   const newTarget = {
  //     title: payload.title,
  //     filename: payload.filename,
  //     url: payload.url,
  //     position: { azimuth: azimuthIndex * Math.PI / 6, distance: 3 },
  //     volume: 0.5,
  //     reach: {
  //       radius: 3,
  //       fadeDuration: 1000,
  //     },
  //     raw: {},
  //   }
  //   azimuthIndex += 1
  //   newTargets[payload.filename] = newTarget
  //   return { ...state, targets: newTargets }
  // }
  //
  // if (type === ActionType.DELETE_TARGETS) {
  //   const newTargets = Object.assign({}, state.targets)
  //   payload.targets.forEach(filename => {
  //     delete newTargets[filename]
  //   })
  //   const newSelected = []
  //   return { ...state, targets: newTargets, selected: newSelected }
  // }
  //
  // if (type === ActionType.IMPORT_TARGETS) {
  //   const newTargets = Object.assign({}, payload.targets)
  //   return { ...state, targets: newTargets }
  // }
  //
  // if (type === ActionType.IMPORT_SELECTED) {
  //   const newSelected = payload.selected
  //   return { ...state, selected: newSelected }
  // }
  //
  // return state
// }
