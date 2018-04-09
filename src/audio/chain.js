/* global window */
/* eslint no-restricted-syntax: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import toolkit from '3dti-toolkit'
import { audioFiles } from 'src/audio/audio-files.js'
import context from 'src/audio/context.js'
import { getInstance as getBinauralSpatializer } from 'src/audio/binauralSpatializer.js'

import // reduce
'lodash'

window.toolkit = toolkit || { nope: false }

const targetNodes = audioFiles.reduce(
  (aggr, file) => ({ ...aggr, [file.filename]: null }),
  {}
)
const targetInputs = audioFiles.reduce(
  (aggr, file) => ({ ...aggr, [file.filename]: context.createGain() }),
  {}
)
const targetVolumes = audioFiles.reduce(
  (aggr, file) => ({ ...aggr, [file.filename]: context.createGain() }),
  {}
)

const volume = context.createGain()
volume.gain.value = 0.5

getBinauralSpatializer().then(spatializer => {
  for (const filename in targetInputs) {
    if (
      Object.prototype.hasOwnProperty.call(targetInputs, filename) &&
      Object.prototype.hasOwnProperty.call(targetVolumes, filename) &&
      Object.prototype.hasOwnProperty.call(spatializer.targets, filename)
    ) {
      targetInputs[filename].connect(targetVolumes[filename])
      targetVolumes[filename].connect(spatializer.targets[filename].processor)
      spatializer.targets[filename].processor.connect(volume)

      targetVolumes[filename].gain.value = 0.5
    }
  }

  // Master volume
  volume.connect(context.destination)
})

export const addSource = source => {
  targetNodes[source.filename] = null
  targetInputs[source.filename] = context.createGain()
  targetVolumes[source.filename] = context.createGain()

  getBinauralSpatializer().then(spatializer => {
    spatializer.addSource(source)
    console.log('')
    console.log(spatializer)
    console.log('')
    targetInputs[source.filename].connect(targetVolumes[source.filename])
    targetVolumes[source.filename].connect(
      spatializer.targets[source.filename].processor
    )
    spatializer.targets[source.filename].processor.connect(volume)

    targetVolumes[source.filename].gain.value = 0.5
  })
}

export const deleteSources = sourcesFilenames => {
  console.log(`chain: DELETE sources - begins`)
  console.log(`sources: ${sourcesFilenames}`)

  sourcesFilenames.forEach(source => {
    delete targetNodes[source]
    delete targetInputs[source]
    delete targetVolumes[source]
  })

  console.log(`targetNodes updated: ${JSON.stringify(targetNodes)}`)
  console.log(`targetInputs updated: ${JSON.stringify(targetInputs)}`)
  console.log(`targetVolumes updated: ${JSON.stringify(targetVolumes)}`)

  getBinauralSpatializer().then(spatializer => {
    spatializer.deleteSources(sourcesFilenames)
    console.log('')
    console.log(spatializer)
    console.log('')
  })
}

export const createNode = audioBuffer => {
  const node = context.createBufferSource()
  node.buffer = audioBuffer
  node.loop = true
  // console.log("chain: createNode");
  // console.log(`audioBuffer: ${audioBuffer}`)
  return node
}

export const setTargetNode = (node, channel) => {
  // console.log("chain: SET TargetNode - begins");
  if (targetNodes[channel]) {
    targetNodes[channel].disconnect()
  }
  targetNodes[channel] = node
  targetNodes[channel].connect(targetInputs[channel])
  // console.log("chain: SET TargetNode - ends");
  // console.log(`node: ${node} , channel: ${channel}`)
  // console.log(`targetNodes[channel]: ${targetNodes[channel]}`);
}

export const unsetTargetNode = channel => {
  // console.log("chain: UNSET TargetNode - begins");
  if (targetNodes[channel]) {
    targetNodes[channel].disconnect()
    targetNodes[channel] = null
  }
  // console.log("chain: UNSET TargetNode - ends");
  // console.log(`channel: ${channel}`)
  // console.log(`targetNodes[channel]: ${targetNodes[channel]}`);
}

export const setMasterVolume = newVolume => {
  volume.gain.value = newVolume
}

export const setTargetVolume = (filename, newVolume) => {
  targetVolumes[filename].gain.value = newVolume
}

export const startNodes = () => {
  // console.log("chain: START NODES - begins");
  for (const filename in targetNodes) {
    if (Object.prototype.hasOwnProperty.call(targetNodes, filename)) {
      if (targetNodes[filename]) {
        // console.log(`chain: START NODES - starting node ${JSON.stringify(targetNodes[filename])}`);
        targetNodes[filename].start(0)
      }
    }
  }
  // console.log("chain: START NODES - ends");
}

export const stopNodes = () => {
  // console.log("chain: STOP NODES - begins");
  for (const filename in targetNodes) {
    if (Object.prototype.hasOwnProperty.call(targetNodes, filename)) {
      if (targetNodes[filename]) {
        targetNodes[filename].disconnect()
        targetNodes[filename] = createNode(targetNodes[filename].buffer)
        setTargetNode(targetNodes[filename], filename)
      }
    }
  }
  // console.log("chain: STOP NODES - ends");
}
