// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'
import { userUpdateSchema } from '@/lib/validations/user'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB()
  const user = await User.findById(params.id).select('-passwordHash')
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(user)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB()
  const body = await req.json()
  const parsed = userUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 })
  }

  const update: any = { ...parsed.data }
  if (update.password) {
    update.passwordHash = await bcrypt.hash(update.password, 10)
    delete update.password
  }

  const user = await User.findByIdAndUpdate(params.id, update, { new: true }).select(
    '-passwordHash',
  )
  return NextResponse.json(user)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB()
  await User.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}
