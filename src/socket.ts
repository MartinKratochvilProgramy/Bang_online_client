import ioc from 'socket.io-client'
import customParser from 'socket.io-msgpack-parser'

// const route = 'bangonlineserver-production.up.railway.app'
const route = 'https://bang-online-server.2.ie-1.fl0.io'
// const route = 'http://52.59.233.240:4000'

export const socket = ioc(route, {
  parser: customParser
})
