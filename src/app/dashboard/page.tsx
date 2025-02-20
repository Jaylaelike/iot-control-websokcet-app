

// "use client"

// import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
// import { useEffect, useState, useRef, useCallback } from "react"
// import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
// import { Switch } from "@/components/ui/switch"
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
// import { toast } from "../../hooks/use-toast"
// import { Wifi, WifiOff } from "lucide-react"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"

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
//   const [isWebSocketConnected, setIsWebSocketConnected] = useState(false)
//   const [showConnectionAlert, setShowConnectionAlert] = useState(false)

//   const { data: logs, isLoading: isLoadingLogs } = useQuery<Log[]>({
//     queryKey: ["logs"],
//     queryFn: async () => {
//       const response = await fetch("/api/logs")
//       if (!response.ok) {
//         throw new Error("Network response was not ok")
//       }
//       return response.json()
//     },
//     refetchInterval: 1000, // Refetch logs every second for real-time updates
//   })

//   const fetchDevices = useCallback(async () => {
//     try {
//       const response = await fetch("/api/devices")
//       if (response.ok) {
//         const data = await response.json()
//         setDevices(data)
//       } else {
//         throw new Error("Failed to fetch devices")
//       }
//     } catch (error) {
//       console.error("Error fetching devices:", error)
//       toast({
//         title: "Error",
//         description: "Failed to fetch devices. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }, [])

//   const toggleDevice = useCallback(
//     async (id: string, currentState: boolean) => {
//       if (!isWebSocketConnected) {
//         setShowConnectionAlert(true)
//         return
//       }

//       try {
//         const response = await fetch(`/api/devices/${id}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ state: !currentState }),
//         })
//         if (!response.ok) {
//           throw new Error("Failed to update device")
//         }
//         const updatedDevice = await response.json()
//         setDevices((prevDevices) =>
//           prevDevices.map((device) => (device.id === id ? { ...device, state: updatedDevice.state } : device)),
//         )
//         queryClient.invalidateQueries({ queryKey: ["logs"] })

//         // If WebSocket is not connected, show a toast notification
//         if (!isWebSocketConnected) {
//           toast({
//             title: "Device Updated",
//             description: `${updatedDevice.name} is now ${updatedDevice.state ? "ON" : "OFF"}`,
//           })
//         }
//       } catch (error) {
//         console.error("Error toggling device:", error)
//         toast({
//           title: "Error",
//           description: "Failed to update device. Please try again.",
//           variant: "destructive",
//         })
//       }
//     },
//     [queryClient, isWebSocketConnected],
//   )

//   const connectWebSocket = useCallback(() => {
//     wsRef.current = new WebSocket("ws://localhost:8080")

//     wsRef.current.onmessage = (event) => {
//       const data: WebSocketUpdate = JSON.parse(event.data)
//       if (data.type === "deviceUpdate") {
//         setDevices((prevDevices) =>
//           prevDevices.map((device) =>
//             device.id === data.device.id ? { ...device, state: data.device.state } : device,
//           ),
//         )
//         queryClient.invalidateQueries({ queryKey: ["logs"] })
//         toast({
//           title: "Device Updated",
//           description: `${data.device.name} is now ${data.device.state ? "ON" : "OFF"} (Updated by ${data.user.name})`,
//         })
//       }
//     }

//     wsRef.current.onopen = () => {
//       console.log("Connected to device simulator")
//       setIsWebSocketConnected(true)
//       toast({
//         title: "Connected",
//         description: "Successfully connected to device simulator.",
//       })
//     }

//     wsRef.current.onerror = (error) => {
//       console.error("WebSocket error:", error)
//       setIsWebSocketConnected(false)
//       toast({
//         title: "Connection Error",
//         description: "Failed to connect to device simulator. Device updates may be delayed.",
//         variant: "destructive",
//       })
//     }

//     wsRef.current.onclose = () => {
//       console.log("Disconnected from device simulator")
//       setIsWebSocketConnected(false)
//       toast({
//         title: "Disconnected",
//         description: "Lost connection to device simulator. Attempting to reconnect...",
//         variant: "destructive",
//       })
//       // Attempt to reconnect after 5 seconds
//       setTimeout(connectWebSocket, 5000)
//     }
//   }, [queryClient])

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
//   }, [status, router, fetchDevices, connectWebSocket])

