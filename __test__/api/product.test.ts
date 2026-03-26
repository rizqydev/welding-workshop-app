import { NextRequest } from "next/server"
import { connectTestDB, clearTestDB, disconnectTestDB } from "../testUtils"
import Product from "@/models/Product"
import { POST as createProduct, GET as listProducts } from "@/app/api/products/route"
import { PUT as updateProduct, DELETE as deleteProduct } from "@/app/api/products/[id]/route"

// helper to build a NextRequest
function makeRequest(body: any, method: string = "POST") {
  return new NextRequest(`${process.env.NEXTAUTH_URL}/api/products`, {
    method,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
}

beforeAll(async () => {
  await connectTestDB()
})

afterEach(async () => {
  await clearTestDB()
})

afterAll(async () => {
  await disconnectTestDB()
})

describe("Product API handlers", () => {
  let productId: string

  it("creates a product", async () => {
    const req = makeRequest({ name: "Laptop", brand: "Dell", qty: 10, information: "Powerful" })
    const res = await createProduct(req)
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.name).toBe("Laptop")
    productId = data._id
  })

  it("lists products", async () => {
    await Product.create({ name: "Phone", brand: "Samsung", qty: 5 })

    // @ts-ignore
    const res = await listProducts({
      url: `${process.env.NEXTAUTH_URL}/api/products?page=1&limit=10`,
    })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.data.length).toBe(1)
  })

  it("updates a product", async () => {
    const created = await Product.create({ name: "Mouse", brand: "Logitech", qty: 2 })
    productId = created._id.toString()

    const req = makeRequest({ qty: 20 }, "PUT")
    const res = await updateProduct(req, { params: { id: productId } })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.qty).toBe(20)
  })

  it("deletes a product", async () => {
    const created = await Product.create({ name: "Keyboard", brand: "HP", qty: 1 })
    productId = created._id.toString()

    const req = new NextRequest(`${process.env.NEXTAUTH_URL}/api/products/${productId}`, {
      method: "DELETE",
    })
    const res = await deleteProduct(req, { params: { id: productId } })
    const data = await res.json()

    expect(res.status).toBe(200)
  })
})
