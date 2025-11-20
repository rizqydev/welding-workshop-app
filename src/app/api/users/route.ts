// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongoose"
import { userSchema } from "@/lib/validations/user"
import User from "@/models/User"

export async function GET(req: Request) {
  await dbConnect()
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "10", 10)
  const skip = (page - 1) * limit
  // Extract filters
  const name = searchParams.get("name") || ""
  const username = searchParams.get("username") || ""
  const email = searchParams.get("email") || ""
  const phoneNumber = searchParams.get("phoneNumber") || ""
  const status = searchParams.get("status") || ""

  // Build dynamic filter
  const filter: any = {}

  if (name) {
    filter.name = { $regex: name, $options: "i" }
  }

  if (username) {
    filter.username = { $regex: username, $options: "i" }
  }

  if (email) {
    filter.email = { $regex: email, $options: "i" }
  }

  if (phoneNumber) {
    filter.phoneNumber = { $regex: phoneNumber, $options: "i" }
  }

  if (status) {
    filter.status = status === "true"
  }

  const [users, total] = await Promise.all([
    User.find(filter, { passwordHash: 0 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ])

  return NextResponse.json({
    data: users,
    totalPages: Math.ceil(total / limit),
    total,
  })
}

export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json()
  const parsed = userSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error!.issues }, { status: 400 })
  }

  const { username, password, name, userRole, email, phoneNumber, status } = parsed.data
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    username,
    passwordHash,
    name,
    userRole,
    email,
    phoneNumber,
    status,
  })
  return NextResponse.json(
    { _id: user._id, username, name, userRole, email, phoneNumber, status: status === "true" },
    { status: 201 },
  )
}
