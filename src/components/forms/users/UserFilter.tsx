"use client"
import { ModalForm } from "@/components/common/ModalForm"
import { InputSelect } from "@/components/ui/form/InputSelect"
import { InputText } from "@/components/ui/form/InputText"
import { useUserStore } from "@/providers/userStoreProvider"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function FilterUser() {
  const searchParams = useSearchParams()
  const { isFilterOpen, filter, setFilter, setIsFilterOpen } = useUserStore((state) => state)
  const router = useRouter()
  const applyFilter = async () => {
    const params = new URLSearchParams()

    // pagination
    params.set("page", "1")
    params.set("limit", "10")

    // apply filters
    if (Object.entries(filter).length > 0) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value && value !== "All") params.set(key, value)
      })
    }

    router.push(`?${params.toString()}`)
    setIsFilterOpen(false)
  }

  useEffect(() => {
    const username = searchParams.get("username") || ""
    const name = searchParams.get("name") || ""
    const email = searchParams.get("email") || ""
    const phoneNumber = searchParams.get("phoneNumber") || ""
    const statusRaw = searchParams.get("status") || null

    setFilter({
      username,
      name,
      email,
      phoneNumber,
      status: statusRaw !== null || statusRaw !== "null" ? statusRaw === "true" : null,
    })
  }, [])

  return (
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
          value={filter.name}
          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
        />

        <InputText
          label="Username"
          value={filter.username}
          onChange={(e) => setFilter({ ...filter, username: e.target.value })}
        />

        <InputText
          label="Email"
          value={filter.email}
          onChange={(e) => setFilter({ ...filter, email: e.target.value })}
        />

        <InputText
          label="Phone Number"
          value={filter.phoneNumber}
          onChange={(e) => setFilter({ ...filter, phoneNumber: e.target.value })}
        />

        <InputSelect
          label="Status"
          value={filter.status}
          onChange={(e) =>
            setFilter({
              ...filter,
              // @ts-ignore
              status: e.target.value,
            })
          }
          options={[
            { label: "All", value: null },
            { label: "Active", value: true },
            { label: "Inactive", value: false },
          ]}
        />
      </div>
    </ModalForm>
  )
}
