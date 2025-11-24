// app/settings/page.tsx
"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    fetch("/api/settings/registration")
      .then((res) => res.json())
      .then((data) => setEnabled(data.registrationEnabled))
  }, [])

  // @ts-ignore
  if (!session || session.user.role !== "admin") {
    return <div>Unauthorized</div>
  }

  const toggle = async () => {
    const res = await fetch("/api/settings/registration", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationEnabled: !enabled }),
    })
    const data = await res.json()
    setEnabled(data.registrationEnabled)
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Settings</h1>
      <div className="mt-4">
        <p>
          Registration is currently <strong>{enabled ? "Enabled" : "Disabled"}</strong>
        </p>
        <button onClick={toggle} className="mt-2 rounded bg-blue-600 px-4 py-2 text-white">
          Toggle
        </button>
      </div>
    </div>
  )
}
