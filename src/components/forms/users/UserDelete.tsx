import { ConfirmModal } from "@/components/common/ConfirmModal"
import { useToast } from "@/context/ToastContext"
import { useUserStore } from "@/providers/userStoreProvider"
import { useState } from "react"

{
  /* Delete Confirmation Modal */
}
export default function UserDelete() {
  const { isFormDeleteOpen, setIsFormDeleteOpen, selectedUser, setRefreshKey } = useUserStore(
    (state) => state,
  )

  const { showToast } = useToast()

  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!selectedUser?._id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${selectedUser._id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete user")
      setIsFormDeleteOpen(false)
      setRefreshKey()
    } catch (error) {
      console.error("Delete error:", error)
      showToast("Failed to delete user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ConfirmModal
      isOpen={isFormDeleteOpen}
      onClose={() => setIsFormDeleteOpen(false)}
      onConfirm={handleDelete}
      title="Delete User"
      message={`Are you sure you want to delete "${selectedUser?.name}"?`}
      isLoading={loading}
    />
  )
}
