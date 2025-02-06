import { Server } from "ws"
import { createServer } from "http"
import { parse } from "url"

const server = createServer()
const wss = new Server({ noServer: true })

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log("received: %s", message)
    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  })
})

server.on("upgrade", (request, socket, head) => {
  const { pathname } = parse(request.url!)

  if (pathname === "/ws") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request)
    })
  } else {
    socket.destroy()
  }
})

server.listen(8080, () => {
  console.log("WebSocket server is running on :8080")
})

