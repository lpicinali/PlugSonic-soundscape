/* global location */
/* eslint no-restricted-globals: 0 */

/* ------------------- NOTES -------------------- *//*

    from z_audio-files-0.0-original

     - change data structure to Array of Objects

*//* ---------------------------------------------- */

import {
  // Ear,
  // SonicComponent
} from 'src/constants.js'

export const audioFiles = [
    {
      title: 'River',
      filename:
        'river_gentle_flow.mp3',
    },
    {
      title: 'Wind',
      filename:
        'wind_breeze.mp3',
    },
    {
      title: 'Bird Calling',
      filename:
        'bird_calling.mp3',
    },
    {
      title: 'Pigeon',
      filename:
        'bird_pigeon.mp3',
    },
    {
      title: 'Bird Flying',
      filename:
        'flying_bird.mp3',
    },
    {
      title: 'Frogs',
      filename:
        'frogs.mp3',
    },
]

export const getFileUrl = filename =>
  `${location.origin}/assets/audio/${filename}`;

export const getFileIndex = filename =>
  audioFiles.findIndex(file => file.filename === filename);

export const getFileNames = () =>
  audioFiles.map(file => file.filename);
