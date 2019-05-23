/* global window */
/* eslint no-restricted-syntax: 0 */
import { clamp } from 'lodash'
import FileSaver from 'file-saver'
import Recorder from 'recorderjs'

import { getSourceReachGain } from 'src/utils.js'
import context from 'src/audio/context.js'
import { getInstance as getBinauralSpatializer } from 'src/audio/binauralSpatializer.js'
import onloop from 'src/audio/onloop.js'
import toolkit from 'src/audio/toolkit.js'

window.toolkit = toolkit || { nope: false }

const sourceAudioBuffers = {}
const sourceRawData = {}

const sourceNodes = {}
const sourceVolumes = {}
const sourceReachGains = {}
const sourceMuteGains = {}
const sourcePlaybackStates = {}

// Master volume
const masterVolume = context.createGain()
masterVolume.gain.value = 0.5
masterVolume.connect(context.destination)

let recorder

/* ======================================================================== */
// RECORD START
/* ======================================================================== */
export const recordStart = () => {
  recorder = new Recorder(masterVolume)
  console.log('Recorder initialised.')
  // eslint-disable-next-line
  recorder && recorder.record()
  console.log('Recording...')
}
/* ======================================================================== */
// RECORD STOP
/* ======================================================================== */
export const recordStop = () => {
  // eslint-disable-next-line
  recorder && recorder.stop()
  console.log('Stopped recording.')
  const type = 'audio/wav'
  // eslint-disable-next-line
  recorder &&
    recorder.exportWAV(blob => {
      FileSaver.saveAs(blob, 'record.wav')
    }, type)
  recorder.clear()
}

/**
 * Stores a source's audio buffer for future reference
 */
export const storeSourceAudioBuffer = (name, audioBuffer) => {
  sourceAudioBuffers[name] = audioBuffer
}

/**
 * Stores a source's raw data for future reference
 */
export const storeSourceRawData = (name, rawData) => {
  sourceRawData[name] = rawData
}

export const getSourceRawData = (name) => sourceRawData[name]

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
  let node = createSourceAudioNode(audioBuffer)
  node.loop = source.loop
  node.addEventListener('ended', () => notifySourceEnded(source))
  node = onloop(node, () => notifySourceEnded(source))

  const volume = context.createGain()
  const reachGain = context.createGain()
  const muteGain = context.createGain()

  node.connect(volume)
  volume.connect(reachGain)
  reachGain.connect(muteGain)
  muteGain.connect(masterVolume)

  reachGain.gain.value = getSourceReachGain(source)
  muteGain.gain.value = source.enabled === true ? 1 : 0.00001

  sourceNodes[source.name] = node
  sourceVolumes[source.name] = volume
  sourceReachGains[source.name] = reachGain
  sourceMuteGains[source.name] = muteGain
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
    sourceReachGains[name].disconnect()
    sourceMuteGains[name].disconnect()

    sourceNodes[name] = null
    sourceVolumes[name] = null
    sourceReachGains[name] = null
    sourceMuteGains[name] = null
  }
}

/**
 * Sets a source up to be spatialized.
 *
 * Previously: addSource()
 */
export const spatializeSource = (source, spatialised) => {
  if (spatialised) {
    getBinauralSpatializer().then(spatializer => {
      spatializer.addSource(source)

      sourceMuteGains[source.name].disconnect()
      sourceMuteGains[source.name].connect(
        spatializer.sources[source.name].processor
      )
      spatializer.sources[source.name].processor.connect(masterVolume)
    })
  } else {
    sourceMuteGains[source.name].disconnect()
    sourceMuteGains[source.name].connect(masterVolume)
  }
}

export const despatializeSource = source => {
  getBinauralSpatializer().then(spatializer => {
    spatializer.deleteSources([source.name])

    sourceMuteGains[source.name].disconnect()
    sourceMuteGains[source.name].connect(masterVolume)
  })
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

/**
 * Ramps a gain node to a volume over a certain duration.
 */
const setVolume = (gainNode, volume, fadeDuration = 0) => {
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

/**
 * Sets a source's volume
 */
export const setSourceVolume = (name, volume, fadeDuration = 0) => {
  if (sourceVolumes[name]) {
    setVolume(sourceVolumes[name].gain, volume, fadeDuration)
  }
}

/**
 * Sets a source's reach gain
 */
export const setSourceReachGain = (name, gain, fadeDuration = 0) => {
  if (sourceReachGains[name]) {
    setVolume(sourceReachGains[name].gain, gain, fadeDuration)
  }
}

/**
 * Mutes or unmutes a source
 */
export const setSourceMuted = (name, isMuted) => {
  if (sourceMuteGains[name]) {
    setVolume(sourceMuteGains[name].gain, isMuted ? 0.00001 : 1, 300)
  }
}

/**
 * Stops a source's audio
 */
export const stopSource = source => {
  if (sourceNodes[source.name] && sourcePlaybackStates[source.name] === true) {
    sourcePlaybackStates[source.name] = false
    sourceNodes[source.name].stop()
  }
}

/**
 * Plays a source's audio
 */
export const playSource = (source, volume, fadeDuration) => {
  if (context.state !== 'running') {
    context.resume()
  }

  if (sourcePlaybackStates[source.name] === true) {
    return
  }

  if (sourceNodes[source.name]) {
    stopSource(source)
    if (source.spatialised === true) {
      despatializeSource(source)
    }
    destroySourceAudioChain(source)
  }

  createSourceAudioChain(source)
  spatializeSource(source, source.spatialised)

  if (volume !== undefined) {
    setVolume(sourceVolumes[source.name].gain, volume, fadeDuration)
  }

  sourceNodes[source.name].start(0)

  sourcePlaybackStates[source.name] = true
}

export const isSourcePlaying = name => {
  return sourcePlaybackStates[name]
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
