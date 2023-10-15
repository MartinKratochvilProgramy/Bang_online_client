import ioc from 'socket.io-client'
import customParser from 'socket.io-msgpack-parser'

// const route = 'bangonlineserver-production.up.railway.app'
// const route = 'http://localhost:443'
const route = 'http://52.59.233.240:4000'

export const socket = ioc(route, {
  parser: customParser
})
