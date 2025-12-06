"use client"
import { InputText } from "@/components/ui/form/InputText"
import { IUser } from "@/lib/definitions"
import { useState } from "react"

export default function ProfilePage() {
  const [profile, setProfile] = useState<Partial<IUser>>({
    name: "",
    username: "",
  })
  return (
    <div className="bg-white w-full min-h-96 p-3">
      <p>profile page</p>
      <div>
        <InputText
          className="w-full"
          label="Name"
          type="text"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value } as IUser)}
        />

        <InputText
          className="w-full"
          label="Username"
          type="text"
          value={profile.username}
          onChange={(e) => setProfile({ ...profile, username: e.target.value } as IUser)}
        />
      </div>
    </div>
  )
}
