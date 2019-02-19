export default function decode(buffer, context) {
  return new Promise((resolve, reject) => {
    context.decodeAudioData(
      buffer,
      audioBuffer => resolve(audioBuffer),
      err => reject(err)
    )
  })
}
