/* global window */
/* eslint no-restricted-syntax: 0 */
import { clamp } from 'lodash'

import { audioFiles } from 'src/audio/audio-files.js';
import context from 'src/audio/context.js'
import { getInstance as getBinauralSpatializer } from 'src/audio/binauralSpatializer.js'
import toolkit from 'src/audio/toolkit.js'

window.toolkit = toolkit || { nope: false }

let sourcesNodes = audioFiles.reduce(
  (aggr, file) => ({ ...aggr, [file.name]: null }),
  {}
)
let sourcesInputs = audioFiles.reduce(
  (aggr, file) => ({ ...aggr, [file.name]: context.createGain() }),
  {}
)
let sourcesVolumes = audioFiles.reduce(
  (aggr, file) => ({ ...aggr, [file.name]: context.createGain() }),
  {}
)

const splitterNodes = {}
const attenuationNodes = {}
const mergerNodes = {}

const volume = context.createGain()
volume.gain.value = 0.5

const sourcesVolumeValues = {}

getBinauralSpatializer().then(spatializer => {
  for (const name in sourcesInputs) {
    if (
      Object.prototype.hasOwnProperty.call(sourcesInputs, name) &&
      Object.prototype.hasOwnProperty.call(sourcesVolumes, name) &&
      Object.prototype.hasOwnProperty.call(spatializer.sources, name)
    ) {
      sourcesInputs[name].connect(sourcesVolumes[name])
      sourcesVolumes[name].connect(spatializer.sources[name].processor)
      spatializer.sources[name].processor.connect(volume)

      sourcesVolumes[name].gain.value = 0.5
    }
  }

  // Master volume
  volume.connect(context.destination)
})

/* ======================================================================== */
// CREATE NODE
/* ======================================================================== */
export const createNode = audioBuffer => {
  const node = context.createBufferSource()
  node.buffer = audioBuffer
  node.loop = true
  return node
}

/* ======================================================================== */
// DELETE ALL SOURCE
/* ======================================================================== */
export const deleteAllSources = () => {
  sourcesNodes = {}
  sourcesInputs = {}
  sourcesVolumes = {}
  getBinauralSpatializer().then(spatializer => {
    spatializer.deleteAllSources()
  })
}

/* ======================================================================== */
// SET SOURCE NODE
/* ======================================================================== */
export const setSourceNode = (node, channel) => {
  if (sourcesNodes[channel]) {
    sourcesNodes[channel].disconnect()
  }
  // console.log(`\nChain -> Set Source Node`)
  if (node.buffer.numberOfChannels === 2) {
    sourcesNodes[channel] = node
    // console.log('Stereo')
    // console.log(sourcesNodes[channel])

    attenuationNodes[channel] = context.createGain()
    attenuationNodes[channel].gain.value = 0.5
    splitterNodes[channel] = context.createChannelSplitter(2)
    mergerNodes[channel] = context.createChannelMerger(2)

    sourcesNodes[channel].connect(attenuationNodes[channel])

    attenuationNodes[channel].connect(splitterNodes[channel])

    splitterNodes[channel].connect(mergerNodes[channel],0,0)
    splitterNodes[channel].connect(mergerNodes[channel],1,1)

    mergerNodes[channel].connect(sourcesInputs[channel])
  } else {
    sourcesNodes[channel] = node
    // console.log('Mono')
    // console.log(sourcesNodes[channel])
    sourcesNodes[channel].connect(sourcesInputs[channel])
  }
}

/* ======================================================================== */
// UNSET SOURCE NODE
/* ======================================================================== */
export const unsetSourceNode = channel => {
  if (sourcesNodes[channel]) {
    sourcesNodes[channel].disconnect()
    sourcesNodes[channel] = null
  }
}

/* ======================================================================== */
// MASTER VOLUME
/* ======================================================================== */
// export const setMasterVolume = newVolume => {
//   volume.gain.value = newVolume
// }

/* ======================================================================== */
// SOURCE VOLUME
/* ======================================================================== */
export const setSourceVolume = (filename, newVolume, fadeDuration = 0) => {
  if (newVolume !== sourcesVolumeValues[filename]) {
    sourcesVolumeValues[filename] = newVolume

    const gainNode = sourcesVolumes[filename].gain

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

/* ======================================================================== */
// ADD SOURCE
/* ======================================================================== */
export const addSource = sourceObject => {
  console.log('Chain -> Add Source')
  console.log(sourceObject)
  sourcesNodes[sourceObject.name] = null
  sourcesInputs[sourceObject.name] = context.createGain()
  sourcesVolumes[sourceObject.name] = context.createGain()

  getBinauralSpatializer().then(spatializer => {
    spatializer.addSource(sourceObject)
    sourcesInputs[sourceObject.name].connect(
      sourcesVolumes[sourceObject.name]
    )
    sourcesVolumes[sourceObject.name].connect(
      spatializer.sources[sourceObject.name].processor
    )
    spatializer.sources[sourceObject.name].processor.connect(volume)

    setSourceVolume(sourceObject.name, sourceObject.volume)
  })
}

// export const deleteSources = sourcesFilenames => {
//   sourcesFilenames.forEach(source => {
//     delete sourcesNodes[source]
//     delete sourcesInputs[source]
//     delete sourcesVolumes[source]
//   })
//   getBinauralSpatializer().then(spatializer => {
//     spatializer.deleteSources(sourcesFilenames)
//   })
// }

/* ======================================================================== */
// START NODES
/* ======================================================================== */
export const startNodes = () => {
  if (context.state !== 'running') {
    context.resume();
  }

  for (const filename in sourcesNodes) {
    if (Object.prototype.hasOwnProperty.call(sourcesNodes, filename)) {
      if (sourcesNodes[filename]) {
        sourcesNodes[filename].start(0)
      }
    }
  }
}

/* ======================================================================== */
// STOP NODES
/* ======================================================================== */
export const stopNodes = () => {
  for (const filename in sourcesNodes) {
    if (Object.prototype.hasOwnProperty.call(sourcesNodes, filename)) {
      if (sourcesNodes[filename]) {
        sourcesNodes[filename].disconnect()
        sourcesNodes[filename] = createNode(sourcesNodes[filename].buffer)
        setSourceNode(sourcesNodes[filename], filename)
      }
    }
  }
}
