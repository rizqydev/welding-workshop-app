// app/api/projects/[id]/route.ts
import { NextResponse } from "next/server"
// import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongoose"
import Project from "@/models/Project"
import { projectUpdateSchema } from "@/lib/validations/project"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()
  const { id } = await params
  const project = await Project.findById(id)

  console.log("project", project)

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(project)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = projectUpdateSchema.safeParse(body)
    console.log("data", parsed.data)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 })
    }

    const update: any = { ...parsed.data }
    console.log("update", update)

    const project = await Project.findByIdAndUpdate(id, update, { new: true })

    return NextResponse.json(project)
  } catch (err) {
    // @ts-ignore
    if (err.codeName === "DuplicateKey") {
      return NextResponse.json(
        // @ts-ignore
        { error: Object.keys(err.keyValue)[0] + " is duplicate" },
        { status: 409 },
      )
    }
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB()
  await Project.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}
