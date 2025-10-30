/**
 * @jest-environment node
 */
import { NextRequest } from "next/server"
import { PUT } from "@/app/api/settings/registration/route"
// import { handleSettingsUpdate } from "@/lib/services/settingService"
import { handleSettingsUpdate } from "@/lib/services/settingService"

// ✅ Mock getServerSession from next-auth
jest.mock("next-auth", () => {
  const originalModule = jest.requireActual("next-auth")

  return {
    __esModule: true,
    ...originalModule,
    getServerSession: jest.fn(),
  }
})

import { getServerSession } from "next-auth"

// ✅ Mock your service function
jest.mock("@/lib/services/settingService", () => ({
  handleSettingsUpdate: jest.fn(
    () => new Response(JSON.stringify({ success: true }), { status: 200 }),
  ),
}))

describe("PUT /api/settings/registration (role-based access)", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("allows admin to update settings", async () => {
    ; (getServerSession as jest.Mock).mockResolvedValue({
      user: { role: "admin", email: "admin@example.com" },
    })

    const req = new NextRequest("http://localhost/api/settings/registration", {
      method: "PUT",
      body: JSON.stringify({ registrationEnabled: false }),
    })

    const res = await PUT(req)

    expect(res.status).toBe(200)
    expect(handleSettingsUpdate).toHaveBeenCalled()
  })

  it("denies access for normal user", async () => {
    ; (getServerSession as jest.Mock).mockResolvedValue({
      user: { role: "user", email: "user@example.com" },
    })

    const req = new NextRequest("http://localhost/api/settings/registration", {
      method: "PUT",
      body: JSON.stringify({ registrationEnabled: true }),
    })

    const res = await PUT(req)
    expect(res.status).toBe(403)
  })

  it("denies access when no session", async () => {
    ; (getServerSession as jest.Mock).mockResolvedValue(null)

    const req = new NextRequest("http://localhost/api/settings/registration", {
      method: "PUT",
      body: JSON.stringify({ registrationEnabled: true }),
    })

    const res = await PUT(req)
    expect(res.status).toBe(403)
  })
})

describe("PUT /api/settings/registration (role-based access)", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("allows admin to update settings", async () => {
    ; (getServerSession as jest.Mock).mockResolvedValue({
      user: { role: "admin", email: "admin@example.com" },
    })

    const req = new NextRequest("http://localhost/api/settings/registration", {
      method: "PUT",
      body: JSON.stringify({ registrationEnabled: false }),
    })

    const res = await PUT(req)
    expect(res.status).toBe(200)
    expect(handleSettingsUpdate).toHaveBeenCalled()
  })

  it("denies normal user", async () => {
    ; (getServerSession as jest.Mock).mockResolvedValue({
      user: { role: "user" },
    })

    const req = new NextRequest("http://localhost/api/settings/registration", {
      method: "PUT",
      body: JSON.stringify({ registrationEnabled: true }),
    })

    const res = await PUT(req)
    expect(res.status).toBe(403)
  })

  it("denies no session", async () => {
    ; (getServerSession as jest.Mock).mockResolvedValue(null)

    const req = new NextRequest("http://localhost/api/settings/registration", {
      method: "PUT",
      body: JSON.stringify({ registrationEnabled: true }),
    })

    const res = await PUT(req)
    expect(res.status).toBe(403)
  })
})
