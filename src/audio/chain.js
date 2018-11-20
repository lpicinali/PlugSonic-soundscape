/* global window */
/* eslint no-restricted-syntax: 0 */

/* ------------------- NOTES -------------------- */ /*

*//* ---------------------------------------------- */
import { clamp } from 'lodash'
import toolkit from '3dti-toolkit'

import { audioFiles } from 'src/audio/audio-files.js';
import context from 'src/audio/context.js'
import { getInstance as getBinauralSpatializer } from 'src/audio/binauralSpatializer.js'

window.toolkit = toolkit || { nope: false }

let targetNodes = audioFiles.reduce(
  (aggr, file) => ({ ...aggr, [file.filename]: null }),
  {}
)
let targetInputs = audioFiles.reduce(
  (aggr, file) => ({ ...aggr, [file.filename]: context.createGain() }),
  {}
)
let targetVolumes = audioFiles.reduce(
  (aggr, file) => ({ ...aggr, [file.filename]: context.createGain() }),
  {}
)

const splitterNodes = {}
const attenuationNodes = {}
const mergerNodes = {}

const volume = context.createGain()
volume.gain.value = 0.5

const targetVolumeValues = {}

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

export const deleteAllSources = () => {
  targetNodes = {}
  targetInputs = {}
  targetVolumes = {}

  getBinauralSpatializer().then(spatializer => {
    spatializer.deleteAllSources()
  })
}

export const createNode = audioBuffer => {
  const node = context.createBufferSource()
  node.buffer = audioBuffer
  node.loop = true
  return node
}

export const setTargetNode = (node, channel) => {
  if (targetNodes[channel]) {
    targetNodes[channel].disconnect()
  }
  console.log(`\nChain -> Set Target Node`)
  if (node.buffer.numberOfChannels === 2) {
    targetNodes[channel] = node
    console.log('Stereo')
    console.log(targetNodes[channel])

    attenuationNodes[channel] = context.createGain()
    attenuationNodes[channel].gain.value = 0.5
    splitterNodes[channel] = context.createChannelSplitter(2)
    mergerNodes[channel] = context.createChannelMerger(2)

    targetNodes[channel].connect(attenuationNodes[channel])

    attenuationNodes[channel].connect(splitterNodes[channel])

    splitterNodes[channel].connect(mergerNodes[channel],0,0)
    splitterNodes[channel].connect(mergerNodes[channel],1,1)

    mergerNodes[channel].connect(targetInputs[channel])
  } else {
    targetNodes[channel] = node
    console.log('Mono')
    console.log(targetNodes[channel])
    targetNodes[channel].connect(targetInputs[channel])
  }
}

export const unsetTargetNode = channel => {
  if (targetNodes[channel]) {
    targetNodes[channel].disconnect()
    targetNodes[channel] = null
  }
}

export const setMasterVolume = newVolume => {
  volume.gain.value = newVolume
}

export const setTargetVolume = (filename, newVolume, fadeDuration = 0) => {
  if (newVolume !== targetVolumeValues[filename]) {
    targetVolumeValues[filename] = newVolume

    const gainNode = targetVolumes[filename].gain

    // This makes fades act sort of naturally when you change
    // volume again within the duration
    gainNode.cancelScheduledValues(context.currentTime)
    gainNode.setValueAtTime(gainNode.value, context.currentTime)

    // Ramping in the Web Audio API does not allow end values
    // of 0, so we need to make sure to have a tiny little
    // fraction left
    gainNode.exponentialRampToValueAtTime(
      clamp(newVolume, 0.00001, Infinity),
      context.currentTime + (fadeDuration / 1000)
    )
  }
}

export const addSource = sourceObject => {
  targetNodes[sourceObject.filename] = null
  targetInputs[sourceObject.filename] = context.createGain()
  targetVolumes[sourceObject.filename] = context.createGain()

  getBinauralSpatializer().then(spatializer => {
    spatializer.addSource(sourceObject)
    targetInputs[sourceObject.filename].connect(
      targetVolumes[sourceObject.filename]
    )
    targetVolumes[sourceObject.filename].connect(
      spatializer.targets[sourceObject.filename].processor
    )
    spatializer.targets[sourceObject.filename].processor.connect(volume)

    setTargetVolume(sourceObject.filename, sourceObject.volume)
  })
}

export const deleteSources = sourcesFilenames => {
  sourcesFilenames.forEach(source => {
    delete targetNodes[source]
    delete targetInputs[source]
    delete targetVolumes[source]
  })
  getBinauralSpatializer().then(spatializer => {
    spatializer.deleteSources(sourcesFilenames)
  })
}

export const startNodes = () => {
  if (context.state !== 'running') {
    context.resume();
  }

  for (const filename in targetNodes) {
    if (Object.prototype.hasOwnProperty.call(targetNodes, filename)) {
      if (targetNodes[filename]) {
        targetNodes[filename].start(0)
      }
    }
  }
}

export const stopNodes = () => {
  for (const filename in targetNodes) {
    if (Object.prototype.hasOwnProperty.call(targetNodes, filename)) {
      if (targetNodes[filename]) {
        targetNodes[filename].disconnect()
        targetNodes[filename] = createNode(targetNodes[filename].buffer)
        setTargetNode(targetNodes[filename], filename)
      }
    }
  }
}
