import { auth } from "../../../lib/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const authRequest = auth.handleRequest({ request, cookies: {} })
  const session = await authRequest.validate()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await auth.invalidateSession(session.sessionId)

  authRequest.setSession(null)

  return new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Set-Cookie": authRequest.cookie.serialize(),
    },
  })
}
