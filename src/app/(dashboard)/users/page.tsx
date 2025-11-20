"use client"

import { Suspense, useEffect, useState } from "react"
import Table from "@/components/common/Table"
import { ConfirmModal } from "@/components/common/ConfirmModal"
import { useToast } from "@/context/ToastContext"
import { ModalForm } from "@/components/common/ModalForm"
import { InputText } from "@/components/ui/form/InputText"
import { InputSelect } from "@/components/ui/form/InputSelect"
import { useRouter, useSearchParams } from "next/navigation"

type UserRole = "admin" | "technician" | "manager" | "warehouse"

interface IUser {
  _id?: string
  username: string
  email: string
  name: string
  phoneNumber: string
  userRole: UserRole
  password?: string
  status: "true" | "false"
}

export default function UsersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedUser, setSelectedUser] = useState<Partial<IUser>>({
    _id: "",
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
    userRole: "technician",
    password: "",
    status: "true",
  })

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)

  const [filtersDraft, setFiltersDraft] = useState({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
    status: "",
  })

  const [appliedFilters, setAppliedFilters] = useState({})

  const applyFilter = async () => {
    // setRefreshKey((k) => k + 1)
    const params = new URLSearchParams()

    Object.entries(filtersDraft).forEach(([key, value]) => {
      if (value && value.trim()) params.set(key, value.trim())
    })

    params.set("page", "1") // Reset to first page

    router.push(`?${params.toString()}`)

    setAppliedFilters(filtersDraft)
    setIsFilterOpen(false)
  }

  const { showToast } = useToast()

  const openCreate = () => {
    setSelectedUser({
      _id: "",
      name: "",
      username: "",
      phoneNumber: "",
      email: "",
      userRole: "technician",
      password: "",
      status: "true",
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

  useEffect(() => {
    const username = searchParams.get("username") || ""
    const name = searchParams.get("name") || ""
    const email = searchParams.get("email") || ""
    const phoneNumber = searchParams.get("phoneNumber") || ""
    const status = searchParams.get("status") || ""

    setFiltersDraft({
      // ...filtersDraft,
      username,
      name,
      email,
      phoneNumber,
      status,
    })

    setAppliedFilters({
      username,
      name,
      email,
      phoneNumber,
      status,
    })
    // applyFilter()
  }, [])

  return (
    <Suspense fallback={<div>Loading..</div>}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
            >
              Filter
            </button>
            <button
              onClick={openCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              + Add User
            </button>
          </div>
        </div>

        <Table
          key={refreshKey}
          apiEndpoint="/api/users"
          actionsColumnFixed={true}
          filters={appliedFilters}
          columns={[
            { key: "_id", label: "ID", hiddenKey: "_id" },
            { key: "name", label: "Name" },
            { key: "username", label: "Username", additionalClass: "px-10" },
            { key: "email", label: "Email" },
            { key: "phoneNumber", label: "Phone Number" },
            {
              key: "userRole",
              label: "Role",
              render: (value) =>
                typeof value === "string" ? value.charAt(0).toUpperCase() + value.slice(1) : "-",
            },
            {
              key: "status",
              label: "status",
              render: (value) => (value ? "Active" : "Inactive"),
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
              required
              value={selectedUser?.username || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, username: e.target.value } as IUser)
              }
            />

            {!selectedUser?._id && (
              <InputText
                label="Password"
                type="password"
                required
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, password: e.target.value } as IUser)
                }
              />
            )}

            <InputText
              label="Name"
              value={selectedUser?.name || ""}
              required
              onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value } as IUser)}
            />

            <InputText
              label="Phone Number"
              value={selectedUser?.phoneNumber || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, phoneNumber: e.target.value } as IUser)
              }
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
                { label: "Warehouse", value: "warehouse" },
                { label: "Finishing", value: "finishing" },
                { label: "Helper", value: "helper" },
              ]}
            />

            <InputSelect
              label="Status"
              value={selectedUser.status}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  status: e.target.value,
                } as IUser)
              }
              options={[
                { label: "Active", value: "true" },
                { label: "Inactive", value: "false" },
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

        <ModalForm
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          title="Filter Users"
          submitLabel="Search"
          onSubmit={applyFilter}
        >
          <div className="space-y-3">
            <InputText
              label="Name"
              value={filtersDraft.name}
              onChange={(e) => setFiltersDraft({ ...filtersDraft, name: e.target.value })}
            />

            <InputText
              label="Username"
              value={filtersDraft.username}
              onChange={(e) => setFiltersDraft({ ...filtersDraft, username: e.target.value })}
            />

            <InputText
              label="Email"
              value={filtersDraft.email}
              onChange={(e) => setFiltersDraft({ ...filtersDraft, email: e.target.value })}
            />

            <InputText
              label="Phone Number"
              value={filtersDraft.phoneNumber}
              onChange={(e) => setFiltersDraft({ ...filtersDraft, phoneNumber: e.target.value })}
            />

            <InputSelect
              label="Status"
              value={filtersDraft.status}
              onChange={(e) =>
                setFiltersDraft({
                  ...filtersDraft,
                  status: e.target.value,
                })
              }
              options={[
                { label: "All", value: "" },
                { label: "Active", value: "true" },
                { label: "Inactive", value: "false" },
              ]}
            />
          </div>
        </ModalForm>
      </div>
    </Suspense>
  )
}
