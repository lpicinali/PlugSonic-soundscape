/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'
import { audioFiles } from 'src/audio/audio-files.js'

const initialState = {
  targets: audioFiles.reduce(
    (aggr, file, index) => ({
      ...aggr,
      [file.filename]: {
        title: file.title,
        filename: file.filename,
        url: file.url,
        position: { azimuth: index * Math.PI / 6, distance: 3 },
        volume: 0.5,
        raw: [],
      },
    }),
    {}
  ),
  selected: [],
}

let azimuthIndex = Object.keys(initialState.targets).length

export default function(state = initialState, { type, payload }) {
  if (type === ActionType.SET_TARGET) {
    const newSelected = state.selected.map(x => x)
    const index = newSelected.indexOf(payload.target)
    if (index >= 0) {
      newSelected.splice(index, 1)
    } else {
      newSelected.push(payload.target)
    }
    // console.log("Action: SET TARGET");
    // console.log(`Payload: ${payload}`);
    // console.log("NEW STATE");
    // console.log({ ...state, selected: newSelected });
    return { ...state, selected: newSelected }
  }
  if (type === ActionType.SET_TARGET_POSITION) {
    const newTargets = Object.assign({}, state.targets)
    Object.assign(newTargets[payload.target].position, payload.position)
    // console.log();
    // console.log();
    // console.log("Action: SET TARGET POSITION");
    // console.log(`Payload.target: ${payload.target}`);
    // console.log(`Payload.position: ${payload.position.azimuth} , ${payload.position.distance}`);
    // console.log("NEW STATE");
    // console.log({ ...state, targets: newTargets });
    // console.log();
    // console.log();
    return { ...state, targets: newTargets }
  }
  if (type === ActionType.SET_TARGET_VOLUME) {
    const newTargets = Object.assign({}, state.targets)
    newTargets[payload.target].volume = payload.volume
    // console.log();
    // console.log();
    // console.log("Action: SET TARGET VOLUME");
    // console.log(`Payload.target: ${payload.target}`);
    // console.log(`Payload.volume: ${payload.volume}`);
    // console.log("NEW STATE");
    // console.log({ ...state, targets: newTargets });
    // console.log();
    // console.log();
    return { ...state, targets: newTargets }
  }
  if (type === ActionType.ADD_TARGET) {
    const newTargets = Object.assign({}, state.targets)
    const newTarget = {
      title: payload.title,
      filename: payload.filename,
      url: payload.url,
      position: { azimuth: azimuthIndex * Math.PI / 6, distance: 3 },
      volume: 0.5,
    }
    azimuthIndex += 1
    // console.log(`n = ${n}`);
    // console.log(newTarget);
    newTargets[payload.filename] = newTarget
    // console.log()
    // console.log()
    // console.log('Action: ADD TARGET')
    // console.log(`Payload.title: ${payload.title}`)
    // console.log(`Payload.filename: ${payload.filename}`)
    // console.log(`Payload.url: ${payload.url}`)
    // console.log()
    // console.log()
    return { ...state, targets: newTargets }
  }
  if (type === ActionType.DELETE_TARGETS) {
    const newTargets = Object.assign({}, state.targets)
    payload.targets.forEach(filename => {
      delete newTargets[filename]
    })
    const newSelected = []
    return { ...state, targets: newTargets, selected: newSelected }
  }
  if (type === ActionType.IMPORT_TARGETS) {
    const newTargets = Object.assign({}, payload.targets)
    const newSelected = []
    return { ...state, targets: newTargets, selected: newSelected }
  }

  return state
}
