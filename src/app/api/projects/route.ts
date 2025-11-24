// app/api/projects/route.ts
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongoose"
import { projectSchema } from "@/lib/validations/project"
import Project from "@/models/Project"

export async function GET(req: Request) {
  await dbConnect()
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "10", 10)
  const skip = (page - 1) * limit

  // Extract filters
  const name = searchParams.get("name") || ""
  const projectname = searchParams.get("projectname") || ""
  const email = searchParams.get("email") || ""
  const phoneNumber = searchParams.get("phoneNumber") || ""
  const status = searchParams.get("status") || ""

  // Build dynamic filter
  const filter: any = {}

  if (name) {
    filter.name = { $regex: name, $options: "i" }
  }

  if (projectname) {
    filter.projectname = { $regex: projectname, $options: "i" }
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

  const [projects, total] = await Promise.all([
    Project.find(filter, { passwordHash: 0 }).skip(skip).limit(limit),
    Project.countDocuments(filter),
  ])

  return NextResponse.json({
    data: projects,
    totalPages: Math.ceil(total / limit),
    total,
  })
}

export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json()
  //   console.log("body", body)
  const sd = body.startDate ? new Date(body.startDate) : null
  const ed = body.endDate ? new Date(body.endDate) : null

  const parsed = projectSchema.safeParse({
    ...body,
    startDate: sd,
    endDate: ed,
  })
  //   console.log("parsed", parsed)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error!.issues }, { status: 400 })
  }

  const { projectName, customerName, address, startDate, endDate, typeOfWork, volume, volumeUnit } =
    parsed.data
  const project = await Project.create({
    projectName,
    customerName,
    address,
    startDate,
    endDate,
    typeOfWork,
    volume,
    volumeUnit,
  })
  return NextResponse.json(
    {
      _id: project._id,
      projectName,
      customerName,
      address,
      startDate,
      endDate,
      typeOfWork,
      volume,
      volumeUnit,
    },
    { status: 201 },
  )
}
