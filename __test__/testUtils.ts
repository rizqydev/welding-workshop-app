import mongoose from "mongoose"
import { NextRequest } from "next/server"

const TEST_DB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/test_db"

export async function connectTestDB() {
  await mongoose.connect(TEST_DB_URI, {
    dbName: "test_db",
  })
}

export async function clearTestDB() {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    // @ts-ignore
    await collections[key].deleteMany({})
  }
}

export async function disconnectTestDB() {
  await mongoose.disconnect()
}

// helper to build a NextRequest
export function makeRequest({
  body,
  method,
  url,
}: {
  body?: any
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  url: string
}) {
  // jest.mock("next-auth", () => ({
  //   getServerSession: jest.fn().mockResolvedValue({
  //     user: { role: "admin" },
  //   }),
  // }))
  return new NextRequest(url, {
    method,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
}
