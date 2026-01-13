"use client"

import { Suspense } from "react"
import Table from "@/components/common/Table"
import { ProjectStoreProvider, useProjectStore } from "@/providers/projectStoreProvider"
import ProjectForm from "@/components/forms/projects/ProjectForm"
import ProjectDelete from "@/components/forms/projects/ProjectDelete"
import { IProject } from "@/lib/definitions"
import { parseDate } from "@/app/utils/dateUtils"
import { useFetch } from "@/hooks/useFetch"

export function ProjectsComponent() {
  const { fetchApi } = useFetch()

  const {
    refreshKey,
    setSelectedProject,
    setIsFormOpen,
    setIsFormDeleteOpen,
  } = useProjectStore((state) => state)

  const openAdd = () => {
    setSelectedProject({
      _id: "",
      projectName: "",
      customerName: "",
      address: "",
      startDate: null,
      endDate: null,
      typeOfWork: "",
      volume: 0,
      volumeUnit: "",
    })
    setIsFormOpen(true)
  }

  const openEdit = async (project: Partial<IProject>) => {
    const data = await fetchApi<IProject>(`/api/projects/${project._id}`)

    if (data) {
      if (data.startDate) {
        data.startDate = data.startDate.split("T")[0]
      }

      if (data.endDate) {
        data.endDate = data.endDate.split("T")[0]
      }
    }

    setSelectedProject(data)
    setIsFormOpen(true)
  }

  const openDelete = (project: Partial<IProject>) => {
    setSelectedProject(project)
    setIsFormDeleteOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Projects</h1>
        <div className="flex gap-2">
          {/* <button
            onClick={() => setIsFilterOpen(true)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
          >
            Filter {isFilterOpen}
          </button> */}
          <button
            onClick={() => openAdd()}
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
        columns={[
          { key: "_id", label: "ID", hiddenKey: "_id" },
          { key: "projectName", label: "Project Name", additionalClass: "px-10" },
          { key: "customerName", label: "Customer Name" },
          {
            key: "startDate",
            label: "Start Date",
            render: (value) => typeof value === "string" && parseDate(value),
          },
          {
            key: "endDate",
            label: "End Date",
            render: (value) => typeof value === "string" && parseDate(value),
          },
        ]}
        renderActions={(project) => (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => openEdit(project)}
              className="px-2 py-1 text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>

            <button
              onClick={() => openDelete(project)}
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

export default function ProjectsPage() {
  return (
    <Suspense>
      <ProjectStoreProvider>
        <ProjectsComponent />
        <ProjectForm />
        <ProjectDelete />
      </ProjectStoreProvider>
    </Suspense>
  )
}
