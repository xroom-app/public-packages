# Wrapper over standard http listener

## Installation

Run from command line

```
npm i @xroom.app/http-listener
```

## Usage example

```js
const { getRequestListener } = require('@xroom.app/http-listener')

const { events, eventSystem, listen } = getRequestListener()

eventSystem.on(events.requestReceived, ({ type, data, request, response }) => {
  if (type === 'json') {
    console.log('JSON request received: ', data)
    response.end('ok')
  } else {
    if (request.headers['content-type'] === 'application/json') {
      response.end('Invalid JSON passed')
    } else {
      response.end('JSON request required')
    }
  }
})

const server = listen(3000)
```
