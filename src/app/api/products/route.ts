import dbConnect from "@/lib/mongoose"
import { productSchema } from "@/lib/validations/product"
import Product from "@/models/Product"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  await dbConnect()
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "10", 10)
  const skip = (page - 1) * limit

  const [products, total] = await Promise.all([
    Product.find().skip(skip).limit(limit),
    Product.countDocuments(),
  ])

  return NextResponse.json({
    data: products,
    totalPages: Math.ceil(total / limit),
    total,
  })
}

export async function POST(request: Request) {
  await dbConnect()
  const body = await request.json()

  const parsed = productSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const newProduct = new Product(parsed.data)
  await newProduct.save()

  return NextResponse.json(newProduct, { status: 201 })
}
