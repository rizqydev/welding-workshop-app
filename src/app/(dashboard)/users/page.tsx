"use client"

import { Suspense, useState } from "react"
import Table from "@/components/common/Table"
import { ConfirmModal } from "@/components/common/ConfirmModal"
import { useToast } from "@/context/ToastContext"
import { ModalForm } from "@/components/common/ModalForm"
import { InputText } from "@/components/ui/form/InputText"
import { InputSelect } from "@/components/ui/form/InputSelect"

type UserRole = "admin" | "technician" | "manager"

interface IUser {
  _id?: string
  username: string
  email: string
  name: string
  userRole: UserRole
  password?: string
}

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<Partial<IUser>>({
    _id: "",
    name: "",
    username: "",
    email: "",
    userRole: "technician",
    password: "",
  })

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const { showToast } = useToast()

  const openCreate = () => {
    setSelectedUser({
      _id: "",
      name: "",
      username: "",
      email: "",
      userRole: "technician",
      password: "",
    })
    setIsFormOpen(true)
  }

  const openEdit = (user: Partial<IUser>) => {
    setSelectedUser(user)
    setIsFormOpen(true)
  }

  const openDelete = (user: Partial<IUser>) => {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  const handleSave = async (submitRequestFn: any) => {
    const userToSubmit = selectedUser

    const url = selectedUser?._id ? `/api/users/${selectedUser._id}` : `/api/users`
    const method = selectedUser?._id ? "PUT" : "POST"
    const result = await submitRequestFn(url, method, userToSubmit)

    if (result.success) {
      setRefreshKey((k) => k + 1)
    }
  }

  const handleDelete = async () => {
    if (!selectedUser?._id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${selectedUser._id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete user")
      setIsDeleteOpen(false)
      setRefreshKey((k) => k + 1)
    } catch (error) {
      console.error("Delete error:", error)
      showToast("Failed to delete user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add User
        </button>
      </div>

      <Suspense fallback={<div>Loading</div>}>
        <Table
          key={refreshKey}
          apiEndpoint="/api/users"
          columns={[
            { key: "name", label: "Name" },
            { key: "username", label: "Username" },
            {
              key: "userRole",
              label: "Role",
              render: (value) =>
                typeof value === "string" ? value.charAt(0).toUpperCase() + value.slice(1) : "-",
            },
          ]}
          renderActions={(user) => (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => openEdit(user)}
                className="px-2 py-1 text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => openDelete(user)}
                className="px-2 py-1 text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          )}
        />
      </Suspense>

      {/* Add / Edit Modal */}
      <ModalForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedUser?._id ? "Edit User" : "Add User"}
        onSubmit={handleSave}
        submitLabel={selectedUser?._id ? "Update" : "Create"}
      >
        <div className="space-y-3">
          <InputText
            label="Username"
            type="text"
            value={selectedUser?.username || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, username: e.target.value } as IUser)
            }
          />

          {!selectedUser?._id && (
            <InputText
              label="Password"
              type="password"
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, password: e.target.value } as IUser)
              }
            />
          )}

          <InputText
            label="Name"
            value={selectedUser?.name || ""}
            onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value } as IUser)}
          />

          <InputText
            label="Email"
            type="email"
            value={selectedUser?.email || ""}
            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value } as IUser)}
          />

          <InputSelect
            label="Role"
            value={selectedUser?.userRole || "technician"}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                userRole: e.target.value as UserRole,
              } as IUser)
            }
            options={[
              { label: "Technician", value: "technician" },
              { label: "Manager", value: "manager" },
              { label: "Admin", value: "admin" },
            ]}
          />
        </div>
      </ModalForm>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUser?.name}"?`}
        isLoading={loading}
      />
    </div>
  )
}
