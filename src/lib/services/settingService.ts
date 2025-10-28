import { NextRequest, NextResponse } from "next/server"
import Setting from "@/models/Setting"
import dbConnect from "@/lib/mongoose"

export async function handleSettingsUpdate(req: NextRequest, session: any) {
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await dbConnect()
  const { registrationEnabled } = await req.json()
  const updated = await Setting.findOneAndUpdate(
    {},
    { registrationEnabled },
    { upsert: true, new: true },
  )

  return NextResponse.json(updated)
}
