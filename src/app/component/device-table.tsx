"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { useSocket } from "../hooks/use-socket"
import { useToast } from "@/hooks/use-toast"

interface Device {
  id: string
  name: string
  state: boolean
  type: string
}

export function DeviceTable({ userId }: { userId: string }) {
  const [devices, setDevices] = useState<Device[]>([])
  const socket = useSocket()
  const { toast } = useToast()

  useEffect(() => {
    // Fetch devices from the API
    fetch(`/api/devices?userId=${userId}`)
      .then((res) => res.json())
      .then(setDevices)
      .catch((error) => {
        console.error("Error fetching devices:", error)
        toast({
          title: "Error",
          description: "Failed to fetch devices. Please try again.",
          variant: "destructive",
        })
      })

    if (socket) {
      socket.on("lightStateChanged", ({ deviceId, state }) => {
        setDevices((prevDevices) =>
          prevDevices.map((device) => (device.id === deviceId ? { ...device, state } : device)),
        )
        toast({
          title: "Device Updated",
          description: `Device ${deviceId} state changed to ${state ? "ON" : "OFF"}`,
        })
      })
    }

    return () => {
      if (socket) {
        socket.off("lightStateChanged")
      }
    }
  }, [userId, socket, toast])

  const handleToggle = (deviceId: string, newState: boolean) => {
    if (socket) {
      socket.emit("toggleLight", { deviceId, state: newState })
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Device Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Control</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.map((device) => (
            <TableRow key={device.id}>
              <TableCell className="font-medium">{device.name}</TableCell>
              <TableCell>{device.type}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    device.state ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {device.state ? "ON" : "OFF"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Switch
                  checked={device.state}
                  onCheckedChange={(checked) => handleToggle(device.id, checked)}
                  aria-label={`Toggle ${device.name}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

