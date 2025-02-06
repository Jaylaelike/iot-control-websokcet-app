//create route for logs by userId [userId]




import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const devices = await prisma.log.findMany({
    where: { userId },
  });
  return NextResponse.json(devices);
}


export async function POST(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const { deviceId, state } = await request.json();
  const log = await prisma.log.create({
    data: {
      deviceId,
      userId,
      state,
    },
  });
  return NextResponse.json(log);
}