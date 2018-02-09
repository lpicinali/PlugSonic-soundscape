/* eslint import/prefer-default-export: 0 */
/* eslint camelcase: 0 */
/* eslint object-shorthand: 0 */
/* eslint no-console: 0 */
/* eslint no-restricted-syntax: 0 */

/* ------------------- NOTES -------------------- *//*

    from z_binauralSpatializer_0.0_original
     - extend for multiple sources

*//* ---------------------------------------------- */

import {
  BinauralAPI,
  CMonoBuffer,
  CStereoBuffer,
  CTransform,
  CVector3,
  // T_ear,
 TSpatializationMode,
} from '3dti-toolkit'
import { map } from 'lodash'
// import { reduce } from 'lodash'

import {
  // Ear,
} from 'src/constants.js';

import context from 'src/audio/context.js';
import { fetchHrirsVector } from 'src/audio/hrir.js';
import hrirUrls from 'src/audio/hrir-files.js';
import { audioFiles } from 'src/audio/audio-files.js';


/* ---------------------------- NOTES --------------------------- *//*

  BinauralAPI - one instance per listener

  Listener Initialisation:
    Fetch HRIRs vector
    Create Listener instance
    Set Listener transform (position and orientation)
    Enable Directionality
    Enable Customized ITD

  Source(s):
    Create one instance for each Source

  from z_binauralSpatializer_0.0_original:
    - extend to multiple sources



*//* -------------------------------------------------------------- */
const binauralApi = new BinauralAPI()

let instancePromise = null

let listener
// let source
// let maskLeft
// let maskRight
let targets
// = audioFiles.reduce(
//   (aggr, file) => ({...aggr, [file.filename]: null}),{});

/* --------------- SET POSITION ----------------- */
function setPosition(source, azimuth, distance) {
  const transform = new CTransform()

  const x = Math.cos(azimuth) * distance
  const z = -Math.sin(azimuth) * distance
  const position = new CVector3(x, 0, z)

  transform.SetPosition(position)
  source.SetSourceTransform(transform)

  transform.delete()
  // console.log(`called setPosition with
    // source = ${target} , azimuth = ${azimuth} , distance = ${distance}`);
}


