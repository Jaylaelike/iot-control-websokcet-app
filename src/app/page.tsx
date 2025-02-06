
"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function Home() {
  const { data: session, status } = useSession()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <header className="p-4 bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">IoT Control Center</h1>
          <nav>
            {status === "authenticated" ? (
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            ) : (
              <div className="space-x-2">
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Control Your Devices</CardTitle>
              <CardDescription>Manage all your IoT devices from one central dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Turn lights on and off, adjust thermostats, and more with just a few clicks.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real-Time Updates</CardTitle>
              <CardDescription>See device status changes instantly</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Our WebSocket integration ensures you always have the latest information about your devices.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Secure Access</CardTitle>
              <CardDescription>Your devices, your control</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                With user authentication, you can be sure that only authorized users can access and control your
                devices.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          {status === "authenticated" ? (
            <Link href="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button size="lg">Get Started</Button>
            </Link>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 IoT Control Center. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

