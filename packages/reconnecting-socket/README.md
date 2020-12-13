# Wrapper reconnects ws socket after break

## Installation

Run from command line

```
npm i @xroom.app/reconnecting-socket
```

## Usage example

```js
const { getReconnectingSocket } = require('@xroom.app/reconnecting-socket')

const url = 'http://foobar.com'

const getSocket = getReconnectingSocket(url, 1000)

let clientId

getSocket().on('open', () => {
    getSocket().send('requestId')
})

getSocket().on('message', (message) => {
    clientId = message.toString()
})
```
