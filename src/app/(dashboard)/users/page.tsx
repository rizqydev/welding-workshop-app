'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { ZodError } from 'zod'

interface User {
  _id: string
  username: string
  name: string
  userRole: string
  email: string
}

export default function UsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [errorMessages, setErrorMessages] = useState([])
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    userRole: 'technician',
    email: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then(setUsers)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      const res = await fetch(`/api/users/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const updated = await res.json()
        setUsers(users.map((u) => (u._id === editingId ? updated : u)))
        setEditingId(null)
        setForm({ username: '', password: '', name: '', userRole: 'user', email: '' })
      }
    } else {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const created = await res.json()
        setUsers([created, ...users])
        setForm({ username: '', password: '', name: '', userRole: 'user', email: '' })
      } else {
        const error = await res.json()
        setErrorMessages(error.error)
      }
    }
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
    setUsers(users.filter((u) => u._id !== id))
  }

  const handleEdit = (user: User) => {
    setForm({
      username: user.username,
      password: '',
      name: user.name,
      userRole: user.userRole,
      email: user.email,
    })
    setEditingId(user._id)
  }

  console.log('cuy', session)
  if (!session || session.user.role !== 'admin') {
    console.log('unauthorized', session)
    return <div>Unauthorized</div>
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {errorMessages.length > 0 && (
        <p>
          Error
          {errorMessages.map((val: ZodError, key: number) => (
            <div key={key}>{val?.message}</div>
          ))}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="password"
          name="password"
          placeholder={editingId ? 'New Password (optional)' : 'Password'}
          value={form.password}
          onChange={handleChange}
          className="border p-2 w-full"
          required={!editingId}
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <select
          name="userRole"
          value={form.userRole}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="admin">Admin</option>
          <option value="technician">Technician</option>
        </select>
        <div className="flex space-x-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? 'Update User' : 'Add User'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm({ username: '', password: '', name: '', userRole: 'technician', email: '' })
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="space-y-2">
        {users.map((u) => (
          <li key={u._id} className="border p-3 flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{u.username}</h2>
              <p className="text-sm">Name: {u.name}</p>
              <p className="text-sm">Role: {u.userRole}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(u)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(u._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