/* --------------- CREATE INSTANCE --------------- */
function createInstance() {


  return fetchHrirsVector(hrirUrls, context).then(hrirsVector => {

    // SET SOURCE POSITION - returned
    function setSourcePosition(source, azimuth, distance) {
      setPosition(source, azimuth, distance)
    }

    // SET PERFORMANCE MODE - returned
    function setPerformanceMode(isEnabled) {
      map(targets, target =>
        target[target].SetSpatializationMode(
          isEnabled
            ? TSpatializationMode.HighPerformance
            : TSpatializationMode.HighQuality
        )
      )
    }

    // SET HEAD RADIUS - returned
    function setHeadRadius(radius) {
      listener.SetHeadRadius(radius)
      // console.log(`called setHeadRadius with radius = ${radius}`);
    }

    // SET DIRECTIONALITY ENABLED - returned
    // function setDirectionalityEnabled(isEnabled) {
    //   if (isEnabled === true) {
    //     listener.EnableDirectionality(T_ear.LEFT)
    //     listener.EnableDirectionality(T_ear.RIGHT)
    //   } else {
    //     listener.DisableDirectionality(T_ear.LEFT)
    //     listener.DisableDirectionality(T_ear.RIGHT)
    //   }
    //   console.log(`called setDirectionalityEnabled with isEnabled = ${isEnabled}`);
    // }

    // SET DIRECTIONALITY ATTENUATION - returned
    // function setDirectionalityAttenuation(ear, attenuation) {
    //   if (ear === Ear.LEFT) {
    //     listener.SetDirectionality_dB(T_ear.LEFT, attenuation)
    //   } else if (ear === Ear.RIGHT) {
    //     listener.SetDirectionality_dB(T_ear.RIGHT, attenuation)
    //   }
    //   console.log(`called setDirectionalityAttenuation with
    //     ear = ${ear} , attenuation = ${attenuation}`);
    // }

    // CREATE and SETUP LISTENER
    listener = binauralApi.CreateListener(hrirsVector, 0.0875)
    listener.SetListenerTransform(new CTransform())
    // listener.EnableDirectionality(T_ear.LEFT)
    // listener.EnableDirectionality(T_ear.RIGHT)
    // Customized ITD is required for the HighPerformance mode to work
    // listener.EnableCustomizedITD()
    // console.log('Listener OK');

    // CREATE and SETUP TARGET SOURCE(S) - mono
    targets = audioFiles.reduce((aggr, file, index) => {
      const targetSource = binauralApi.CreateSource()
      setSourcePosition(targetSource, index * Math.PI/6, 30)

      const targetInputMonoBuffer = new CMonoBuffer()
      targetInputMonoBuffer.resize(512, 0)

      const targetOutputStereoBuffer = new CStereoBuffer()
      targetOutputStereoBuffer.resize(1024, 0)
      // Script Node (bufferSize, # InputChannels, # OutputChannels)
      const targetProcessor = context.createScriptProcessor(512, 1, 2)
      // PROCESSING FUNCTION
      targetProcessor.onaudioprocess = audioProcessingEvent => {
        const { inputBuffer, outputBuffer } = audioProcessingEvent
        const inputData = inputBuffer.getChannelData(0)

        for (let i = 0; i < inputData.length; i++) {
          targetInputMonoBuffer.set(i, inputData[i])
        }
        // process data
        targetSource.ProcessAnechoic(targetInputMonoBuffer, targetOutputStereoBuffer)
        const outputDataLeft = outputBuffer.getChannelData(0)
        const outputDataRight = outputBuffer.getChannelData(1)

        for (let i = 0; i < outputDataLeft.length; i++) {
          outputDataLeft[i] = targetOutputStereoBuffer.get(i * 2)
          outputDataRight[i] = targetOutputStereoBuffer.get(i * 2 + 1)
        }
      }

      return {
        ...aggr,
        [file.filename]: {
          source: targetSource,
          processor: targetProcessor,
        },
      }
    }, {}) // end of .reduce






    // source = binauralApi.CreateSource()
    // setSourcePosition(Math.PI / 2, 30)
    //
    //
    // const inputMonoBuffer = new CMonoBuffer()
    // inputMonoBuffer.resize(512, 0)
    //
    // const outputStereoBuffer = new CStereoBuffer()
    // outputStereoBuffer.resize(1024, 0)
    // // create a Script Node - used for direct audio processing
    // // (buffer size, # input channels, # output channels)
    // const processor = context.createScriptProcessor(512, 1, 2)
    // // PROCESSING FUNCTION
    // processor.onaudioprocess = audioProcessingEvent => {
    //   const { inputBuffer, outputBuffer } = audioProcessingEvent
    //   const inputData = inputBuffer.getChannelData(0)
    //
    //   for (let i = 0; i < inputData.length; i++) {
    //     inputMonoBuffer.set(i, inputData[i])
    //   }
    //   // process data
    //   // if (window.processBinaural === true) {
    //   source.ProcessAnechoic(inputMonoBuffer, outputStereoBuffer)
    //   // }
    //   // get output buffer data and write processed input into it
    //   const outputDataLeft = outputBuffer.getChannelData(0)
    //   const outputDataRight = outputBuffer.getChannelData(1)
    //
    //   for (let i = 0; i < outputDataLeft.length; i++) {
    //     outputDataLeft[i] = outputStereoBuffer.get(i * 2)
    //     outputDataRight[i] = outputStereoBuffer.get(i * 2 + 1)
    //   }
    // }
    //
    // // CREATE and SETUP MASK SOURCE - stereo
    // const masks = [Ear.LEFT, Ear.RIGHT].reduce((aggr, channel) => {
    //   const maskSource = binauralApi.CreateSource()
    //   const azimuth = channel === Ear.LEFT ? Math.PI : 0
    //   setPosition(maskSource, azimuth, 3)
    //
    //   const maskInputBuffer = new CMonoBuffer()
    //   maskInputBuffer.resize(512, 0)
    //   const maskOutputBuffer = new CStereoBuffer()
    //   maskOutputBuffer.resize(1024, 0)
    //   // Script Node (bufferSize, numInputChannels, numOutputChannels)
    //   const maskProcessor = context.createScriptProcessor(512, 2, 2)
    //   // PROCESSING FUNCTION
    //   maskProcessor.onaudioprocess = audioProcessingEvent => {
    //     const { inputBuffer, outputBuffer } = audioProcessingEvent
    //     const inputData = inputBuffer.getChannelData(0)
    //
    //     for (let i = 0; i < inputData.length; i++) {
    //       maskInputBuffer.set(i, inputData[i])
    //     }
    //     // process data
    //     maskSource.ProcessAnechoic(maskInputBuffer, maskOutputBuffer)
    //     const outputDataLeft = outputBuffer.getChannelData(0)
    //     const outputDataRight = outputBuffer.getChannelData(1)
    //
    //     for (let i = 0; i < outputDataLeft.length; i++) {
    //       outputDataLeft[i] = maskOutputBuffer.get(i * 2)
    //       outputDataRight[i] = maskOutputBuffer.get(i * 2 + 1)
    //     }
    //   }
    //
    //   return {
    //     ...aggr,
    //     [channel]: {
    //       source: maskSource,
    //       processor: maskProcessor,
    //     },
    //   }
    // }, {}) // end of .reduce

    return {
      listener,
      // source,
      // processor,
      targets,
      // masks,
      setSourcePosition,
      setPerformanceMode,
      setHeadRadius,
      // setDirectionalityEnabled,
      // setDirectionalityAttenuation,
    }
  }) // end of .then
}



/* ------------------- GET INSTANCE ------------------ */
export function getInstance() {
  if (instancePromise !== null) {
    return instancePromise
  }

  instancePromise = createInstance()
  return instancePromise
}
