import { ConfirmModal } from "@/components/common/ConfirmModal"
import { useToast } from "@/context/ToastContext"
import { useProjectStore } from "@/providers/projectStoreProvider"
import { useState } from "react"

{
  /* Delete Confirmation Modal */
}
export default function ProjectDelete() {
  const { isFormDeleteOpen, setIsFormDeleteOpen, selectedProject, setRefreshKey } = useProjectStore(
    (state) => state,
  )

  const { showToast } = useToast()

  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!selectedProject?._id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${selectedProject._id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete project")
      setIsFormDeleteOpen(false)
      setRefreshKey()
    } catch (error) {
      console.error("Delete error:", error)
      showToast("Failed to delete project")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ConfirmModal
      isOpen={isFormDeleteOpen}
      onClose={() => setIsFormDeleteOpen(false)}
      onConfirm={handleDelete}
      title="Delete Project"
      message={`Are you sure you want to delete "${selectedProject?.projectName}"?`}
      isLoading={loading}
    />
  )
}
