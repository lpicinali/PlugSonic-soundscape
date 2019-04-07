import { map, reduce } from 'lodash'
import {
  fetchHrtfFile,
  registerHrtf,
} from '@reactify/3dti-toolkit/lib/binaural/hrtf.js'

import context from 'src/audio/context.js'
import toolkit from 'src/audio/toolkit.js'

const {
  BinauralAPI,
  CMonoBuffer,
  CStereoBuffer,
  CTransform,
  CVector3,
  CQuaternion,
  // T_ear,
  TSpatializationMode,
} = toolkit

/* ========================================================================== */
const binauralApi = new BinauralAPI()
let instancePromise = null
let listener = null

/*
      New Convention

           ^ X (azimuth = 0, increases anti-clockwise)
           |
      Y <--o Z
*/

/**
 * NOTE (Alexander):
 *
 * The axis convention in the JavaScript port is set to match Web Audio API
 * and cannot be configured. Hence we're setting positions to { -y, x, z }
 * below. We should probably migrate to use Web Audio API axes, or solve
 * this more neatly some other way.
 */

/* ------------------------------------------------------------------------ */
/* ========================================================================== */
/* ------------------------ COORDINATE SYSTEM ----------------------------- */
const zAxis = new CVector3(0, 0, 1)
/* ========================================================================== */
function setSPosition(source, x, y, z) {
  const transform = new CTransform()
  const position = new CVector3(-y, x, z)
  transform.SetPosition(position)
  source.SetSourceTransform(transform)
  transform.delete()
}

function setLPosition(x, y, z, rotZAxis) {
  const transform = new CTransform()
  const position = new CVector3(-y, x, z)
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
  const sources = {}

  /* ======================================================================== */
  // SET SOURCE POSITION
  /* ======================================================================== */
  function setSourcePosition(name, { x, y, z }) {
    const source = sources[name]
    if (source) {
      setSPosition(source.source, x, y, z)
    }
  }

  /* ======================================================================== */
  // SET LISTENER POSITION
  /* ======================================================================== */
  function setListenerPosition({ x, y, z, rotZAxis }) {
    setLPosition(x, y, z, rotZAxis)
  }

  /* ======================================================================== */
  // SET PERFORMANCE MODE
  /* ======================================================================== */
  function setPerformanceMode() {
    map(sources, source => {
      source.source.SetSpatializationMode(TSpatializationMode.HighPerformance)
    })
  }

  /* ======================================================================== */
  // SET QUALITY MODE
  /* ======================================================================== */
  function setQualityMode() {
    map(sources, source => {
      source.source.SetSpatializationMode(TSpatializationMode.HighQuality)
    })
  }

  /* ======================================================================== */
  // SET HEAD RADIUS
  /* ======================================================================== */
  function setHeadRadius(radius) {
    listener.SetHeadRadius(radius)
  }

  /* ======================================================================== */
  // SET HRTF
  /* ======================================================================== */
  function setHrtf(hrtfFilename) {
    return fetchHrtfFile(`/assets/audio/hrtf/${hrtfFilename}`).then(
      hrtfData => {
        // Register the HRTF file with
        const virtualHrtfFilePath = registerHrtf(
          toolkit,
          hrtfFilename,
          hrtfData
        )

        // Set the HRTF using the toolkit API.
        //
        // (The toolkit will read data from a virtual file system,
        // which is why we register it in the command above.)
        const success = toolkit.HRTF_CreateFrom3dti(
          virtualHrtfFilePath,
          listener
        )
        return success
      }
    )
  }

  /* ======================================================================== */
  // ADD SOURCE
  /* ======================================================================== */
  function addSource(source) {
    const binauralSource = binauralApi.CreateSource()
    setSPosition(
      binauralSource,
      source.position.x,
      source.position.y,
      source.position.z
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
      binauralSource.ProcessAnechoic(
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

    const spatializedSource = {
      source: binauralSource,
      processor: processor,
    }

    sources[source.name] = spatializedSource
  }

  // DELETE Source
  function deleteSources(sourcesNames) {
    sourcesNames.forEach(source => {
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
  function importSources(importedSources) {
    Object.values(importedSources).forEach(source => addSource(source))
  }

  console.log('')
  console.log(`binauralSpatializer: INIT - begins`)

  // CREATE and SETUP LISTENER
  listener = binauralApi.CreateListener(0.0875)
  listener.SetListenerTransform(new CTransform())
  // listener.EnableDirectionality(T_ear.LEFT)
  // listener.EnableDirectionality(T_ear.RIGHT)
  // Customized ITD is required for the HighPerformance mode to work
  listener.EnableCustomizedITD()

  console.log('LISTENER - initialised')

  console.log(`binauralSpatializer: INIT - ends`)
  console.log('')

  return {
    listener,
    sources,
    setSourcePosition,
    setListenerPosition,
    setPerformanceMode,
    setQualityMode,
    setHeadRadius,
    setHrtf,
    addSource,
    deleteSources,
    deleteAllSources,
    importSources,
  }
}

/* ========================================================================== */
export function getInstance() {
  if (instancePromise !== null) {
    return instancePromise
  }

  const instance = createInstance()
  instancePromise = Promise.resolve(instance)
  return instancePromise
}
