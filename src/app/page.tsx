"use client"
import { useSession } from "next-auth/react"
import LoginPage from "./(auth)/login/page"
import { redirect } from "next/navigation"

export default function HomePage() {
  const { data: session } = useSession()

  if (session) {
    redirect("/dashboard")
  } else {
    redirect("/login")
  }
}
