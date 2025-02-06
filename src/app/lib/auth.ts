import { getServerSession } from "next-auth/next"
import { authOptions } from "../../app/api/auth/[...nextauth]/route"
import type { Session, DefaultSession } from "next-auth"

// Extend the built-in session type
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

// Function to get the current session
export async function getCurrentSession() {
  const session = await getServerSession(authOptions)
  return session
}

// Function to get the current user
export async function getCurrentUser() {
  const session = await getCurrentSession()
  return session?.user
}

// Function to check if a user is authenticated
export async function isAuthenticated() {
  const session = await getCurrentSession()
  return !!session
}

// Export types
export type { Session }

