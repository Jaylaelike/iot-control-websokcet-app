import { WebSocketServer, WebSocket } from "ws"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const wss = new WebSocketServer({ port: 8080 })

const clients: WebSocket[] = []
const devices: { id: string; name: string; state: boolean }[] = []

async function initializeDevices() {
  const dbDevices = await prisma.device.findMany()
  devices.push(...dbDevices.map((d) => ({ id: d.id, name: d.name, state: d.state })))
}

function broadcastDeviceUpdate(device: { id: string; name: string; state: boolean }) {
  const message = JSON.stringify({
    type: "deviceUpdate",
    device,
  })
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
}

function simulateDeviceChanges() {
  setInterval(async () => {
    const deviceToUpdate = devices[Math.floor(Math.random() * devices.length)]
    if (deviceToUpdate) {
      deviceToUpdate.state = !deviceToUpdate.state
      broadcastDeviceUpdate(deviceToUpdate)

      // Get a random user
      const users = await prisma.user.findMany()
      const randomUser = users[Math.floor(Math.random() * users.length)]

      // Update the device state in the database
      prisma.device
        .update({
          where: { id: deviceToUpdate.id },
          data: { state: deviceToUpdate.state },
        })
        .then(() => {
          // Log the state change with user information
          return prisma.log.create({
            data: {
              deviceId: deviceToUpdate.id,
              userId: randomUser.id,
              state: deviceToUpdate.state,
            },
          })
        })
        .catch(console.error)
    }
  }, 5000) // Simulate a change every 5 seconds
}

wss.on("connection", (ws) => {
  clients.push(ws)
  console.log("New client connected")

  ws.on("close", () => {
    const index = clients.indexOf(ws)
    if (index > -1) {
      clients.splice(index, 1)
    }
    console.log("Client disconnected")
  })
})

initializeDevices()
  .then(() => {
    console.log("Devices initialized")
    simulateDeviceChanges()
    console.log("WebSocket server is running on ws://localhost:8080")
  })
  .catch(console.error)

