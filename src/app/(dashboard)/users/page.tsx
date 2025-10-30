"use client"

import { useEffect, useState } from "react"
import { useApiForm } from "@/hooks/useApiForm"
import Table from "@/components/common/Table"
import { ModalForm } from "@/components/common/ModalForm"
import { ConfirmModal } from "@/components/common/ConfirmModal"

type UserRole = "admin" | "technician"

interface IUser {
  _id?: string
  username: string
  email: string
  name: string
  userRole: UserRole
  password?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<IUser[]>([])
  const [isLoadingPage, setLoadingPage] = useState(true)
  const [isFormOpen, setFormOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 5

  const { submitRequest, isSubmitting } = useApiForm({
    onSuccess: () => {
      fetchUsers()
      setFormOpen(false)
      setDeleteOpen(false)
    },
  })

  async function fetchUsers() {
    setLoadingPage(true)
    const res = await fetch(`/api/users?page=${page}&limit=${pageSize}`)
    const data = await res.json()

    setLoadingPage(false)
    setUsers(data.users || [])
    setTotalPages(data.totalPages || 1)
  }

  useEffect(() => {
    fetchUsers()
  }, [page])

  const openForm = (user?: IUser) => {
    setSelectedUser(user || null)
    setFormOpen(true)
  }

  const openDelete = (user: IUser) => {
    setSelectedUser(user)
    setDeleteOpen(true)
  }

  const handleFormSubmit = async (submitRequestFn: any) => {
    const userToSubmit = selectedUser
    if (userToSubmit !== null && !userToSubmit?.userRole) {
      userToSubmit.userRole = "technician"
    }
    const url = selectedUser?._id ? `/api/users/${selectedUser._id}` : `/api/users`
    const method = selectedUser?._id ? "PUT" : "POST"
    await submitRequestFn(url, method, userToSubmit)
  }

  const handleDelete = async () => {
    if (!selectedUser?._id) return
    await submitRequest(`/api/users/${selectedUser._id}`, "DELETE")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
        <button
          onClick={() => openForm()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add User
        </button>
      </div>

      <Table
        columns={[
          { key: "username", header: "Username" },
          { key: "email", header: "Email" },
          { key: "name", header: "Name" },
          { key: "userRole", header: "Role" },
        ]}
        data={users}
        loading={isLoadingPage}
        actions={(row) => (
          <div className="flex gap-2">
            <button onClick={() => openForm(row)} className="text-blue-600 hover:underline">
              Edit
            </button>
            <button onClick={() => openDelete(row)} className="text-red-600 hover:underline">
              Delete
            </button>
          </div>
        )}
      />

      {/* Pagination */}
      <div className="flex justify-end items-center gap-3 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-100 rounded-md disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-100 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Add / Edit Modal */}
      <ModalForm
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        title={selectedUser?._id ? "Edit User" : "Add User"}
        onSubmit={handleFormSubmit}
        submitLabel={selectedUser?._id ? "Update" : "Create"}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={selectedUser?.username || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, username: e.target.value } as IUser)
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          {!selectedUser?._id && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, password: e.target.value } as IUser)
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={selectedUser?.email || ""}
              onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value } as IUser)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={selectedUser?.name || ""}
              onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value } as IUser)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={selectedUser?.userRole || "technician"}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  userRole: e.target.value as UserRole,
                } as IUser)
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="technician" selected>
                Teknisi
              </option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </ModalForm>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.username}?`}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </div>
  )
}
