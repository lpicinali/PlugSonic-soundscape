/* eslint import/prefer-default-export: 0 */
/* eslint camelcase: 0 */
/* eslint object-shorthand: 0 */
/* eslint no-console: 0 */
/* eslint no-restricted-syntax: 0 */

/* ---------------------------- NOTES --------------------------- */ /*

  TO DO:
    - initialise only selected sources

  BinauralAPI - one instance per listener

  Listener Initialisation:
    Fetch HRIRs vector
    Create Listener instance
    Set Listener transform (position and orientation)
    Enable Directionality
    Enable Customized ITD

  Source(s):
    Create one instance for each Source

*/ /* -------------------------------------------------------------- */

import {
  BinauralAPI,
  CMonoBuffer,
  CStereoBuffer,
  CTransform,
  CVector3,
  CQuaternion,
  // T_ear,
  TSpatializationMode,
} from '3dti-toolkit'
import { map, reduce } from 'lodash'

import // Ear,
'src/constants.js'

import context from 'src/audio/context.js'
import { fetchHrirsVector } from 'src/audio/hrir.js'
import hrirUrls from 'src/audio/hrir-files.js'
import { audioFiles } from 'src/audio/audio-files.js'

const binauralApi = new BinauralAPI()

let instancePromise = null

let listener = null
let targets = null

/* --------------- COORDINATE SYSTEM ------------ *//*

      Y x ------> X
        |
        |
        v
        Z

*//* ---------------------------------------------- */

// const xAxis = new CVector3(1,0,0)
const yAxis = new CVector3(0,-1,0)
// const zAxis = new CVector3(0,0,-1)

/* ----------------------------------------------------------------------------- */

function setSPosition(source, azimuth, distance, /* elevation = 0 */ ) {
  const transform = new CTransform()

  const x = Math.cos(azimuth) * distance
  // const y = -Math.sin(elevation) * distance
  const z = -Math.sin(azimuth) * distance
  const position = new CVector3(x, 0, z)
  // const position = new CVector3(x, y, z)

  transform.SetPosition(position)
  source.SetSourceTransform(transform)

  transform.delete()
}

function setLPosition(azimuth, distance, rotYAxis) {
  const transform = new CTransform()

  const x = Math.cos(azimuth) * distance
  const z = -Math.sin(azimuth) * distance
  const position = new CVector3(x, 0, z)
  const orientation = CQuaternion.FromAxisAngle(yAxis, rotYAxis)

  transform.SetPosition(position)
  transform.SetOrientation(orientation)
  listener.SetListenerTransform(transform)

  transform.delete()
}

/* ----------------------------------------------------------------------------- */

function createInstance() {
  // SET SOURCE POSITION
  function setSourcePosition(source, azimuth, distance) {
    setSPosition(source, azimuth, distance)
  }

  // SET LISTENER POSITION
  function setListenerPosition(azimuth, distance, rotYAxis) {
    setLPosition(azimuth, distance, rotYAxis)
  }

  // SET PERFORMANCE MODE
  function setPerformanceMode(isEnabled) {
    map(targets, target => {
      // console.log(target.source);
      target.source.SetSpatializationMode(
        isEnabled
          ? TSpatializationMode.HighPerformance
          : TSpatializationMode.HighQuality
      )
    })
  }

  // SET HEAD RADIUS
  function setHeadRadius(radius) {
    listener.SetHeadRadius(radius)
  }

  // ADD SOURCE
  function addSource(sourceObject) {
    const targetSource = binauralApi.CreateSource()
    setSourcePosition(
      targetSource,
      sourceObject.position.azimuth,
      sourceObject.position.distance
    )

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
      targetSource.ProcessAnechoic(
        targetInputMonoBuffer,
        targetOutputStereoBuffer
      )
      const outputDataLeft = outputBuffer.getChannelData(0)
      const outputDataRight = outputBuffer.getChannelData(1)

      for (let i = 0; i < outputDataLeft.length; i++) {
        outputDataLeft[i] = targetOutputStereoBuffer.get(i * 2)
        outputDataRight[i] = targetOutputStereoBuffer.get(i * 2 + 1)
      }
    }

    targets[sourceObject.filename] = {
      source: targetSource,
      processor: targetProcessor,
    }
  }

  // DELETE Source
  function deleteSources(sourcesFilenames) {
    sourcesFilenames.forEach(source => {
      delete targets[source]
    })
  }

  // DELETE ALL sources
  function deleteAllSources() {
    map(targets, source => {
      delete targets[source]
    })
  }

  // IMPORT sources
  function importSources(sourcesObject) {
    targets = reduce(
      sourcesObject,
      (aggr, source) => {
        const targetSource = binauralApi.CreateSource()
        setSourcePosition(
          targetSource,
          source.position.azimuth,
          source.position.distance
        )

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
          targetSource.ProcessAnechoic(
            targetInputMonoBuffer,
            targetOutputStereoBuffer
          )
          const outputDataLeft = outputBuffer.getChannelData(0)
          const outputDataRight = outputBuffer.getChannelData(1)

          for (let i = 0; i < outputDataLeft.length; i++) {
            outputDataLeft[i] = targetOutputStereoBuffer.get(i * 2)
            outputDataRight[i] = targetOutputStereoBuffer.get(i * 2 + 1)
          }
        }

        return {
          ...aggr,
          [source.filename]: {
            source: targetSource,
            processor: targetProcessor,
          },
        }
      },
      {}
    )
  }

  return fetchHrirsVector(hrirUrls, context).then(hrirsVector => {
    console.log('')
    console.log(`binauralSpatializer: INIT - begins`)
    // CREATE and SETUP LISTENER
    listener = binauralApi.CreateListener(hrirsVector, 0.0875)
    listener.SetListenerTransform(new CTransform())
    // listener.EnableDirectionality(T_ear.LEFT)
    // listener.EnableDirectionality(T_ear.RIGHT)
    // Customized ITD is required for the HighPerformance mode to work
    listener.EnableCustomizedITD()

    // CREATE and SETUP TARGET SOURCE(S) - mono
    targets = audioFiles.reduce((aggr, file, index) => {
      const targetSource = binauralApi.CreateSource()
      setSourcePosition(targetSource, index * Math.PI / 6, 3)

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
        targetSource.ProcessAnechoic(
          targetInputMonoBuffer,
          targetOutputStereoBuffer
        )
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
    console.log(`binauralSpatializer: INIT - ends`)
    console.log('')

    return {
      listener,
      targets,
      setSourcePosition,
      setListenerPosition,
      setPerformanceMode,
      setHeadRadius,
      addSource,
      deleteSources,
      deleteAllSources,
      importSources,
    }
  }) // end of .then
}

/* ----------------------------------------------------------------------------- */

export function getInstance() {
  if (instancePromise !== null) {
    return instancePromise
  }

  instancePromise = createInstance()
  return instancePromise
}
