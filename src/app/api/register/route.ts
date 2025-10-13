// app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import User from '@/models/User'
import Setting from '@/models/Setting'
import dbConnect from '@/lib/mongoose'

export async function POST(req: NextRequest) {
  await dbConnect()
  const { username, password, name, userRole } = await req.json()

  const setting = (await Setting.findOne()) || (await Setting.create({}))
  if (!setting.registrationEnabled) {
    return NextResponse.json({ error: 'Registration disabled' }, { status: 403 })
  }

  const existing = await User.findOne({ username })
  if (existing) {
    return NextResponse.json({ error: 'Username taken' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({
    username,
    passwordHash: hashed,
    name,
    userRole: userRole || 'user',
  })

  return NextResponse.json({
    id: user._id,
    username: user.username,
    name: user.name,
    role: user.userRole,
  })
}
