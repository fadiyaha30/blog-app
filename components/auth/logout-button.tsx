/*"use client";

import { logout } from "@/actions/logout";


interface LogoutButtonProps {
    children?: React.ReactNode;
};

export const LogoutButton = ({
    children
}: LogoutButtonProps) => {
    const onClick = () => {
        logout();
    }

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}*/

"use client"

import { signOut } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export const LogoutButton = () => {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false, callbackUrl: '/' })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
      setError("Failed to logout. Please try again.")
    }
  }

  return (
    <div>
      <button onClick={handleLogout} className="cursor-pointer">
        Logout
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}