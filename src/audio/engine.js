/* eslint no-console: 0 */
/* eslint arrow-body-style: 0 */

/* ------------------- NOTES -------------------- *//*

    from z_engine_0.0_original
      - rename import to createNode as chainCreateNode etc. etc.

    from z_engine_0.1_renaming
      - setTargetSource extended with channels
      -

*//* ---------------------------------------------- */

import { fetchAudioBuffer } from 'src/utils.js'
import { getInstance } from 'src/audio/binauralSpatializer.js'
import {
  createNode as chainCreateNode,
  setTargetNode as chainSetTargetNode,
  unsetTargetNode as chainUnsetTargetNode,
  setTargetVolume as chainSetTargetVolume,
  startNodes as chainStartNodes,
  stopNodes as chainStopNodes,
} from 'src/audio/chain.js'


export const play = () => {
  // console.log('play')
  try {
    chainStartNodes()
  } catch (err) {
    console.log('could not start nodes:')
    console.error(err)
  }
}

export const pause = () => {
  // console.log('pause')
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

export const setComponentVolume = (volume) => {
  // console.log('setComponentVolume', { volume })
    chainSetTargetVolume(volume)
}

export const setHeadRadius = radius => {
  getInstance().then(spatializer => {
    spatializer.setHeadRadius(radius)
  })
}

export const setPerformanceMode = isEnabled => {
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
