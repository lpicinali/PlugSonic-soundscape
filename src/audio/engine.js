/* eslint no-console: 0 */
/* eslint arrow-body-style: 0 */
/* eslint no-restricted-syntax: 0 */
import { fetchAudioBuffer, fetchAudioBufferRaw } from 'src/utils.js'
import { getInstance as getBinauralSpatializer } from 'src/audio/binauralSpatializer.js'
import {
  createNode as chainCreateNode,
  setSourceNode as chainSetSourceNode,
  unsetSourceNode as chainUnsetSourceNode,
  setMasterVolume as chainSetMasterVolume,
  setSourceVolume as chainSetSourceVolume,
  startNode as chainStartNode,
  startNodes as chainStartNodes,
  stopNode as chainStopNode,
  stopNodes as chainStopNodes,
  setSourceLoop as chainSetSourceLoop,
  addSource as chainAddSource,
  deleteSources as chainDeleteSources,
  deleteAllSources as chainDeleteAllSources,
} from 'src/audio/chain.js'

import { isEmpty } from 'lodash'

/* ======================================================================== */
// PLAY
/* ======================================================================== */
export const play = () => {
  try {
    chainStartNodes()
  } catch (err) {
    console.log('could not start nodes:')
    console.error(err)
  }
}

export { chainStartNode as playSource }

/* ======================================================================== */
// STOP
/* ======================================================================== */
export const stop = () => {
  try {
    chainStopNodes()
  } catch (err) {
    console.log('could not stop nodes:')
    console.error(err)
  }
}

export { chainStopNode as stopSource }

/* ======================================================================== */
// LOOP
/* ======================================================================== */

export { chainSetSourceLoop as setSourceLoop }

/* ======================================================================== */
// SET SOURCE
/* ======================================================================== */
export const setSource = sourceObject => {
  // console.log('Engine -> setSource')
  stop()
  if ( sourceObject.url !== null ) {
    return fetchAudioBuffer(sourceObject.url)
      .then(audioBuffer => {
        const node = chainCreateNode(audioBuffer)
        node.loop = sourceObject.loop
        chainSetSourceNode(node, sourceObject.name)
      })
      .catch(err => console.error(err))
  } else if ( !isEmpty(sourceObject.raw) ) {
    return fetchAudioBufferRaw(sourceObject.raw)
      .then(audioBuffer => {
        const node = chainCreateNode(audioBuffer)
        chainSetSourceNode(node, sourceObject.name)
      })
      .catch(err => console.error(err))
  }
  return null
}

/* ======================================================================== */
// UNSET SOURCE
/* ======================================================================== */
export const unsetSource = sourceObject => {
  stop()
  chainUnsetSourceNode(sourceObject.name)
}

/* ======================================================================== */
// ADD SOURCE
/* ======================================================================== */
export const addSource = sourceObject => {
  stop()
  console.log('Engine -> Add Source')
  console.log(sourceObject)
  chainAddSource(sourceObject)
}

// export const deleteSources = sourcesFilenames => {
//   chainDeleteSources(sourcesFilenames)
// }

/* ======================================================================== */
// DELETE ALL SOURCE
/* ======================================================================== */
export const deleteAllSources = () => {
  console.log('ENGINE -> Delete All Sources')
  stop()
  chainDeleteAllSources()
}

/* ======================================================================== */
// SET SOURCE POSITION
/* ======================================================================== */
export const setSourcePosition = (name, { x, y, z }) => {
  getBinauralSpatializer().then(spatializer => {
    spatializer.setSourcePosition(spatializer.sources[name].source, x, y, z)
  })
}

/* ======================================================================== */
// SET LISTENER POSITION
/* ======================================================================== */
export const setListenerPosition = ({ x, y, z, rotZAxis }) => {
  getBinauralSpatializer().then(spatializer => {
    spatializer.setListenerPosition(x, y, z, rotZAxis)
  })
}

// export const setMasterVolume = volume => {
//   chainSetMasterVolume(volume)
// }

export { chainSetSourceVolume as setSourceVolume }

// export const setTargetVolume = (target, volume, fadeDuration) => {
//     chainSetSourceVolume(target, volume, fadeDuration)
// }

/* ======================================================================== */
// HEAD RADIUS
/* ======================================================================== */
export const setHeadRadius = radius => {
  getBinauralSpatializer().then(spatializer => {
    spatializer.setHeadRadius(radius)
  })
}

/* ======================================================================== */
// PERFORMANCE MODE
/* ======================================================================== */
export const setPerformanceMode = () => {
  getBinauralSpatializer().then(spatializer => {
    spatializer.setPerformanceMode()
  })
}

/* ======================================================================== */
// QUALITY MODE
/* ======================================================================== */
export const setQualityMode = () => {
  getBinauralSpatializer().then(spatializer => {
    spatializer.setQualityMode()
  })
}

// export const setDirectionalityEnabled = isEnabled => {
//   getBinauralSpatializer().then(spatializer => {
//     spatializer.setDirectionalityEnabled(isEnabled)
//   })
// }

// export const setDirectionalityAttenuation = (ear, attenuation) => {
//   getBinauralSpatializer().then(spatializer => {
//     spatializer.setDirectionalityAttenuation(ear, attenuation)
//   })
// }
