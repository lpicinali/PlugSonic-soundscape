/* eslint no-console: 0 */
/* eslint arrow-body-style: 0 */

/* ------------------- NOTES -------------------- *//*

*//* ---------------------------------------------- */

import { fetchAudioBuffer } from 'src/utils.js'
import { getInstance } from 'src/audio/binauralSpatializer.js'
import {
  createNode as chainCreateNode,
  setTargetNode as chainSetTargetNode,
  unsetTargetNode as chainUnsetTargetNode,
  setMasterVolume as chainSetMasterVolume,
  setTargetVolume as chainSetTargetVolume,
  startNodes as chainStartNodes,
  stopNodes as chainStopNodes,
} from 'src/audio/chain.js'


export const play = () => {
  // console.log("engine: PLAY");
  try {
    chainStartNodes()
  } catch (err) {
    console.log('could not start nodes:')
    console.error(err)
  }
}

export const pause = () => {
  // console.log("engine: PAUSE");
  try {
    chainStopNodes()
  } catch (err) {
    console.log('could not stop nodes:')
    console.error(err)
  }
}

export const setTargetSource = (url, filename) => {
  pause();
  // console.log("engine: setTargetSource");
  // console.log(`url: ${url} , filename: ${filename}`);
  return fetchAudioBuffer(url)
    .then(audioBuffer => {
      const node = chainCreateNode(audioBuffer)
      chainSetTargetNode(node, filename)
    })
    .catch(err => console.error(err))
}

export const unsetTargetSource = (filename) => {
  pause();
  // console.log("engine: unsetTargetSource");
  // console.log(`filename: ${filename}`);
  chainUnsetTargetNode(filename);
}

export const setComponentPosition = (filename, { azimuth, distance }) => {
  // console.log("engine: setComponentPosition");
  // console.log(`filename: ${filename} , azimuth: ${azimuth} , distance: ${distance}`);
  getInstance()
    .then(spatializer => {
    spatializer.setSourcePosition(spatializer.targets[filename].source, azimuth, distance)
  });
}

export const setListenerPosition = ( { azimuth, distance, rotYAxis } ) => {
  // console.log("engine: setComponentPosition");
  // console.log(`filename: ${filename} , azimuth: ${azimuth} , distance: ${distance}`);
  getInstance()
    .then(spatializer => {
    spatializer.setListenerPosition(azimuth, distance, rotYAxis)
  });
}

export const setMasterVolume = (volume) => {
  // console.log('setComponentVolume', { volume })
    chainSetMasterVolume(volume)
}

export const setTargetVolume = (target, volume, fadeDuration) => {
  // console.log('setComponentVolume', { volume })
    chainSetTargetVolume(target, volume, fadeDuration)
}

export const setHeadRadius = radius => {
  getInstance().then(spatializer => {
    spatializer.setHeadRadius(radius)
  })
}

export const setPerformanceMode = isEnabled => {
  // console.log("Engine: SET PERFORMANCE MODE");
  // console.log(`isEnabled: ${isEnabled}`);
  getInstance().then(spatializer => {
    spatializer.setPerformanceMode(isEnabled)
  })
}

// export const setDirectionalityEnabled = isEnabled => {
//   getInstance().then(spatializer => {
//     spatializer.setDirectionalityEnabled(isEnabled)
//   })
// }

// export const setDirectionalityAttenuation = (ear, attenuation) => {
//   getInstance().then(spatializer => {
//     spatializer.setDirectionalityAttenuation(ear, attenuation)
//   })
// }
