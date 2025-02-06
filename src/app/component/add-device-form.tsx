"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useSocket } from "../hooks/use-socket"

export function AddDeviceForm() {
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const socket = useSocket()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, type }),
      })

      if (response.ok) {
        const newDevice = await response.json()
        toast({
          title: "Device Added",
          description: "New device has been successfully added.",
        })
        setName("")
        setType("")
        router.refresh()

        if (socket) {
          socket.emit("deviceAdded", newDevice)
        }
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to add device",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding device:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Device Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="type">Device Type</Label>
        <Input id="type" value={type} onChange={(e) => setType(e.target.value)} required />
      </div>
      <Button type="submit">Add Device</Button>
    </form>
  )
}

