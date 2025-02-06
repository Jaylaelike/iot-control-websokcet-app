

// "use client"

// import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
// import { useEffect, useState, useRef } from "react"
// import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Switch } from "@/components/ui/switch"
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

// type Device = {
//   id: string
//   name: string
//   state: boolean
// }

// type Log = {
//   id: string
//   deviceId: string
//   state: boolean
//   timestamp: string
//   device: {
//     name: string
//   }
//   user: {
//     name: string | null
//     email: string
//   }
// }

// type WebSocketUpdate = {
//   type: "deviceUpdate"
//   device: Device
//   user: {
//     id: string
//     name: string
//     email: string
//   }
// }

// const queryClient = new QueryClient()

// function DashboardContent() {
//   const { data: session, status } = useSession()
//   const router = useRouter()
//   const [devices, setDevices] = useState<Device[]>([])
//   const wsRef = useRef<WebSocket | null>(null)
//   const queryClient = useQueryClient()

//   const { data: logs, isLoading: isLoadingLogs } = useQuery<Log[]>({
//     queryKey: ["logs"],
//     queryFn: async () => {
//       const response = await fetch("/api/logs")
//       if (!response.ok) {
//         throw new Error("Network response was not ok")
//       }
//       return response.json()
//     },
//   })

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/login")
//     } else if (status === "authenticated") {
//       fetchDevices()
//       connectWebSocket()
//     }
//     return () => {
//       if (wsRef.current) {
//         wsRef.current.close()
//       }
//     }
//   }, [status, router])

//   const fetchDevices = async () => {
//     const response = await fetch("/api/devices")
//     if (response.ok) {
//       const data = await response.json()
//       setDevices(data)
//     }
//   }

//   const toggleDevice = async (id: string, currentState: boolean) => {
//     const response = await fetch(`/api/devices/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ state: !currentState }),
//     })
//     if (response.ok) {
//       setDevices(devices.map((device) => (device.id === id ? { ...device, state: !currentState } : device)))
//       // Refetch logs after toggling a device
//       queryClient.invalidateQueries(["logs"])
//     }
//   }

//   const connectWebSocket = () => {
//     wsRef.current = new WebSocket("ws://localhost:8080")

//     wsRef.current.onmessage = (event) => {
//       const data: WebSocketUpdate = JSON.parse(event.data)
//       if (data.type === "deviceUpdate") {
//         setDevices((prevDevices) =>
//           prevDevices.map((device) =>
//             device.id === data.device.id ? { ...device, state: data.device.state } : device,
//           ),
//         )
//         // Refetch logs after receiving a device update
//         queryClient.invalidateQueries(["logs"])
//       }
//     }

//     wsRef.current.onopen = () => {
//       console.log("Connected to device simulator")
//     }

//     wsRef.current.onerror = (error) => {
//       console.error("WebSocket error:", error)
//     }

//     wsRef.current.onclose = () => {
//       console.log("Disconnected from device simulator")
//     }
//   }

//   if (status === "loading") {
//     return <div>Loading...</div>
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Welcome, {session?.user?.name || session?.user?.email}</CardTitle>
//           <CardDescription>You are logged in as {session?.user?.email}</CardDescription>
//         </CardHeader>
//       </Card>

//       <h1 className="text-2xl font-bold mb-4">Device Dashboard</h1>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Device Name</TableHead>
//             <TableHead>State</TableHead>
//             <TableHead>Action</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {devices.map((device) => (
//             <TableRow key={device.id}>
//               <TableCell>{device.name}</TableCell>
//               <TableCell>{device.state ? "On" : "Off"}</TableCell>
//               <TableCell>
//                 <Switch checked={device.state} onCheckedChange={() => toggleDevice(device.id, device.state)} />
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <Card className="mt-8">
//         <CardHeader>
//           <CardTitle>Device Logs</CardTitle>
//           <CardDescription>Recent activity of your devices</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {isLoadingLogs ? (
//             <div>Loading logs...</div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Timestamp</TableHead>
//                   <TableHead>Device</TableHead>
//                   <TableHead>State</TableHead>
//                   <TableHead>User</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {logs?.map((log) => (
//                   <TableRow key={log.id}>
//                     <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
//                     <TableCell>{log.device.name}</TableCell>
//                     <TableCell>{log.state ? "On" : "Off"}</TableCell>
//                     <TableCell>{log.user.name || log.user.email}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>

