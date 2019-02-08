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
import { fetchHrirsVector } from 'src/audio/hrir_utils'
import hrirUrls from 'src/audio/hrir_files'
import { audioFiles } from 'src/audio/audio-files.js'
/* ========================================================================== */
const binauralApi = new BinauralAPI()
let instancePromise = null
let listener = null
let sources = null
/* ========================================================================== */
/* ------------------------ COORDINATE SYSTEM ----------------------------- *//*
      New Convention

           ^ X (azimuth = 0, increases anti-clockwise)
           |
      Y <--o Z
*//* ------------------------------------------------------------------------ */
// Rotation Axes
// const xAxis = new CVector3(1,0,0)
// const yAxis = new CVector3(0,1,0)
const zAxis = new CVector3(0,0,1)
/* ========================================================================== */
function setSPosition(source, x, y, z) {
  const transform = new CTransform()
  const position = new CVector3(x, y, z)
  transform.SetPosition(position)
  source.SetSourceTransform(transform)
  transform.delete()
}

function setLPosition(x, y, z, rotZAxis) {
  const transform = new CTransform()
  const position = new CVector3(x, y, z)
  const orientation = CQuaternion.FromAxisAngle(zAxis, rotZAxis)
  transform.SetPosition(position)
  transform.SetOrientation(orientation)
  listener.SetListenerTransform(transform)
  transform.delete()
}

