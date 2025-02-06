

import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { state } = await request.json()

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const device = await prisma.device.update({
      where: { id: params.id },
      data: { state },
    })

    // Log the state change with user information
    await prisma.log.create({
      data: {
        deviceId: device.id,
        userId: user.id,
        state: device.state,
      },
    })

    return NextResponse.json(device)
  } catch (error) {
    return NextResponse.json({ message: "Error updating device" }, { status: 500 })
  }
}

