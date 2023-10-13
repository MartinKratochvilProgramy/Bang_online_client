import ioc from 'socket.io-client'
import customParser from 'socket.io-msgpack-parser'

// const route = 'bangonlineserver-production.up.railway.app'
// const route = 'http://localhost:4000'
const route = 'https://18.159.209.1:4000'

export const socket = ioc(route, {
  parser: customParser
})
