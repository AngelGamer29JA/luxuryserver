// @deno-types="npm:@types/ws"
import WebSocket, { WebSocketServer } from "npm:ws"


const wss = new WebSocketServer({
  port: 3500
}, () => {
  console.log("Listen to :3500")
})

wss.on("connection", (client) => {
  console.log("New client connected %s");
  
  client.on("open", () => {
    console.log("New client connected %s");
  })

  client.on("message", (data) => {
    console.log(data.toString())
    broadcast(data.toString(), client)
  })
})

function broadcast(message: string, sender: WebSocket) {
  for (const client of wss.clients) {
    if (sender !== client) client.send(message)
  }
}