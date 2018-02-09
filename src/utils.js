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

export function fetchAudioBuffer(url) {
  return got(url, { encoding: null })
    .then(response => bufferToArrayBuffer(response.body))
    .then(arrayBuffer => decode(arrayBuffer, context))
}
