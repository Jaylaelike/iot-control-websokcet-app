import { useEffect, useState } from "react"
import io, { type Socket } from "socket.io-client"
import { useToast } from "@/hooks/use-toast"

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const socketIo = io(process.env.NEXT_PUBLIC_API_URL || "", {
      path: "/api/socketio",
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketIo.on("connect", () => {
      console.log("Connected to WebSocket server")
      toast({
        title: "Connected",
        description: "Successfully connected to the server.",
      })
    })

    socketIo.on("connect_error", (error) => {
      console.error("Connection error:", error)
      toast({
        title: "Connection Error",
        description: "Failed to connect to the server. Retrying...",
        variant: "destructive",
      })
    })

    socketIo.on("error", (error) => {
      console.error("WebSocket error:", error)
      toast({
        title: "Error",
        description: "An error occurred with the WebSocket connection.",
        variant: "destructive",
      })
    })

    socketIo.on("disconnect", (reason) => {
      console.log("Disconnected:", reason)
      toast({
        title: "Disconnected",
        description: `Disconnected from the server. Reason: ${reason}`,
        variant: "destructive",
      })
    })

    setSocket(socketIo)

    return () => {
      socketIo.disconnect()
    }
  }, [toast])

  return socket
}

