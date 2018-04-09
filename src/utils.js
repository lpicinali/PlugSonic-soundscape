import bufferToArrayBuffer from 'buffer-to-arraybuffer'
import got from 'got'

import context from 'src/audio/context.js'
import decode from 'src/audio/decode.js'

export function circumferenceToRadius(circumference) {
  return circumference / (2 * Math.PI)
}

export function radiusToCircumference(radius) {
  return radius * 2 * Math.PI
}

export function fetchAudioBuffer(url) {
  // console.log("utils: FETCH audio buffer - begins");
  // (async () => {
  //   try {
  //     const response = await got(url);
  //     console.log(`response._readableState: ${response._readableState}`);
  //     console.log(`response.readable: ${response.readable}`);
  //     console.log(`response._events: ${response._events}`);
  //     console.log(`response.url: ${response.url}`);
  //     console.log(`response.statusCode: ${response.statusCode}`);
  //     console.log(`response.statusMessage: ${response.statusMessage}`);
  //     console.log(`response.requestUrl: ${response.requestUrl}`);
  //   } catch (error) {
  //       console.log(error.response.body);
  //   }
  // })();

  return got(url, { encoding: null })
    .then(response =>
      bufferToArrayBuffer(response.body)
    )
    .then(arrayBuffer =>
      decode(arrayBuffer, context)
    )
}
