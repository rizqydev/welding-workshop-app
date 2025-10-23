import User from '@/models/User'
import { connectTestDB, clearTestDB, disconnectTestDB, makeRequest } from '../testUtils'
import { POST as RegisterPost } from '@/app/api/register/route'

import { GET as RegisterSettingGet } from '@/app/api/settings/registration/route'
import Setting from '@/models/Setting'

const port: number = 3000
const url: string = `http://localhost:${port}/api/register`

beforeAll(async () => {
  await connectTestDB()
})

afterEach(async () => {
  await clearTestDB()
})

afterAll(async () => {
  await disconnectTestDB()
})

describe('Auth & Registration APIs', () => {
  it('allows new user registration if enabled', async () => {
    const req = makeRequest({
      body: {
        username: 'testuser',
        password: 'password123',
        name: 'Test User',
        userRole: 'user',
      },
      method: 'POST',
      url,
    })

    const res = await RegisterPost(req)

    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.username).toBe('testuser')

    const dbUser = await User.findOne({ username: 'testuser' })
    expect(dbUser).not.toBeNull()
  })

  it('blocks registration if disabled', async () => {
    await Setting.create({ registrationEnabled: false })

    const req = makeRequest({
      body: {
        username: 'blocked',
        password: 'password123',
        name: 'Blocked User',
        userRole: 'user',
      },
      method: 'POST',
      url,
    })

    const res = await RegisterPost(req)

    expect(res.status).toBe(403)

    const data = await res.json()
    expect(data.error).toBe('Registration disabled')
  })

  it('prevents duplicate usernames', async () => {
    const hash = '$2a$10$abcdefghijklmnopqrstuv' // fake hash

    await User.create({
      username: 'dupuser',
      passwordHash: hash,
      name: 'Dup User',
      userRole: 'user',
    })

    const req = makeRequest({
      body: {
        username: 'dupuser',
        password: 'password123',
        name: 'Dup User',
        userRole: 'user',
      },
      method: 'POST',
      url,
    })

    const res = await RegisterPost(req)

    expect(res.status).toBe(400)

    const data = await res.json()
    expect(data.error).toBe('Username taken')
  })

  it('fetches registration status', async () => {
    const setting = await Setting.create({ registrationEnabled: true })

    const res = await RegisterSettingGet()
    expect(res.status).toBe(200)

    const data = await res.json()

    expect(data.registrationEnabled).toBe(setting.registrationEnabled)
  })
})
