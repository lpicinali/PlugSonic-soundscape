/* eslint import/prefer-default-export: 0 */
/* eslint camelcase: 0 */
/* eslint object-shorthand: 0 */
/* eslint no-console: 0 */
/* eslint no-restricted-syntax: 0 */

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

*//* -------------------------------------------------------------- */

import {
  BinauralAPI,
  CMonoBuffer,
  CStereoBuffer,
  CTransform,
  CVector3,
  CQuaternion,
  T_ear,
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

const binauralApi = new BinauralAPI()

let instancePromise = null

let listener
let targets = null;

/* --------------- SET POSITION ----------------- */
function setSPosition(source, azimuth, distance) {
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

function setLPosition(azimuth, distance, rotYAxis) {
  const transform = new CTransform();
  // let orientation = new CQuaternion();

  const x = Math.cos(azimuth) * distance;
  const z = -Math.sin(azimuth) * distance;
  const position = new CVector3(x, 0, z);
  const yAxis = new CVector3(0, -1, 0);
  const orientation = CQuaternion.FromAxisAngle(yAxis, rotYAxis);

  transform.SetPosition(position);
  transform.SetOrientation(orientation);
  listener.SetListenerTransform(transform);

  transform.delete();
  // console.log(`called setPosition with
    // source = ${target} , azimuth = ${azimuth} , distance = ${distance}`);
}


/* --------------- CREATE INSTANCE --------------- */
function createInstance() {

  return fetchHrirsVector(hrirUrls, context).then(hrirsVector => {

    // SET SOURCE POSITION
    function setSourcePosition(source, azimuth, distance) {
      setSPosition(source, azimuth, distance);
    }

    function setListenerPosition(azimuth, distance, rotYAxis) {
      setLPosition(azimuth, distance, rotYAxis);
    }

    // SET PERFORMANCE MODE
    function setPerformanceMode(isEnabled) {
      console.log("Spatializer: SET PERFORMANCE MODE");
      console.log(`isEnabled: ${isEnabled}`);
      map(targets, target => {
        // console.log(target.source);
        target.source.SetSpatializationMode(
          isEnabled
            ? TSpatializationMode.HighPerformance
            : TSpatializationMode.HighQuality
        )
        console.log(target.source.GetSpatializationMode());
      }
      )
    }

    // SET HEAD RADIUS
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
    listener.EnableDirectionality(T_ear.LEFT)
    listener.EnableDirectionality(T_ear.RIGHT)
    // Customized ITD is required for the HighPerformance mode to work
    listener.EnableCustomizedITD()

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

    return {
      listener,
      targets,
      setSourcePosition,
      setListenerPosition,
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
