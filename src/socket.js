import io from "socket.io-client";

export const socket = io.connect("https://bangonlineserver-production.up.railway.app/");

// bangonlineserver-production.up.railway.app
// http://localhost:3001