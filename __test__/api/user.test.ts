import { NextRequest } from "next/server"
import { connectTestDB, clearTestDB, disconnectTestDB, makeRequest } from "../testUtils"
import User from "@/models/User"
import { POST as createUser, GET as listUsers } from "@/app/api/users/route"
import { PUT as updateUser, DELETE as deleteUser } from "@/app/api/users/[id]/route"

const url = `${process.env.NEXTAUTH_URL}/api/users?page=1&limit=10`

beforeAll(async () => {
  await connectTestDB()
})

afterEach(async () => {
  await clearTestDB()
})

afterAll(async () => {
  await disconnectTestDB()
})

describe("User API handlers", () => {
  let userId: string

  it("creates a user", async () => {
    const req = makeRequest({
      url,
      body: {
        username: "rizqy",
        email: "rizqy.dev@gmail.com",
        password: "nurhaqy",
        name: "rizqy",
        userRole: "admin",
        phoneNumber: "08123213",
      },
      method: "POST",
    })
    const res = await createUser(req)
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.name).toBe("rizqy")
    expect(data.email).toBe("rizqy.dev@gmail.com")
    userId = data._id
  })

  it("lists users", async () => {
    await User.create({
      username: "xxx",
      name: "Mouse",
      userRole: "technician",
      passwordHash: "xxdfsfs23213",
      phoneNumber: "028324324",
    })

    const req = makeRequest({ url, method: "GET" })

    const res = await listUsers(req)
    const data = await res.json()

    console.log(data.data)
    expect(res.status).toBe(200)
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.data.length).toBe(1)
  })

  it("updates a user", async () => {
    const created = await User.create({
      username: "xxx",
      name: "Mouse",
      email: "123@gmail.com",
      passwordHash: "Logitech",
      userRole: "technician",
      phoneNumber: "028324324",
    })

    userId = created._id.toString()

    const req = makeRequest({ url, body: { name: "Ujang", email: "234@gmail.com" }, method: "PUT" })
    const res = await updateUser(req, { params: { id: userId } })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.name).toBe("Ujang")
    expect(data.email).toBe("234@gmail.com")
  })

  it("deletes a user", async () => {
    const created = await User.create({
      username: "xxx",
      name: "Mouse",
      userRole: "technician",
      passwordHash: "xxdfsfs23213",
      phoneNumber: "028324324",
    })

    userId = created._id.toString()

    const req = new NextRequest(`${process.env.NEXTAUTH_URL}/api/users/${userId}`, {
      method: "DELETE",
    })
    const res = await deleteUser(req, { params: { id: userId } })
    const data = await res.json()

    expect(res.status).toBe(200)
  })
})
