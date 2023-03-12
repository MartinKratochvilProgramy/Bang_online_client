import ioc from 'socket.io-client'
import customParser from 'socket.io-msgpack-parser'

const route = 'bangonlineserver-production.up.railway.app'
// const route = 'http://localhost:4000'

export const socket = ioc(route, {
  parser: customParser
})

// bangonlineserver-production.up.railway.app
// http://localhost:3001
