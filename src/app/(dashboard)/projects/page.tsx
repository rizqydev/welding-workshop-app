"use client"

import { Suspense, useEffect, useState } from "react"
import Table from "@/components/common/Table"
import { ConfirmModal } from "@/components/common/ConfirmModal"
import { useToast } from "@/context/ToastContext"
import { ModalForm } from "@/components/common/ModalForm"
import { InputText } from "@/components/ui/form/InputText"
import { InputSelect } from "@/components/ui/form/InputSelect"
import { useRouter, useSearchParams } from "next/navigation"

interface IProject {
  _id?: string
  projectName: string
  customerName: string
  startDate: Date | null
  endDate: Date | null
  // name: string
  // phoneNumber: string
  // projectRole: ProjectRole
  // password?: string
  // status: "true" | "false"
}

export function ProjectsComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedProject, setSelectedProject] = useState<Partial<IProject>>({
    _id: "",
    projectName: "",
    customerName: "",
    startDate: null,
    endDate: null,
    // email: "",
    // phoneNumber: "",
    // projectRole: "technician",
    // password: "",
    // status: "true",
  })

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  // const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)

  // const [filtersDraft, setFiltersDraft] = useState({
  //   name: "",
  //   projectname: "",
  //   email: "",
  //   phoneNumber: "",
  //   status: "",
  // })

  const [appliedFilters, setAppliedFilters] = useState({})

  // const applyFilter = async () => {
  //   // setRefreshKey((k) => k + 1)
  //   const params = new URLSearchParams()

  //   Object.entries(filtersDraft).forEach(([key, value]) => {
  //     if (value && value.trim()) params.set(key, value.trim())
  //   })

  //   params.set("page", "1") // Reset to first page

  //   router.push(`?${params.toString()}`)

  //   setAppliedFilters(filtersDraft)
  //   setIsFilterOpen(false)
  // }

  const { showToast } = useToast()

  const openCreate = () => {
    setSelectedProject({
      _id: "",
      name: "",
      projectname: "",
      phoneNumber: "",
      email: "",
      projectRole: "technician",
      password: "",
      status: "true",
    })
    setIsFormOpen(true)
  }

  // const openEdit = (project: Partial<IProject>) => {
  //   setSelectedProject(project)
  //   setIsFormOpen(true)
  // }

  const openDelete = (project: Partial<IProject>) => {
    setSelectedProject(project)
    setIsDeleteOpen(true)
  }

  const handleSave = async (submitRequestFn: any) => {
    const projectToSubmit = selectedProject

    const url = selectedProject?._id ? `/api/projects/${selectedProject._id}` : `/api/projects`
    const method = selectedProject?._id ? "PUT" : "POST"
    const result = await submitRequestFn(url, method, projectToSubmit)

    if (result.success) {
      setRefreshKey((k) => k + 1)
    }
  }

  const handleDelete = async () => {
    if (!selectedProject?._id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${selectedProject._id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete project")
      setIsDeleteOpen(false)
      setRefreshKey((k) => k + 1)
    } catch (error) {
      console.error("Delete error:", error)
      showToast("Failed to delete project")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const projectname = searchParams.get("username") || ""
    const name = searchParams.get("name") || ""
    const email = searchParams.get("email") || ""
    const phoneNumber = searchParams.get("phoneNumber") || ""
    const status = searchParams.get("status") || ""

    // setFiltersDraft({
    //   // ...filtersDraft,
    //   projectname,
    //   name,
    //   email,
    //   phoneNumber,
    //   status,
    // })

    setAppliedFilters({
      projectname,
      name,
      email,
      phoneNumber,
      status,
    })
    // applyFilter()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Projects</h1>
        <div className="flex gap-2">
          {/* <button
            onClick={() => setIsFilterOpen(true)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
          >
            Filter
          </button> */}
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            + Add Project
          </button>
        </div>
      </div>

      <Table
        key={refreshKey}
        apiEndpoint="/api/projects"
        actionsColumnFixed={true}
        filters={appliedFilters}
        columns={[
          { key: "_id", label: "ID", hiddenKey: "_id" },
          { key: "projectName", label: "Project Name", additionalClass: "px-10" },
          { key: "customerName", label: "Customer Name" },
          // { key: "email", label: "Email" },
          // { key: "phoneNumber", label: "Phone Number" },
          // {
          //   key: "projectRole",
          //   label: "Role",
          //   render: (value) =>
          //     typeof value === "string" ? value.charAt(0).toUpperCase() + value.slice(1) : "-",
          // },
          // {
          //   key: "status",
          //   label: "status",
          //   render: (value) => (value ? "Active" : "Inactive"),
          // },
        ]}
        renderActions={(project) => (
          <div className="flex justify-center gap-2">
            {/* <button
              onClick={() => openEdit(project)}
              className="px-2 py-1 text-blue-600 hover:text-blue-800"
            >
              Edit
            </button> */}
            <button
              onClick={() => openDelete(project)}
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
        title={selectedProject?._id ? "Edit Project" : "Add Project"}
        onSubmit={handleSave}
        submitLabel={selectedProject?._id ? "Update" : "Create"}
      >
        <div className="space-y-3">
          <InputText
            label="Project Name"
            type="text"
            required
            value={selectedProject?.projectName || ""}
            onChange={(e) =>
              setSelectedProject({ ...selectedProject, projectName: e.target.value } as IProject)
            }
          />

          {/* {!selectedProject?._id && (
            <InputText
              label="Password"
              type="password"
              required
              onChange={(e) =>
                setSelectedProject({ ...selectedProject, password: e.target.value } as IProject)
              }
            />
          )} */}

          <InputText
            label="Customer name"
            value={selectedProject?.customerName || ""}
            required
            onChange={(e) =>
              setSelectedProject({ ...selectedProject, customerName: e.target.value } as IProject)
            }
          />

          <InputText
            label="Start Date"
            value={selectedProject?.startDate}
            type="date"
            onChange={(e) =>
              setSelectedProject({ ...selectedProject, startDate: e.target.value } as IProject)
            }
          />

          <InputText
            label="End Date"
            value={selectedProject?.endDate}
            type="date"
            onChange={(e) =>
              setSelectedProject({ ...selectedProject, endDate: e.target.value } as IProject)
            }
          />
          {/* <InputText
            label="Phone Number"
            value={selectedProject?.phoneNumber || ""}
            onChange={(e) =>
              setSelectedProject({ ...selectedProject, phoneNumber: e.target.value } as IProject)
            }
          />

          <InputText
            label="Email"
            type="email"
            value={selectedProject?.email || ""}
            onChange={(e) => setSelectedProject({ ...selectedProject, email: e.target.value } as IProject)}
          />

          <InputSelect
            label="Role"
            value={selectedProject?.projectRole || "technician"}
            onChange={(e) =>
              setSelectedProject({
                ...selectedProject,
                projectRole: e.target.value as ProjectRole,
              } as IProject)
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
            value={selectedProject.status}
            onChange={(e) =>
              setSelectedProject({
                ...selectedProject,
                status: e.target.value,
              } as IProject)
            }
            options={[
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
          /> */}
        </div>
      </ModalForm>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${selectedProject?.projectName}"?`}
        isLoading={loading}
      />

      {/* Modal Filter */}
      {/* <ModalForm
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filter Projects"
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
            label="Projectname"
            value={filtersDraft.projectname}
            onChange={(e) => setFiltersDraft({ ...filtersDraft, projectname: e.target.value })}
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
      </ModalForm> */}
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <Suspense>
      <ProjectsComponent />
    </Suspense>
  )
}
