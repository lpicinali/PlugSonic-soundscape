import bufferToArrayBuffer from 'buffer-to-arraybuffer'
import got from 'got'
import { round } from 'lodash'
import { delay, fork, race, take } from 'redux-saga/effects'

import { ReachAction } from 'src/constants.js'
import context from 'src/audio/context.js'
import decode from 'src/audio/decode.js'

// import { decrementCounter } from 'src/sagas/rootSaga'

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

export function ADEtoXYZ(azimuth, distance, elevation) {
  const x = Math.cos(azimuth) * distance
  const y = Math.sin(azimuth) * distance
  const z = Math.sin(elevation) * distance

  return { x, y, z }
}

export function fetchAudioBuffer(url) {
  return got(url, { encoding: null })
    .then(response => bufferToArrayBuffer(response.body))
    .then(arrayBuffer => decode(arrayBuffer, context))
  // .then(() => {
  //   console.log(`decode ${url} complete!`)
  //   decrementCounter()
  // })
}

export function ArrayBufferCycle(array) {
  const ab = new ArrayBuffer(array.length)
  const view = new Uint8Array(ab)
  for (let i = 0; i < array.length; ++i) {
    view[i] = array[i]
  }
  return ab
}

export function fetchAudioBufferRaw(rawArray) {
  const arrayBuffer = ArrayBufferCycle(rawArray)
  return decode(arrayBuffer, context)
  // .then(() => {
  //   console.log(`decode complete!`)
  //   decrementCounter()
  // })
}

export function fetchAudioBufferFromArrayBuffer(arrayBuffer) {
  return decode(arrayBuffer, context)
}

/**
 * This little piece of magic transforms a callback pull logic
 * push logic into pull ditto, so that the generator functions used
 * in redux-saga can control the flow of side-effects.
 *
 * @see https://stackoverflow.com/questions/34859932/can-i-use-redux-sagas-es6-generators-as-onmessage-listener-for-websockets-or-ev#34866840
 */
export function createSubscriptionSource(subscribe) {
  let deferred = null

  subscribe((...args) => {
    if (deferred !== null) {
      deferred.resolve(...args)
      deferred = null
    }
  })

  const callbackSource = {
    nextMessage: () => {
      if (deferred === null) {
        deferred = {}
        deferred.promise = new Promise(resolve => {
          deferred.resolve = resolve
        })
      }
      return deferred.promise
    },
  }

  return callbackSource
}

export function decibelsToGain(value) {
  return Math.exp(value / 8.6858)
}

export function gainToDecibels(value) {
  return 20 * (0.43429 * Math.log(value))
}

export function forceDecimals(value, precision) {
  const roundedValue = round(value, precision)
  const [integer, fraction] = String(roundedValue).split('.')

  if (fraction === undefined) {
    return `${integer}.${'0'.repeat(precision)}`
  }

  return `${integer}.${fraction.padEnd(precision, '0')}`
}

/**
 * Returns 1 if the source should be audible with regards to its
 * reach properties, 0 if not.
 */
export function getSourceReachGain(source) {
  if (
    source.reach.enabled === false ||
    source.gameplay.isWithinReach === true
  ) {
    return 1
  }

  // What is this, you ask. Well, it seems that if an AudioParam
  // has its value set to 0 via node.param.value = 0, then ramping
  // the param's value won't do anything.
  return 0.00001
}

/**
 * Returns whether a source may specify playback timings
 */
export function sourceMayUseTimings(source) {
  return (
    source.reach.enabled === false ||
    source.reach.action === ReachAction.TOGGLE_PLAYBACK
  )
}
