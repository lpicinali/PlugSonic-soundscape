/* global location */
/* eslint no-restricted-globals: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import // Ear,
// SonicComponent
'src/constants.js'

export const getFileUrl = filename =>
  `${location.origin}/assets/audio/${filename}`

export const audioFiles = [
  {
    title: 'River',
    filename: 'river_gentle_flow.mp3',
    url: 'https://dl.dropboxusercontent.com/s/fjryls9cuymcquy/river_gentle_flow.mp3?dl=0',
  },
  {
    title: 'Pigeon',
    filename: 'bird_pigeon.mp3',
    url:
      'https://dl.dropboxusercontent.com/s/p87nb5yr6zhrez5/bird_pigeon.mp3?dl=0',
  },
  // {
  //   title: 'Wind',
  //   filename: 'wind_breeze.mp3',
  //   url: getFileUrl('wind_breeze.mp3'),
  // },
]

export const getFileIndex = filename =>
  audioFiles.findIndex(file => file.filename === filename)

export const getFileNames = () => audioFiles.map(file => file.filename)
