import ioc from 'socket.io-client'
import customParser from 'socket.io-msgpack-parser'

// const route = 'bangonlineserver-production.up.railway.app'
// const route = 'http://localhost:4000'
const route = 'http://3.79.179.18:4000'

export const socket = ioc(route, {
  parser: customParser
})
