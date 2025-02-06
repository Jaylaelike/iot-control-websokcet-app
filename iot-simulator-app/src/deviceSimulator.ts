// import WebSocket from "ws"
// import { config } from "./config"
// import type { Device, DeviceUpdate, User } from "./types"

// class DeviceSimulator {
//   private wss: WebSocket.Server
//   private devices: Device[]
//   private users: User[]

//   constructor() {
//     this.wss = new WebSocket.Server({ port: Number(config.port) })
//     this.devices = config.devices.map(d => ({
//       id: d.id,
//       name: d.name || `Device ${d.id}`, // Provide default name if missing
//       type: d.type,
//       state: d.state,
//       updateInterval: d.updateInterval
//     }))
//     this.users = [...config.users]
//     this.init()
//   }

//   private init() {
//     this.wss.on("connection", (ws) => {
//       console.log("New client connected")
//       ws.on("close", () => console.log("Client disconnected"))
//     })

//     this.devices.forEach((device) => this.simulateDevice(device))

//     console.log(`WebSocket server is running on ws://localhost:${config.port}`)
//   }

//   private simulateDevice(device: Device) {
//     setInterval(() => {
//       device.state = !device.state
//       this.broadcastUpdate(device)
//     }, device.updateInterval)
//   }

//   private getRandomUser(): User {
//     return this.users[Math.floor(Math.random() * this.users.length)]
//   }

//   private broadcastUpdate(device: Device) {
//     const user = this.getRandomUser()
//     const update: DeviceUpdate = { type: "deviceUpdate", device, user }
//     const message = JSON.stringify(update)

//     this.wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(message)
//       }
//     })

//     console.log(`Device update: ${device.name} is now ${device.state ? "ON" : "OFF"} (Updated by ${user.name})`)
//   }
// }

// new DeviceSimulator()


import WebSocket from "ws"
import express from "express"
import cors from "cors"
import { config } from "./config"
import type { Device, DeviceUpdate, User, UpdateDeviceRequest } from "./types"



class DeviceSimulator {
  private wss: WebSocket.Server
  private devices: Device[]
  private users: User[]
  private app: express.Application

  constructor() {
    this.wss = new WebSocket.Server({ noServer: true })
    this.devices = [...config.devices]
    this.users = [...config.users]
    this.app = express()
    this.init()
  }

  private init() {
    this.app.use(cors())
    this.app.use(express.json())

    this.app.post("/update-device", (req, res) => {
      const { deviceId, newState, userId } = req.body as UpdateDeviceRequest
      const device = this.devices.find((d) => d.id === deviceId)
      const user = this.users.find((u) => u.id === userId)

      if (!device || !user) {
        res.status(404).json({ error: "Device or user not found" })
        return
      }

      device.state = newState
      this.broadcastUpdate(device, user)
      res.json({ success: true })
    })

    const server = this.app.listen(Number(config.port), () => {
      console.log(`HTTP and WebSocket server is running on http://localhost:${config.port}`)
    })

    server.on("upgrade", (request, socket, head) => {
      this.wss.handleUpgrade(request, socket, head, (ws) => {
        this.wss.emit("connection", ws, request)
      })
    })

    this.wss.on("connection", (ws) => {
      console.log("New client connected")
      ws.on("close", () => console.log("Client disconnected"))
    })
  }

  private broadcastUpdate(device: Device, user: User) {
    const update: DeviceUpdate = { type: "deviceUpdate", device, user }
    const message = JSON.stringify(update)

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })

    console.log(`Device update: ${device.name} is now ${device.state ? "ON" : "OFF"} (Updated by ${user.name})`)
  }
}

new DeviceSimulator()

