type Request = import('http').IncomingMessage
type Response = import('http').ServerResponse

type JsonArray = ReadonlyArray<Json>
type JsonRecord = { readonly [key: string]: Json }
/** Type matches any json */
type Json = boolean | number | string | null | JsonRecord | JsonArray | readonly []

/** Request data for json request case */
type JsonRequestData = { type: 'json', data: Json, request: Request, response: Response }
/** Request data for text request case */
type TextRequestData = { type: 'text', data: string, request: Request, response: Response }
/** Request data for query request case */
type QueryRequestData = { type: 'query', data: import('querystring').ParsedUrlQuery, request: Request, response: Response }

/** Event will be fired when any http request will be received */
type RequestReceivedEvent = import('@xroom-app/pkg-events').Event<JsonRequestData | TextRequestData | QueryRequestData>

/**
 * RequestListener instance
 *
 * Includes event system and
 * start listening port command
 */
type RequestListener = {
  listen: (port: number) => import('http').Server
  eventSystem: import('@xroom-app/pkg-events').EventSystem
  events: { requestReceived: RequestReceivedEvent }
}

/** Returns new http request listener */
export function getRequestListener(): RequestListener