//       <Button className="mt-4" onClick={() => router.push("/api/auth/signout")}>
//         Logout
//       </Button>
//     </div>
//   )
// }

// export default function Dashboard() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <DashboardContent />
//     </QueryClientProvider>
//   )
// }

"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef, useCallback } from "react"
import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useToast } from "../../hooks/use-toast"

type Device = {
  id: string
  name: string
  state: boolean
}

type Log = {
  id: string
  deviceId: string
  state: boolean
  timestamp: string
  device: {
    name: string
  }
  user: {
    name: string | null
    email: string
  }
}

type WebSocketUpdate = {
  type: "deviceUpdate"
  device: Device
  user: {
    id: string
    name: string
    email: string
  }
}

const queryClient = new QueryClient()

function DashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [devices, setDevices] = useState<Device[]>([])
  const wsRef = useRef<WebSocket | null>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: logs, isLoading: isLoadingLogs } = useQuery<Log[]>({
    queryKey: ["logs"],
    queryFn: async () => {
      const response = await fetch("/api/logs")
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    },
  })

  const fetchDevices = useCallback(async () => {
    try {
      const response = await fetch("/api/devices")
      if (response.ok) {
        const data = await response.json()
        setDevices(data)
      } else {
        throw new Error("Failed to fetch devices")
      }
    } catch (error) {
      console.error("Error fetching devices:", error)
      toast({
        title: "Error",
        description: "Failed to fetch devices. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  const toggleDevice = useCallback(
    async (id: string, currentState: boolean) => {
      try {
        const response = await fetch(`/api/devices/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: !currentState }),
        })
        if (response.ok) {
          setDevices((prevDevices) =>
            prevDevices.map((device) => (device.id === id ? { ...device, state: !currentState } : device)),
          )
          queryClient.invalidateQueries({ queryKey: ["logs"] })
        } else {
          throw new Error("Failed to update device")
        }
      } catch (error) {
        console.error("Error toggling device:", error)
        toast({
          title: "Error",
          description: "Failed to update device. Please try again.",
          variant: "destructive",
        })
      }
    },
    [queryClient, toast],
  )

  const connectWebSocket = useCallback(() => {
    wsRef.current = new WebSocket("ws://localhost:8080")

    wsRef.current.onmessage = (event) => {
      const data: WebSocketUpdate = JSON.parse(event.data)
      if (data.type === "deviceUpdate") {
        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.id === data.device.id ? { ...device, state: data.device.state } : device,
          ),
        )
        queryClient.invalidateQueries({ queryKey: ["logs"] })
        toast({
          title: "Device Updated",
          description: `${data.device.name} is now ${data.device.state ? "ON" : "OFF"} (Updated by ${data.user.name})`,
        })
      }
    }

    wsRef.current.onopen = () => {
      console.log("Connected to device simulator")
    }

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error)
      toast({
        title: "Connection Error",
        description: "Failed to connect to device simulator. Please refresh the page.",
        variant: "destructive",
      })
    }

    wsRef.current.onclose = () => {
      console.log("Disconnected from device simulator")
      toast({
        title: "Disconnected",
        description: "Lost connection to device simulator. Please refresh the page.",
        variant: "destructive",
      })
    }
  }, [queryClient, toast])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchDevices()
      connectWebSocket()
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [status, router, fetchDevices, connectWebSocket])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Welcome, {session?.user?.name || session?.user?.email}</CardTitle>
          <CardDescription>You are logged in as {session?.user?.email}</CardDescription>
        </CardHeader>
      </Card>

      <h1 className="text-2xl font-bold mb-4">Device Dashboard</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Device Name</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.map((device) => (
            <TableRow key={device.id}>
              <TableCell>{device.name}</TableCell>
              <TableCell>{device.state ? "On" : "Off"}</TableCell>
              <TableCell>
                <Switch checked={device.state} onCheckedChange={() => toggleDevice(device.id, device.state)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Device Logs</CardTitle>
          <CardDescription>Recent activity of your devices</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingLogs ? (
            <div>Loading logs...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs?.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{log.device.name}</TableCell>
                    <TableCell>{log.state ? "On" : "Off"}</TableCell>
                    <TableCell>{log.user.name || log.user.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Button className="mt-4" onClick={() => router.push("/api/auth/signout")}>
        Logout
      </Button>
    </div>
  )
}

export default function Dashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  )
}
