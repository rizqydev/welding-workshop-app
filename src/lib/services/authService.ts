import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import User, { IUser } from "@/models/User"
import Setting from "@/models/Setting"
import { userRegisterSchema } from "@/lib/validations/user"

export async function handleRegister(req: Request) {
  await dbConnect()

  const setting = await Setting.findOne()
  const registrationEnabled = setting?.registrationEnabled ?? true
  if (!registrationEnabled) {
    return NextResponse.json({ error: "Registration disabled" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = userRegisterSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { username, password, name, userRole, email, phoneNumber } = parsed.data
  const existing = await User.findOne({ username })
  if (existing) {
    return NextResponse.json({ error: "Username taken" }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const newUser = await User.create({
    username,
    passwordHash,
    name,
    email,
    userRole,
    status: true,
    phoneNumber,
  })

  return NextResponse.json(
    { username: newUser.username, name: newUser.name, userRole: newUser.userRole },
    { status: 200 },
  )
}

export async function verifyCredentials(username: string, password: string) {
  await dbConnect()
  const user = await User.findOne({ username })
  if (!user) return null

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return null

  return user
}

export async function verifyUserByEmail(email: string | undefined) {
  if (email === undefined) return null

  await dbConnect()
  const user = await User.findOne({ email })
  if (!user) return null

  return user
}

export async function registerByGoogleAuth(
  email: string | undefined,
  name: string | undefined,
): Promise<IUser | null> {
  if (!email || !name) return null

  await dbConnect()
  const setting: { registrationEnabled: boolean } = (await Setting.findOne()) || {
    registrationEnabled: true,
  }

  if (setting.registrationEnabled) {
    const newUser = await User.create({
      username: email,
      passwordHash: await bcrypt.hash(Date.now().toString(), 10),
      name,
      email,
      userRole: "technician",
    })

    return newUser
  }

  return null
}
