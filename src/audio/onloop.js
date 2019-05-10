/**
 * Proxies the start() and stop() functions of an AudioBufferSourceNode
 * to also keep track of when a node is looping, and invoking `cb` every
 * time this happens.
 */
export default function onloop(node, cb) {
  let timerId = null

  const nodeProxy = new Proxy(node, {
    get(target, name) {
      if (name === 'start' && node.loop === true) {
        timerId = setInterval(cb, node.buffer.duration * 1000)
      }
      else if (name === 'stop') {
        timerId = clearInterval(timerId)
      }

      if (name in target) {
        if (typeof target[name] === 'function') {
          return target[name].bind(target)
        }

        return target[name]
      }

      return undefined
    },
  })

  return nodeProxy
}
