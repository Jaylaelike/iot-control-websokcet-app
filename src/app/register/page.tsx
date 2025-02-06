import { isAuthenticated } from "../../lib/auth"
import { redirect } from "next/navigation"
import { RegisterForm } from "../component/register-form"
// import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function RegisterPage() {
  const isAuth = await isAuthenticated()
  if (isAuth) redirect("/")

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <RegisterForm />
      </div>
    </div>
  )
}

