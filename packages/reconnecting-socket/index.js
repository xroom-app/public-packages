const WebSocket = require('ws')

// SECTION Accessors

/**
 * Creates reconnecting socket
 *
 * @param {string} url url to connect
 * @param {number} interval reconnect interval in milliseconds
 *
 * @return {() => import('ws')} lazy reconnecting socket
 */
function getReconnectingSocket (url, interval) {
  let socket = new WebSocket(url)

  socket.on('close', () => {
    setTimeout(() => {
      socket = reInitSocket(url, socket)
    }, interval)
  })

  return () => socket
}

/**
 * Inits new socket will be connected to 'url'
 *
 * @param {string} url url to connect
 * @param {import('ws')} oldSocket old socket
 *
 * @return {import('ws')} new initialized socket
 */
function reInitSocket (url, oldSocket) {
  const socket = new WebSocket(url)

  for (const event of oldSocket.eventNames()) {
    for (const listener of oldSocket.listeners(event)) {
      // @ts-ignore necessary
      socket.on(event, listener)
    }
  }

  return socket
}

// SECTION Exports

module.exports = { getReconnectingSocket }
