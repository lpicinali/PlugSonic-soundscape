/* eslint no-console: 0 */
/* eslint arrow-body-style: 0 */
/* eslint no-restricted-syntax: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { fetchAudioBuffer, fetchAudioBufferRaw } from 'src/utils.js'
import { getInstance as getBinauralSpatializer } from 'src/audio/binauralSpatializer.js'
import {
  createNode as chainCreateNode,
  setTargetNode as chainSetTargetNode,
  unsetTargetNode as chainUnsetTargetNode,
  setMasterVolume as chainSetMasterVolume,
  setTargetVolume as chainSetTargetVolume,
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

export const pause = () => {
  try {
    chainStopNodes()
  } catch (err) {
    console.log('could not stop nodes:')
    console.error(err)
  }
}

export const setTargetSource = targetObject => {
  pause()
  if ( targetObject.url !== '' ) {
    return fetchAudioBuffer(targetObject.url)
      .then(audioBuffer => {
        const node = chainCreateNode(audioBuffer)
        chainSetTargetNode(node, targetObject.filename)
      })
      .catch(err => console.error(err))
  } else if ( !isEmpty(targetObject.raw) ) {
    return fetchAudioBufferRaw(targetObject.raw)
      .then(audioBuffer => {
        const node = chainCreateNode(audioBuffer)
        chainSetTargetNode(node, targetObject.filename)
      })
      .catch(err => console.error(err))
  }
  return null
}

export const unsetTargetSource = filename => {
  pause()
  chainUnsetTargetNode(filename)
}

export const addSource = sourceObject => {
  pause()
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

export const setComponentPosition = (filename, { azimuth, distance }) => {
  getBinauralSpatializer().then(spatializer => {
    spatializer.setSourcePosition(
      spatializer.targets[filename].source,
      azimuth,
      distance
    )
  })
}

export const setListenerPosition = ({ azimuth, distance, rotYAxis }) => {
  getBinauralSpatializer().then(spatializer => {
    spatializer.setListenerPosition(azimuth, distance, rotYAxis)
  })
}

export const setMasterVolume = volume => {
  chainSetMasterVolume(volume)
}

export const setTargetVolume = (target, volume, fadeDuration) => {
    chainSetTargetVolume(target, volume, fadeDuration)
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
