import { isAuthenticated } from "../../lib/auth"
import { redirect } from "next/navigation"
import { LoginForm } from "../component/login-form"
// import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function LoginPage() {
  const isAuth = await isAuthenticated()
  if (isAuth) redirect("/")

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <LoginForm />
      </div>
    </div>
  )
}
