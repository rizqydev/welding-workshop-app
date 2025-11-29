"use client"

import { Suspense } from "react"
import Table from "@/components/common/Table"
import { UserStoreProvider, useUserStore } from "@/providers/userStoreProvider"
import UserFilter from "@/components/forms/users/UserFilter"
import UserDelete from "@/components/forms/users/UserDelete"
import UserForm from "@/components/forms/users/UserForm"

import { IUser } from "@/lib/definitions"

export function UsersComponent() {
  const {
    refreshKey,
    setSelectedUser,
    setIsFilterOpen,
    isFilterOpen,
    setIsFormOpen,
    setIsFormDeleteOpen,
  } = useUserStore((state) => state)

  const openEdit = (user: Partial<IUser>) => {
    setSelectedUser(user)
    setIsFormOpen(true)
  }

  const openDelete = (user: Partial<IUser>) => {
    setSelectedUser(user)
    setIsFormDeleteOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
          >
            Filter {isFilterOpen}
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
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
    </div>
  )
}

export default function UsersPage() {
  return (
    <Suspense>
      <UserStoreProvider>
        <UsersComponent />
        <UserForm />
        <UserFilter />
        <UserDelete />
      </UserStoreProvider>
    </Suspense>
  )
}
