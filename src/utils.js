import bufferToArrayBuffer from 'buffer-to-arraybuffer'
import got from 'got'

import context from 'src/audio/context.js'
import decode from 'src/audio/decode.js'

export function circumferenceToRadius(circumference) {
  return circumference / (2 * Math.PI)
}

export function radiusToCircumference(radius) {
  return radius * 2 * Math.PI
}

export function getDistanceBetweenSphericalPoints(a, b) {
  const ax = Math.cos(a.azimuth) * a.distance
  const az = Math.sin(a.azimuth) * a.distance
  const bx = Math.cos(b.azimuth) * b.distance
  const bz = Math.sin(b.azimuth) * b.distance

  return Math.sqrt((bx - ax) ** 2 + (bz - az) ** 2)
}

export function ADEtoXYZ(azimuth,distance,elevation) {
  const x = Math.cos(azimuth) * distance
  const y = Math.sin(azimuth) * distance
  const z = Math.sin(elevation) * distance

  return {x,y,z}
}

export function fetchAudioBuffer(url) {
  // console.log('fetchAudioBuffer')
  return got(url, { encoding: null })
    .then(response => bufferToArrayBuffer(response.body))
    .then(arrayBuffer => decode(arrayBuffer, context))
}

function ArrayBufferCycle(array) {
  const ab = new ArrayBuffer(array.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < array.length; ++i) {
    view[i] = array[i];
  }
  return ab;
}

export function fetchAudioBufferRaw(rawArray) {
  const arrayBuffer = ArrayBufferCycle(rawArray)
  return decode(arrayBuffer, context)
}
