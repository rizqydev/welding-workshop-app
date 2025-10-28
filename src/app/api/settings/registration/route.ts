import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import Setting from "@/models/Setting"
import dbConnect from "@/lib/mongoose"
import { handleSettingsUpdate } from "@/lib/services/settingService"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  await dbConnect()
  const setting = (await Setting.findOne()) || { registrationEnabled: true }
  return NextResponse.json(setting)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)

  return handleSettingsUpdate(req, session)
}
