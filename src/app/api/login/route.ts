import { auth } from "../../../lib/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  try {
    const key = await auth.useKey("email", email, password)
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    })
    const authRequest = auth.handleRequest({ request, cookies: {} })
    authRequest.setSession(session)
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Set-Cookie": authRequest.cookie.serialize(),
      },
    })
  } catch (e) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 400 })
  }
}

