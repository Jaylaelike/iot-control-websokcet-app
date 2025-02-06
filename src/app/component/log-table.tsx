"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Log {
  id: string
  deviceId: string
  name: string
  state: boolean
  timestamp: string
}

export function LogTable(
  {userId, refetchState} : {userId: string, refetchState: boolean}
) {
  const [logs, setLogs] = useState<Log[]>([])

  useEffect(() => {
    // Fetch logs from the API
    fetch(`http://localhost:3000/api/logs/${userId}`)
      .then((res) => res.json())
      .then(setLogs)
  }, [userId, refetchState])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Device Name</TableHead>
          <TableHead>State</TableHead>
          <TableHead>Timestamp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>{log.deviceId}</TableCell>
            <TableCell>{log.state ? "On" : "Off"}</TableCell>
            <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

