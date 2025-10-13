// app/api/settings/registration/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import Setting from '@/models/Setting'
import authConfig from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/mongoose'

export async function GET() {
  await dbConnect()
  const setting = (await Setting.findOne()) || (await Setting.create({}))
  return NextResponse.json({ registrationEnabled: setting.registrationEnabled })
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authConfig)
  // @ts-ignore
  if (!session || session.user.role !== 'admin') {
    console.log(session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await dbConnect()
  const { registrationEnabled } = await req.json()
  let setting = await Setting.findOne()
  if (!setting) setting = new Setting()
  setting.registrationEnabled = registrationEnabled
  await setting.save()

  return NextResponse.json({ registrationEnabled: setting.registrationEnabled })
}
