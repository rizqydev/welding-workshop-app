/**
 * Unit test for handleSettingsUpdate()
 */

import { NextRequest } from 'next/server'
import { ReadableStream } from 'node:stream/web'
import { handleSettingsUpdate } from '@/lib/services/settingService'
import Setting from '@/models/Setting'
import { connectTestDB, clearTestDB, disconnectTestDB } from '../testUtils'

// Helper: make NextRequest with body
function makeRequest(url: string, method: string, body: any) {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(JSON.stringify(body)))
      controller.close()
    },
  })
  return new NextRequest(url, {
    method,
    body: stream as any,
    headers: { 'content-type': 'application/json' },
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

describe('handleSettingsUpdate()', () => {
  it('forbids non-admins', async () => {
    const req = makeRequest('http://localhost/api/settings', 'PUT', {
      registrationEnabled: false,
    })

    const res = await handleSettingsUpdate(req, { user: { role: 'user' } })
    expect(res.status).toBe(403)
  })

  it('updates registrationEnabled for admins', async () => {
    const req = makeRequest('http://localhost/api/settings', 'PUT', {
      registrationEnabled: false,
    })

    const res = await handleSettingsUpdate(req, { user: { role: 'admin' } })
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.registrationEnabled).toBe(false)

    const dbSetting = await Setting.findOne()
    expect(dbSetting?.registrationEnabled).toBe(false)
  })
})
