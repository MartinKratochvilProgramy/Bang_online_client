import * as io from 'socket.io-client'
import parser from 'socket.io-msgpack-parser'

export const socket = io.connect('bangonlineserver-production.up.railway.app', { parser })
// export const socket = io.connect('http://localhost:4000', { parser })

// bangonlineserver-production.up.railway.app
// http://localhost:3001