//   if (status === "loading") {
//     return <div>Loading...</div>
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <AlertDialog open={showConnectionAlert} onOpenChange={setShowConnectionAlert}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Connection Error</AlertDialogTitle>
//             <AlertDialogDescription>
//               Device controls are disabled because the connection to the device simulator is lost. 
//               Please wait while we attempt to reconnect.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogAction onClick={() => setShowConnectionAlert(false)}>OK</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Welcome, {session?.user?.name || session?.user?.email}</CardTitle>
//           <CardDescription>You are logged in as {session?.user?.email}</CardDescription>
//         </CardHeader>
//       </Card>
//       <div className="flex items-center gap-2 mb-4">
//         <span>Real-time updates:</span>
//         {isWebSocketConnected ? <Wifi className="text-green-500" /> : <WifiOff className="text-red-500" />}
//       </div>
//       <h1 className="text-2xl font-bold mb-4">Device Dashboard</h1>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableHead>Device Name</TableHead>
//             <TableHead>State</TableHead>
//             <TableHead>Action</TableHead>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {devices.map((device) => (
//             <TableRow key={device.id}>
//               <TableCell>{device.name}</TableCell>
//               <TableCell>{device.state ? "On" : "Off"}</TableCell>
//               <TableCell>
//                 <Switch 
//                   checked={device.state} 
//                   onCheckedChange={() => toggleDevice(device.id, device.state)}
//                   disabled={!isWebSocketConnected}
//                 />
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <Card className="mt-8">
//         <CardHeader>
//           <CardTitle>Device Logs</CardTitle>
//           <CardDescription>Real-time activity of your devices</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {isLoadingLogs ? (
//             <div>Loading logs...</div>
//           ) : (
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableHead>Timestamp</TableHead>
//                   <TableHead>Device</TableHead>
//                   <TableHead>State</TableHead>
//                   <TableHead>User</TableHead>
//                 </TableRow>
//               </TableHead>
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
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { toast } from "../../hooks/use-toast"
import { Wifi, WifiOff } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false)
  const [showConnectionAlert, setShowConnectionAlert] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingToggle, setPendingToggle] = useState<{ id: string; currentState: boolean } | null>(null)

  const { data: logs, isLoading: isLoadingLogs } = useQuery<Log[]>({
    queryKey: ["logs"],
    queryFn: async () => {
      const response = await fetch("/api/logs")
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    },
    refetchInterval: 1000,
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
  }, [])

  const handleToggleConfirm = async () => {
    if (!pendingToggle) return

    try {
      const response = await fetch(`/api/devices/${pendingToggle.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: !pendingToggle.currentState }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to update device")
      }
      
      const updatedDevice = await response.json()
      setDevices((prevDevices) =>
        prevDevices.map((device) => (device.id === pendingToggle.id ? { ...device, state: updatedDevice.state } : device))
      )
      
      queryClient.invalidateQueries({ queryKey: ["logs"] })
      
      if (!isWebSocketConnected) {
        toast({
          title: "Device Updated",
          description: `${updatedDevice.name} is now ${updatedDevice.state ? "ON" : "OFF"}`,
        })
      }

      // Reload the page after successful update
      window.location.reload()
    } catch (error) {
      console.error("Error toggling device:", error)
      toast({
        title: "Error",
        description: "Failed to update device. Please try again.",
        variant: "destructive",
      })
    } finally {
      setShowConfirmDialog(false)
      setPendingToggle(null)
    }
  }

  const toggleDevice = useCallback(
    (id: string, currentState: boolean) => {
      if (!isWebSocketConnected) {
        setShowConnectionAlert(true)
        return
      }

      setPendingToggle({ id, currentState })
      setShowConfirmDialog(true)
    },
    [isWebSocketConnected]
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
      setIsWebSocketConnected(true)
      toast({
        title: "Connected",
        description: "Successfully connected to device simulator.",
      })
    }

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error)
      setIsWebSocketConnected(false)
      toast({
        title: "Connection Error",
        description: "Failed to connect to device simulator. Device updates may be delayed.",
        variant: "destructive",
      })
    }

    wsRef.current.onclose = () => {
      console.log("Disconnected from device simulator")
      setIsWebSocketConnected(false)
      toast({
        title: "Disconnected",
        description: "Lost connection to device simulator. Attempting to reconnect...",
        variant: "destructive",
      })
      setTimeout(connectWebSocket, 5000)
    }
  }, [queryClient])

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

  const getDeviceName = (id: string) => {
    const device = devices.find(d => d.id === id)
    return device?.name || "Device"
  }

  return (
    <div className="container mx-auto p-4">
      <AlertDialog open={showConnectionAlert} onOpenChange={setShowConnectionAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Connection Error</AlertDialogTitle>
            <AlertDialogDescription>
              Device controls are disabled because the connection to the device simulator is lost. 
              Please wait while we attempt to reconnect.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowConnectionAlert(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Device State Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to turn {pendingToggle?.currentState ? "OFF" : "ON"} the device "{getDeviceName(pendingToggle?.id || "")}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowConfirmDialog(false)
              setPendingToggle(null)
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Welcome, {session?.user?.name || session?.user?.email}</CardTitle>
          <CardDescription>You are logged in as {session?.user?.email}</CardDescription>
        </CardHeader>
      </Card>
      <div className="flex items-center gap-2 mb-4">
        <span>Real-time updates:</span>
        {isWebSocketConnected ? <Wifi className="text-green-500" /> : <WifiOff className="text-red-500" />}
      </div>
      <h1 className="text-2xl font-bold mb-4">Device Dashboard</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableHead>Device Name</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHead>
        <TableBody>
          {devices.map((device) => (
            <TableRow key={device.id}>
              <TableCell>{device.name}</TableCell>
              <TableCell>{device.state ? "On" : "Off"}</TableCell>
              <TableCell>
                <Switch 
                  checked={device.state} 
                  onCheckedChange={() => toggleDevice(device.id, device.state)}
                  disabled={!isWebSocketConnected}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Device Logs</CardTitle>
          <CardDescription>Real-time activity of your devices</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingLogs ? (
            <div>Loading logs...</div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHead>
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
