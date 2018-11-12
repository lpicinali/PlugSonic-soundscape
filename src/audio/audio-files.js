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
  //   title: 'Bicycles and Traffic',
  //   filename: '_Bicycle+Traffic.mp3',
  //   url: getFileUrl('_Bicycle+Traffic.mp3'),
  //   position: { azimuth: 4.205499089178329, distance: 51.08310184835867 },
  //   volume: 0.277824771759503,
  //   reach: { radius: 22, fadeDuration: 1000 },
  // },
  // {
  //   title: 'Birds 01',
  //   filename: '_Birds_01.mp3',
  //   url: getFileUrl('_Birds_01.mp3'),
  //   position: { azimuth: 3.0791245855432168, distance: 46.28633316960394 },
  //   volume: 0.6,
  //   reach: { radius: 24, fadeDuration: 3000 },
  // },
  // {
  //   title: 'Music RAH',
  //   filename: '_Classical_Music_from_RAH - MENDELSSOHN ATHALIE - OP. 74.mp3',
  //   url: getFileUrl('_Classical_Music_from_RAH - MENDELSSOHN ATHALIE - OP. 74.mp3'),
  //   position: { azimuth: 4.691909012310575, distance: 50.010487560128496 },
  //   volume: 0.38183460964753004,
  //   reach: { radius: 26, fadeDuration: 4000 },
  // },
  // {
  //   title: 'Frieze Painting',
  //   filename: '_Frieze-Painters.mp3',
  //   "url": getFileUrl('_Frieze-Painters.mp3'),
  //   position: { azimuth: 0.10881215068917935, distance: 13.135475831530943 },
  //   volume: 0.6623379844935925,
  //   reach: { radius: 11, fadeDuration: 500 },
  // },
]

export const getFileIndex = filename =>
  audioFiles.findIndex(file => file.filename === filename)

export const getFileNames = () => audioFiles.map(file => file.filename)
