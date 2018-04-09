/* eslint no-console: 0 */
/* eslint arrow-body-style: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { fetchAudioBuffer } from 'src/utils.js'
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
} from 'src/audio/chain.js'

export const play = () => {
  // console.log("engine: PLAY - begins");
  try {
    chainStartNodes()
  } catch (err) {
    console.log('could not start nodes:')
    console.error(err)
  }
  // console.log("engine: PLAY - ends");
}

export const pause = () => {
  // console.log("engine: PAUSE - begins");
  try {
    chainStopNodes()
  } catch (err) {
    console.log('could not stop nodes:')
    console.error(err)
  }
  // console.log("engine: PAUSE - ends");
}

export const setTargetSource = (filename, url) => {
  // console.log("engine: SET TargetSource - begins");
  pause()
  // console.log(`filename: ${filename}, url: ${url}`);
  // fetchAudioBuffer(url);
  return fetchAudioBuffer(url)
    .then(audioBuffer => {
      const node = chainCreateNode(audioBuffer)
      chainSetTargetNode(node, filename)
      // console.log("engine: SET TargetSource - ends");
    })
    .catch(err => console.error(err))
}

export const unsetTargetSource = filename => {
  // console.log("engine: UNSET TargetSource - begins");
  pause()
  // console.log(`filename: ${filename}`);
  chainUnsetTargetNode(filename)
  // console.log("engine: UNSET TargetSource - ends");
}

export const addSource = source => {
  // console.log("");
  // console.log("");
  // console.log("engine: SET Sources - begins");
  pause()
  chainAddSource(source)
  // const instancePromise = getBinauralSpatializer();
  // console.log(instancePromise);
  // console.log("engine: SET Sources - ends");
  // console.log("");
  // console.log("");
}

export const deleteSources = sourcesFilenames => {
  chainDeleteSources(sourcesFilenames)
}

export const setComponentPosition = (filename, { azimuth, distance }) => {
  // console.log("engine: setComponentPosition");
  // console.log(`filename: ${filename} , azimuth: ${azimuth} , distance: ${distance}`);

  getBinauralSpatializer().then(spatializer => {
    spatializer.setSourcePosition(
      spatializer.targets[filename].source,
      azimuth,
      distance
    )
  })
}

export const setListenerPosition = ({ azimuth, distance, rotYAxis }) => {
  // console.log("engine: setComponentPosition");
  // console.log(`filename: ${filename} , azimuth: ${azimuth} , distance: ${distance}`);
  getBinauralSpatializer().then(spatializer => {
    spatializer.setListenerPosition(azimuth, distance, rotYAxis)
  })
}

export const setMasterVolume = volume => {
  // console.log('setComponentVolume', { volume })
  chainSetMasterVolume(volume)
}

export const setTargetVolume = (target, volume) => {
  // console.log('setComponentVolume', { volume })
  chainSetTargetVolume(target, volume)
}

export const setHeadRadius = radius => {
  // const spatializer = getBinauralSpatializer();
  // spatializer.setHeadRadius(radius);

  getBinauralSpatializer().then(spatializer => {
    spatializer.setHeadRadius(radius)
  })
}

export const setPerformanceMode = isEnabled => {
  // console.log("Engine: SET PERFORMANCE MODE");
  // console.log(`isEnabled: ${isEnabled}`);
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
