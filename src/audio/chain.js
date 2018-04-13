/* global window */
/* eslint no-restricted-syntax: 0 */

/* ------------------- NOTES -------------------- *//*

*//* ---------------------------------------------- */
import { clamp } from 'lodash'
import toolkit from '3dti-toolkit'

import { audioFiles } from 'src/audio/audio-files.js';
import context from 'src/audio/context.js'
import { getInstance as getBinauralSpatializer } from 'src/audio/binauralSpatializer.js'

window.toolkit = toolkit || { nope: false }

const targetNodes = audioFiles.reduce(
  (aggr, file) => ({...aggr, [file.filename]: null}),{});
const targetInputs = audioFiles.reduce(
  (aggr, file) => ({...aggr, [file.filename]: context.createGain()}),{});
const targetVolumes = audioFiles.reduce(
  (aggr, file) => ({...aggr, [file.filename]: context.createGain()}),{});

const volume = context.createGain()
volume.gain.value = 0.5;

const targetVolumeValues = {}

getBinauralSpatializer().then(spatializer => {

  for (const filename in targetInputs) {
    if (Object.prototype.hasOwnProperty.call(targetInputs, filename) &&
        Object.prototype.hasOwnProperty.call(targetVolumes, filename) &&
        Object.prototype.hasOwnProperty.call(spatializer.targets, filename)) {
      targetInputs[filename].connect(targetVolumes[filename]);
      targetVolumes[filename].connect(spatializer.targets[filename].processor);
      spatializer.targets[filename].processor.connect(volume);
    }
  }

  for (const filename in targetVolumes) {
    if (Object.prototype.hasOwnProperty.call(targetVolumes, filename)) {
      targetVolumes[filename].gain.value = 0.5;
    }
  }

  // Master volume
  volume.connect(context.destination)
})

export const createNode = audioBuffer => {
  const node = context.createBufferSource()
  node.buffer = audioBuffer
  node.loop = true
  // console.log("chain: createNode");
  // console.log(`audioBuffer: ${audioBuffer}`)
  return node
}

export const setTargetNode = (node, channel) => {
  if (targetNodes[channel]) {
    targetNodes[channel].disconnect();
  }
  targetNodes[channel] = node;
  targetNodes[channel].connect(targetInputs[channel]);
  // console.log("chain: setTargetNode");
  // console.log(`node: ${node} , channel: ${channel}`)
  // console.log(`targetNodes[channel]: ${targetNodes[channel]}`);
}

export const unsetTargetNode = (channel) => {
  if (targetNodes[channel]) {
    targetNodes[channel].disconnect();
    targetNodes[channel] = null;
  }
  // console.log("chain: unsetTargetNode");
  // console.log(`channel: ${channel}`)
  // console.log(`targetNodes[channel]: ${targetNodes[channel]}`);
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

export const startNodes = () => {
  for (const filename in targetNodes) {
    if (Object.prototype.hasOwnProperty.call(targetNodes, filename)) {
      if (targetNodes[filename]) {
        targetNodes[filename].start(0);
      }
    }
  }
  // console.log("chain: START NODES");
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
  // console.log("chain: STOP NODES");
}
