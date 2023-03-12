import ioc from 'socket.io-client'
import customParser from 'socket.io-msgpack-parser'

export const socket = ioc('bangonlineserver-production.up.railway.app', {
  parser: customParser
})
// export const socket = ioc('http://localhost:4000', {
//   parser: customParser
// })

// bangonlineserver-production.up.railway.app
// http://localhost:3001