/* ========================================================================== */
/* BINAURAL SPATIALIZER */
/* ========================================================================== */
function createInstance() {
  // SET SOURCE POSITION
  function setSourcePosition(source, x, y, z) {
    setSPosition(source, x, y, z)
  }

  // SET LISTENER POSITION
  function setListenerPosition(x, y, z, rotZAxis) {
    setLPosition(x, y, z, rotZAxis)
  }

  // SET PERFORMANCE MODE
  // function setPerformanceMode(isEnabled) {
  //   map(sources, source => {
  //     // console.log(target.source);
  //     source.source.SetSpatializationMode(
  //       isEnabled
  //         ? TSpatializationMode.HighPerformance
  //         : TSpatializationMode.HighQuality
  //     )
  //   })
  // }

  // SET HEAD RADIUS
  // function setHeadRadius(radius) {
  //   listener.SetHeadRadius(radius)
  // }

  // ADD SOURCE
  function addSource(sourceObject) {
    const source = binauralApi.CreateSource()
    setSourcePosition(
      source,
      sourceObject.position.x,
      sourceObject.position.y,
      sourceObject.position.z
    )

    const sourceInputMonoBuffer = new CMonoBuffer()
    sourceInputMonoBuffer.resize(512, 0)

    const sourceOutputStereoBuffer = new CStereoBuffer()
    sourceOutputStereoBuffer.resize(1024, 0)
    // Script Node (bufferSize, # InputChannels, # OutputChannels)
    const processor = context.createScriptProcessor(512, 1, 2)
    // PROCESSING FUNCTION
    processor.onaudioprocess = audioProcessingEvent => {
      const { inputBuffer, outputBuffer } = audioProcessingEvent
      const inputData = inputBuffer.getChannelData(0)

      for (let i = 0; i < inputData.length; i++) {
        sourceInputMonoBuffer.set(i, inputData[i])
      }
      // process data
      source.ProcessAnechoic(
        sourceInputMonoBuffer,
        sourceOutputStereoBuffer
      )
      const outputDataLeft = outputBuffer.getChannelData(0)
      const outputDataRight = outputBuffer.getChannelData(1)

      for (let i = 0; i < outputDataLeft.length; i++) {
        outputDataLeft[i] = sourceOutputStereoBuffer.get(i * 2)
        outputDataRight[i] = sourceOutputStereoBuffer.get(i * 2 + 1)
      }
    }

    sources[sourceObject.name] = {
      source: source,
      processor: processor,
    }
  }

  // DELETE Source
  function deleteSources(sourcesFilenames) {
    sourcesFilenames.forEach(source => {
      delete sources[source]
    })
  }

  // DELETE ALL sources
  function deleteAllSources() {
    map(sources, source => {
      delete sources[source]
    })
  }

  // IMPORT sources
  function importSources(sourcesObject) {
    sources = reduce(
      sourcesObject,
      (aggr, source) => {
        const newSource = binauralApi.CreateSource()
        setSourcePosition(
          newSource,
          source.position.azimuth,
          source.position.distance
        )

        const sourceInputMonoBuffer = new CMonoBuffer()
        sourceInputMonoBuffer.resize(512, 0)

        const sourceOutputStereoBuffer = new CStereoBuffer()
        sourceOutputStereoBuffer.resize(1024, 0)
        // Script Node (bufferSize, # InputChannels, # OutputChannels)
        const processor = context.createScriptProcessor(512, 1, 2)
        // PROCESSING FUNCTION
        processor.onaudioprocess = audioProcessingEvent => {
          const { inputBuffer, outputBuffer } = audioProcessingEvent
          const inputData = inputBuffer.getChannelData(0)

          for (let i = 0; i < inputData.length; i++) {
            sourceInputMonoBuffer.set(i, inputData[i])
          }
          // process data
          source.ProcessAnechoic(
            sourceInputMonoBuffer,
            sourceOutputStereoBuffer
          )
          const outputDataLeft = outputBuffer.getChannelData(0)
          const outputDataRight = outputBuffer.getChannelData(1)

          for (let i = 0; i < outputDataLeft.length; i++) {
            outputDataLeft[i] = sourceOutputStereoBuffer.get(i * 2)
            outputDataRight[i] = sourceOutputStereoBuffer.get(i * 2 + 1)
          }
        }

        return {
          ...aggr,
          [source.filename]: {
            source: source,
            processor: processor,
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
    console.log('LISTENER - initialised')
    // CREATE and SETUP TARGET SOURCE(S) - mono
    sources = audioFiles.reduce((aggr, file, index) => {
      const source = binauralApi.CreateSource()
      setSourcePosition(source, index * Math.PI / 6, 3)

      const sourceInputMonoBuffer = new CMonoBuffer()
      sourceInputMonoBuffer.resize(512, 0)

      const sourceOutputStereoBuffer = new CStereoBuffer()
      sourceOutputStereoBuffer.resize(1024, 0)
      // Script Node (bufferSize, # InputChannels, # OutputChannels)
      const processor = context.createScriptProcessor(512, 1, 2)
      // PROCESSING FUNCTION
      processor.onaudioprocess = audioProcessingEvent => {
        const { inputBuffer, outputBuffer } = audioProcessingEvent
        const inputData = inputBuffer.getChannelData(0)

        for (let i = 0; i < inputData.length; i++) {
          sourceInputMonoBuffer.set(i, inputData[i])
        }
        // process data
        source.ProcessAnechoic(
          sourceInputMonoBuffer,
          sourceOutputStereoBuffer
        )
        const outputDataLeft = outputBuffer.getChannelData(0)
        const outputDataRight = outputBuffer.getChannelData(1)

        for (let i = 0; i < outputDataLeft.length; i++) {
          outputDataLeft[i] = sourceOutputStereoBuffer.get(i * 2)
          outputDataRight[i] = sourceOutputStereoBuffer.get(i * 2 + 1)
        }
      }

      return {
        ...aggr,
        [file.filename]: {
          source: source,
          processor: processor,
        },
      }
    }, {}) // end of .reduce
    console.log(`binauralSpatializer: INIT - ends`)
    console.log('')

    return {
      listener,
      sources,
      setSourcePosition,
      setListenerPosition,
      // setPerformanceMode,
      // setHeadRadius,
      addSource,
      deleteSources,
      deleteAllSources,
      importSources,
    }
  }) // end of .then
}

/* ========================================================================== */
export function getInstance() {
  if (instancePromise !== null) {
    return instancePromise
  }

  instancePromise = createInstance()
  return instancePromise
}
