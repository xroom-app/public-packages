const { createEvent, createEventSystem } = require('@xroom.app/events')
const { createServer } = require('http')
const { parse } = require('url')

// SECTION Types

/** @template T @typedef {import('@xroom.app/events').Event<T>} Event */
/** @typedef {ReturnType<typeof createEventSystem>} EventSystem */

/** @typedef {import('http').IncomingMessage} Request */
/** @typedef {import('http').ServerResponse} Response */
/** @typedef {import('http').RequestListener} RequestListener */

/** @typedef {ReadonlyArray<Json>} JsonArray */
/** @typedef {{ readonly [key: string]: Json }} JsonRecord */
/** @typedef {boolean | number | string | null | JsonRecord | JsonArray | readonly []} Json */

/** @typedef {{ type: 'json', data: Json, request: Request, response: Response }} JsonRequestData */
/** @typedef {{ type: 'text', data: string, request: Request, response: Response }} TextRequestData */
/** @typedef {{ type: 'query', data: import('querystring').ParsedUrlQuery, request: Request, response: Response }} QueryRequestData */
/** @typedef {Event<JsonRequestData | TextRequestData | QueryRequestData>} RequestReceivedEvent */
/** @typedef {{ requestReceived: RequestReceivedEvent }} HttpEvents */

// SECTION Library

/**
 * @return {{
 *   listen: (port: number) => import('http').Server
 *   eventSystem: EventSystem
 *   events: HttpEvents
 * }}
 */
function getRequestListener () {
  const
    events = {
      /** @type {RequestReceivedEvent} */
      requestReceived: createEvent()
    },
    eventSystem = createEventSystem(Object.values(events)),
    responseHandler = getRequestHandler(events, eventSystem)

  return { listen: port => createServer(responseHandler).listen(port), eventSystem, events }
}

// SECTION Util

/**
 * Returns new http requests handler
 *
 * @param {HttpEvents} events
 * @param {EventSystem} eventSystem
 *
 * @return {RequestListener} request handler
 */
function getRequestHandler (events, eventSystem) {
  return (req, res) => {
    if (req.method === 'GET' && req.url) {
      eventSystem.emit(events.requestReceived, {
        type: 'query',
        data: parse(req.url, true).query,
        request: req,
        response: res
      })

      return
    }

    /** @type {Array<string>} */
    const chunks = []

    req.on('data', chunk => {
      chunks.push(chunk)
    })

    req.once('end', () => {
      req.removeAllListeners('data')
      req.removeAllListeners('end')

      const dataString = chunks.join('')

      try {
        eventSystem.emit(events.requestReceived, {
          type: 'json',
          data: JSON.parse(dataString),
          request: req,
          response: res
        })
      } catch {
        eventSystem.emit(events.requestReceived, {
          type: 'text',
          data: dataString,
          request: req,
          response: res
        })
      }
    })
  }
}

// SECTION Exports

module.exports = { getRequestListener }
