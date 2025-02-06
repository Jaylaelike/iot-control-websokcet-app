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

  try {
    const devices = await prisma.device.findMany({
      where: {
        users: {
          some: {
            email: session.user?.email,
          },
        },
      },
    })
    return NextResponse.json(devices)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching devices" }, { status: 500 })
  }
}
