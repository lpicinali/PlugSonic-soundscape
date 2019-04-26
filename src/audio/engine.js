/* global window */
/* eslint no-restricted-syntax: 0 */
import { clamp } from 'lodash'
import FileSaver from 'file-saver'
import Recorder from 'recorderjs'

import context from 'src/audio/context.js'
import { getInstance as getBinauralSpatializer } from 'src/audio/binauralSpatializer.js'
import toolkit from 'src/audio/toolkit.js'

window.toolkit = toolkit || { nope: false }

const sourceAudioBuffers = {}

const sourceNodes = {}
const sourceVolumes = {}

// Master volume
const masterVolume = context.createGain()
masterVolume.gain.value = 0.5
masterVolume.connect(context.destination)

let recorder

/* ======================================================================== */
// RECORD START
/* ======================================================================== */
export const recordStart = () => {
  recorder = new Recorder(masterVolume, {workerPath: 'assets/js/recorderWorker.js'})
  console.log('Recorder initialised.')
  // eslint-disable-next-line
  recorder && recorder.record()
  console.log('Recording...');
}
/* ======================================================================== */
// RECORD STOP
/* ======================================================================== */
export const recordStop = () => {
  // // eslint-disable-next-line
  // recorder && recorder.stop();
  // console.log('Stopped recording.')
  // const type = "audio/wav"
  // // eslint-disable-next-line
  // recorder && recorder.exportWAV(blob => {
  //   FileSaver.saveAs(blob, 'record.wav')
  // },type)
  // recorder.clear();
}

/**
 * Stores a source's audio buffer for future reference
 */
export const storeSourceAudioBuffer = (name, audioBuffer) => {
  sourceAudioBuffers[name] = audioBuffer
}

/**
 * Creates a buffer source node with a given audio buffer.
 *
 * Previously: createNode()
 */
export const createSourceAudioNode = audioBuffer => {
  const node = context.createBufferSource()
  node.buffer = audioBuffer
  return node
}

/**
 * Creates and connects audio and effect nodes for a source
 *
 * Previously: setSource()
 */
export const createSourceAudioChain = source => {
  if (sourceNodes[source.name]) {
    sourceNodes[source.name].disconnect()
  }

  const audioBuffer = sourceAudioBuffers[source.name]
  const node = createSourceAudioNode(audioBuffer)
  node.loop = source.loop
  node.addEventListener('ended', () => notifySourceEnded(source))

  const volume = context.createGain()
  setVolume(volume.gain, source.volume)
  node.connect(volume)

  sourceNodes[source.name] = node
  sourceVolumes[source.name] = volume
}

/**
 * Destroys a source's audio chain
 *
 * Previously: unsetSource()
 */
export const destroySourceAudioChain = source => {
  const { name } = source

  if (sourceNodes[name]) {
    sourceNodes[name].disconnect()
    sourceVolumes[name].disconnect()

    sourceNodes[name] = null
    sourceVolumes[name] = null
  }
}

/**
 * Sets a source up to be spatialized.
 *
 * Previously: addSource()
 */
export const spatializeSource = source => {
  getBinauralSpatializer().then(spatializer => {
    spatializer.addSource(source)
    sourceVolumes[source.name].connect(
      spatializer.sources[source.name].processor
    )
    spatializer.sources[source.name].processor.connect(masterVolume)
  })
}

export const despatializeSource = source => {
  getBinauralSpatializer().then(spatializer =>
    spatializer.deleteSources([source.name])
  )
}

/* ======================================================================== */
// MASTER VOLUME
/* ======================================================================== */
// export const setMasterVolume = newVolume => {
//   masterVolume.gain.value = newVolume
// }

/* ======================================================================== */
// SOURCE VOLUME
/* ======================================================================== */
const setVolume = (gainNode, volume, fadeDuration = 10) => {
  // This makes fades act sort of naturally when you change
  // volume again within the duration
  gainNode.cancelScheduledValues(context.currentTime)
  gainNode.setValueAtTime(gainNode.value, context.currentTime)

  // Ramping in the Web Audio API does not allow end values
  // of 0, so we need to make sure to have a tiny little
  // fraction left
  gainNode.exponentialRampToValueAtTime(
    clamp(volume, 0.00001, Infinity),
    context.currentTime + Math.max(0.01, fadeDuration / 1000)
  )
}

export const setSourceVolume = (name, volume, fadeDuration = 10) => {
  if (sourceVolumes[name]) {
    setVolume(sourceVolumes[name].gain, volume, fadeDuration)
  }
}

/**
 * Stops a source's audio
 */
export const stopSource = source => {
  if (sourceNodes[source.name]) {
    sourceNodes[source.name].stop()
  }
}

/**
 * Plays a source's audio
 */
export const playSource = source => {
  if (context.state !== 'running') {
    context.resume()
  }

  if (sourceNodes[source.name]) {
    stopSource(source)
    if (source.spatialised === true) {
      despatializeSource(source)
    }
    destroySourceAudioChain(source)
  }

  createSourceAudioChain(source)
  if (source.spatialised === true) {
    spatializeSource(source)
  }

  sourceNodes[source.name].start(0)
}

/* ======================================================================== */
// LOOP NODES
/* ======================================================================== */
export const setSourceLoop = (name, loop) => {
  if (sourceNodes[name]) {
    sourceNodes[name].loop = loop
  }
}

/* ======================================================================== */
// EVENTS
/* ======================================================================== */
const listeners = []

export const subscribeToSourceEnd = listener => {
  listeners.push(listener)
}

const notifySourceEnded = source => {
  listeners.forEach(listener => listener({ source }))
}
