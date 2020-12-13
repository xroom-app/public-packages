/**
 * Creates reconnecting socket
 *
 * @param url url to connect
 * @param interval reconnect interval in milliseconds
 *
 * @return lazy reconnecting socket
 */
export function getReconnectingSocket(url: string, interval: number): () => import('ws')
