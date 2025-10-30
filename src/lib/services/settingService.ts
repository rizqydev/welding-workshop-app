import { NextRequest, NextResponse } from "next/server"
import Setting from "@/models/Setting"
import dbConnect from "@/lib/mongoose"

export async function handleSettingsUpdate(req: NextRequest, session: any) {
  await dbConnect()
  const { registrationEnabled } = await req.json()
  const updated = await Setting.findOneAndUpdate(
    {},
    { registrationEnabled },
    { upsert: true, new: true },
  )

  return NextResponse.json(updated)
}
