

import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const deviceId = searchParams.get("deviceId")

  try {
    const logs = await prisma.log.findMany({
      where: deviceId ? { deviceId } : undefined,
      orderBy: { timestamp: "desc" },
      take: 100, // Limit to last 100 logs
      include: {
        device: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })
    return NextResponse.json(logs)
  } catch (error) {
    console.error("Error fetching logs:", error)
    return NextResponse.json({ message: "Error fetching logs" }, { status: 500 })
  }
}

