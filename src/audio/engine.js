/* global window */
/* eslint no-restricted-syntax: 0 */
import { clamp } from 'lodash'
import FileSaver from 'file-saver'
import Recorder from 'recorderjs'

import { ReachAction, SourcePositioning } from 'src/constants.js'
import { getSourceReachGain } from 'src/utils.js'
import context from 'src/audio/context.js'
import { getInstance as getBinauralSpatializer } from 'src/audio/binauralSpatializer.js'
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
// STORE SOURCES
/* ======================================================================== */

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

/**
 * Returns source's raw data
 */
export const getSourceRawData = name => sourceRawData[name]

/* ======================================================================== */
// AUDIO CHAIN
/* ======================================================================== */

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
  node.onended = () => {
    notifySourceEnded(source)
  }

  const volume = context.createGain()
  const reachGain = context.createGain()
  const muteGain = context.createGain()

  node.connect(volume)
  if (source.positioning === SourcePositioning.ABSOLUTE) {
    volume.connect(reachGain)
    reachGain.connect(muteGain)
  } else {
    volume.connect(muteGain)
  }
  muteGain.connect(masterVolume)

  volume.gain.value = clamp(source.volume, 0.00001, Infinity)
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

/* ======================================================================== */
// AUDIO NODE
/* ======================================================================== */

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

/* ======================================================================== */
// SOURCE
/* ======================================================================== */

/**
 * Sets a source up to be spatialized or not.
 *
 * Previously: addSource()
 */
export const spatializeSource = source => {
  getBinauralSpatializer().then(spatializer => {
    spatializer.addSource(source)

    sourceMuteGains[source.name].disconnect()
    sourceMuteGains[source.name].connect(
      spatializer.sources[source.name].processor
    )
    spatializer.sources[source.name].processor.connect(masterVolume)
  })
}

/**
 * Disables a source's spatialisation.
 *
 */
export const despatializeSource = source => {
  getBinauralSpatializer().then(spatializer => {
    spatializer.deleteSources([source.name])

    sourceMuteGains[source.name].disconnect()
    sourceMuteGains[source.name].connect(masterVolume)
  })
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

    // Store a reference to the current source's audio node
    // to check that we're not stopping a new node after fading
    // is done
    const sourceNode = sourceNodes[source.name]

    if (
      source.reach.enabled === true &&
      source.reach.action === ReachAction.TOGGLE_PLAYBACK &&
      source.gameplay.isPlaying === false
    ) {
      setSourceReachGain(source.name, 0, source.reach.fadeDuration)
      setTimeout(() => {
        if (sourceNodes[source.name] === sourceNode) {
          sourceNodes[source.name].stop()
        }
      }, source.reach.fadeDuration)
    } else {
      sourceNodes[source.name].stop()
    }
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
  if (
    source.spatialised === true ||
    source.positioning === SourcePositioning.RELATIVE
  ) {
    spatializeSource(source)
  }

  if (volume !== undefined) {
    setVolume(sourceVolumes[source.name].gain, volume, fadeDuration)
  }

  if (
    source.reach.enabled === true &&
    source.reach.action === ReachAction.TOGGLE_PLAYBACK
  ) {
    sourceReachGains[source.name].gain.value = 0.00001
    setSourceReachGain(source.name, 1, source.reach.fadeDuration)
  }

  sourceNodes[source.name].start(0)

  notifySourceStarted(source)

  sourcePlaybackStates[source.name] = true
}

/**
 * Returns a source's playback state
 */
export const isSourcePlaying = name => {
  return sourcePlaybackStates[name]
}

/**
 * Enables/Disabled a source's looping
 */
export const setSourceLoop = (name, loop) => {
  if (sourceNodes[name]) {
    sourceNodes[name].loop = loop
  }
}

/* ======================================================================== */
// EVENTS
/* ======================================================================== */
const startListeners = []
const endListeners = []

export const subscribeToSourceStart = listener => {
  startListeners.push(listener)
}

const notifySourceStarted = source => {
  startListeners.forEach(listener => listener({ source }))
}

export const subscribeToSourceEnd = listener => {
  endListeners.push(listener)
}

const notifySourceEnded = source => {
  endListeners.forEach(listener => listener({ source }))
}

/* ======================================================================== */
// RECORD
/* ======================================================================== */
export const recordStart = () => {
  recorder = new Recorder(masterVolume)
  console.log('Recorder initialised.')
  // eslint-disable-next-line
  recorder && recorder.record()
  console.log('Recording...')
}

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

/* ======================================================================== */
// MASTER VOLUME
/* ======================================================================== */
// export const setMasterVolume = newVolume => {
//   masterVolume.gain.value = newVolume
// }
