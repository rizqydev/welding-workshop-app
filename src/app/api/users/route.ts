// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongoose"
import { userSchema } from "@/lib/validations/user"
import User from "@/models/User"

export async function GET(req: NextRequest) {
  await connectDB()

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "10", 10)

  const skip = (page - 1) * limit

  const [users, total] = await Promise.all([
    User.find({}, { password: 0 }).skip(skip).limit(limit).lean(),
    User.countDocuments(),
  ])

  return NextResponse.json({
    users,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  })
}

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()
  const parsed = userSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error!.issues }, { status: 400 })
  }

  const { username, password, name, userRole, email } = parsed.data
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ username, passwordHash, name, userRole, email })
  return NextResponse.json({ _id: user._id, username, name, userRole, email }, { status: 201 })
}
