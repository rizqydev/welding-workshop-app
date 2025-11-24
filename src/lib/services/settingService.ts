import { NextRequest, NextResponse } from "next/server"
import Setting from "@/models/Setting"
import dbConnect from "@/lib/mongoose"

export async function handleSettingsUpdate(req: NextRequest, session: { user: { role: string } }) {
  await dbConnect()
  const { registrationEnabled } = await req.json()
  if (session.user.role === "admin") {
    const updated = await Setting.findOneAndUpdate(
      {},
      { registrationEnabled },
      { upsert: true, new: true },
    )

    return NextResponse.json(updated)
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}
