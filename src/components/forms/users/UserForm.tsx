import { ModalForm } from "@/components/common/ModalForm"
import { InputSelect } from "@/components/ui/form/InputSelect"
import { InputText } from "@/components/ui/form/InputText"
import { useUserStore } from "@/providers/userStoreProvider"

import { IUser, UserRole } from "@/lib/definitions"
import { useSession } from "next-auth/react"

export default function UserForm() {
  const { isFormOpen, setIsFormOpen, selectedUser, setSelectedUser, setRefreshKey } = useUserStore(
    (state) => state,
  )
  const { data: session } = useSession()

  const handleSave = async (submitRequestFn: any) => {
    const userToSubmit = selectedUser

    const url = selectedUser?._id ? `/api/users/${selectedUser._id}` : `/api/users`
    const method = selectedUser?._id ? "PUT" : "POST"
    const result = await submitRequestFn(url, method, userToSubmit)

    if (result.success) {
      setRefreshKey()
    }
  }

  return (
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
          onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value } as IUser)}
        />

        {(!selectedUser?._id || selectedUser.email === session?.user.email) && (
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
              status: e.target.value === "true",
            } as IUser)
          }
          options={[
            { label: "Active", value: true },
            { label: "Inactive", value: false },
          ]}
        />
      </div>
    </ModalForm>
  )
}
