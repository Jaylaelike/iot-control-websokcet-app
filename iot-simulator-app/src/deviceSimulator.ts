import WebSocket from "ws"
import express from "express"
import cors from "cors"
import { config } from "./config"
import type { Device, DeviceUpdate, UpdateDeviceRequest } from "./types"

class DeviceSimulator {
  private wss: WebSocket.Server
  private devices: Device[]
  // private users: User[]
  private app: express.Application

  constructor() {
    this.wss = new WebSocket.Server({ noServer: true })
    this.devices = [...config.devices]
    // this.users = [...config.users]
    this.app = express()
    this.init()
  }

  private init() {
    this.app.use(cors())
    this.app.use(express.json())

    // Get all devices
    this.app.get("/api/devices", (req, res) => {
      res.json(this.devices)
    })

    // Update device state
    this.app.put("/api/devices/:id", (req, res) => {
      const deviceId = req.params.id
      const { state } = req.body
      
      const device = this.devices.find(d => d.id === deviceId)
      if (!device) {
        res.status(404).json({ error: "Device not found" })
        return
      }

      device.state = state
      // Use first user as default for simulation
      // const user = this.users[0]
      this.broadcastUpdate(device)

      res.json(device)
    })

    this.app.post("/update-device", (req, res) => {
      const { deviceId, newState } = req.body as UpdateDeviceRequest
      const device = this.devices.find((d) => d.id === deviceId)
      // const user = this.users.find((u) => u.id === userId)

      if (!device) {
        res.status(404).json({ error: "Device or user not found" })
        return
      }

      device.state = newState
      this.broadcastUpdate(device)
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

  private broadcastUpdate(device: Device) {
    const update: DeviceUpdate = { type: "deviceUpdate", device }
    const message = JSON.stringify(update)

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })

    console.log(`Device update: ${device.name} is now ${device.state ? "ON" : "OFF"} (Updated by )`)
  }
}

new DeviceSimulator()
