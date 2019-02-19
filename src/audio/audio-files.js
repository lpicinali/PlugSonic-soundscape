/* global location */
/* eslint no-restricted-globals: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import // Ear,
// SonicComponent
'src/constants.js'

export const getFileUrl = filename =>
  `${location.origin}/assets/audio/sources/${filename}`

export const audioFiles = [
  // {
  //   name: 'Bicycles and Traffic',
  //   filename: '_Bicycle+Traffic.mp3',
  //   url: getFileUrl('_Bicycle+Traffic.mp3'),
  //   position: { x: 0, y: 0, z: 0 },
  //   volume: 0.5,
  //   reach: { radius: 22, fadeDuration: 1000 },
  // },
]

export const getFileIndex = filename =>
  audioFiles.findIndex(file => file.filename === filename)

export const getFileNames = () => audioFiles.map(file => file.filename)
