/**
 * Tests for handleRegister() and verifyCredentials()
 */
import { handleRegister, verifyCredentials } from "@/lib/services/authService"
import { connectTestDB, clearTestDB, disconnectTestDB, makeRequest } from "../testUtils"
import User from "@/models/User"
import Setting from "@/models/Setting"

const url = `http://localhost:3000/api/register`

beforeAll(async () => {
  await connectTestDB()
})
afterEach(async () => {
  await clearTestDB()
})
afterAll(async () => {
  await disconnectTestDB()
})

describe("Auth service", () => {
  it("creates a user when registration is enabled", async () => {
    const req = makeRequest({
      url,
      method: "POST",
      body: {
        username: "testuser",
        password: "password123",
        name: "Test User",
        email: "test@gmail.com",
        userRole: "technician",
      },
    })

    const res = await handleRegister(req)
    expect(res.status).toBe(200)

    const json = await res.json()
    expect(json.username).toBe("testuser")
  })

  it("prevents registration when disabled", async () => {
    await Setting.create({ registrationEnabled: false })

    const req = makeRequest({
      url,
      method: "POST",
      body: {
        username: "blocked",
        password: "password123",
        name: "Blocked User",
        userRole: "technician",
      },
    })

    const res = await handleRegister(req)
    expect(res.status).toBe(403)
  })

  it("prevents duplicate usernames", async () => {
    await User.create({
      username: "duplicate",
      passwordHash: "fakehash",
      name: "Dup",
      userRole: "technician",
    })

    const req = makeRequest({
      url,
      method: "POST",
      body: {
        username: "duplicate",
        password: "password123",
        name: "Dup2",
        userRole: "technician",
      },
    })

    const res = await handleRegister(req)
    expect(res.status).toBe(400)
  })

  //   it('verifies credentials correctly', async () => {
  //     const req = makeRequest('http://localhost/api/register', 'POST', {
  //       username: 'loginuser',
  //       password: 'password123',
  //       name: 'Login User',
  //       userRole: 'user',
  //     })

  //     await handleRegister(req)
  //     const valid = await verifyCredentials('loginuser', 'password123')
  //     expect(valid?.username).toBe('loginuser')

  //     const invalid = await verifyCredentials('loginuser', 'wrong')
  //     expect(invalid).toBeNull()
  //   })
})
