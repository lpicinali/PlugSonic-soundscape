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
  startNodes as chainStartNodes,
  stopNodes as chainStopNodes,
  addSource as chainAddSource,
  deleteSources as chainDeleteSources,
  deleteAllSources as chainDeleteAllSources,
} from 'src/audio/chain.js'

import { isEmpty } from 'lodash'

export const play = () => {
  try {
    chainStartNodes()
  } catch (err) {
    console.log('could not start nodes:')
    console.error(err)
  }
}

export const stop = () => {
  try {
    chainStopNodes()
  } catch (err) {
    console.log('could not stop nodes:')
    console.error(err)
  }
}

export const setSource = sourceObject => {
  // console.log('Engine -> setSource')
  stop()
  if ( sourceObject.url !== null ) {
    return fetchAudioBuffer(sourceObject.url)
      .then(audioBuffer => {
        const node = chainCreateNode(audioBuffer)
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

export const unsetSource = filename => {
  stop()
  chainUnsetSourceNode(filename)
}

export const addSource = sourceObject => {
  stop()
  // console.log('Engine -> Add Source')
  // console.log(sourceObject)
  chainAddSource(sourceObject)
}

export const deleteSources = sourcesFilenames => {
  chainDeleteSources(sourcesFilenames)
}

export const importSources = sourcesObject => {
  chainDeleteAllSources()

  for (const filename in sourcesObject) {
    if (Object.prototype.hasOwnProperty.call(sourcesObject, filename)) {
      chainAddSource(sourcesObject[filename])
    }
  }
}

export const setSourcePosition = (filename, { azimuth, distance }) => {
  getBinauralSpatializer().then(spatializer => {
    spatializer.setSourcePosition(
      spatializer.targets[filename].source,
      azimuth,
      distance
    )
  })
}

export const setListenerPosition = ({ azimuth, distance, rotZAxis }) => {
  getBinauralSpatializer().then(spatializer => {
    spatializer.setListenerPosition(azimuth, distance, rotZAxis)
  })
}

export const setMasterVolume = volume => {
  chainSetMasterVolume(volume)
}

export const setTargetVolume = (target, volume, fadeDuration) => {
    chainSetSourceVolume(target, volume, fadeDuration)
}

export const setHeadRadius = radius => {

  getBinauralSpatializer().then(spatializer => {
    spatializer.setHeadRadius(radius)
  })
}

export const setPerformanceMode = isEnabled => {
  getBinauralSpatializer().then(spatializer => {
    spatializer.setPerformanceMode(isEnabled)
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
