import { ModalForm } from "@/components/common/ModalForm"
import { InputText } from "@/components/ui/form/InputText"
import { useProjectStore } from "@/providers/projectStoreProvider"

import { IProject } from "@/lib/definitions"
import { InputSelect } from "@/components/ui/form/InputSelect"
import { InputTextArea } from "@/components/ui/form/InputTextArea"

export default function ProjectForm() {
  const { isFormOpen, setIsFormOpen, selectedProject, setSelectedProject, setRefreshKey } =
    useProjectStore((state) => state)

  const handleSave = async (submitRequestFn: any) => {
    const projectToSubmit = selectedProject

    const url = selectedProject?._id ? `/api/projects/${selectedProject._id}` : `/api/projects`
    const method = selectedProject?._id ? "PUT" : "POST"
    const result = await submitRequestFn(url, method, projectToSubmit)

    if (result.success) {
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
        isComplete: false,
      })
      setRefreshKey()
    }
  }

  return (
    <ModalForm
      isOpen={isFormOpen}
      onClose={() => setIsFormOpen(false)}
      title={selectedProject?._id ? "Edit Project" : "Add Project"}
      size="w-[800px]"
      onSubmit={handleSave}
      submitLabel={selectedProject?._id ? "Update" : "Create"}
    >
      <div className="space-y-3">
        <div className="flex gap-2">
          <InputText
            className="w-full"
            label="Project Name"
            type="text"
            required
            value={selectedProject?.projectName || ""}
            onChange={(e) =>
              setSelectedProject({ ...selectedProject, projectName: e.target.value } as IProject)
            }
          />

          <InputText
            label="Customer Name"
            className="w-full"
            value={selectedProject?.customerName || ""}
            required
            onChange={(e) =>
              setSelectedProject({ ...selectedProject, customerName: e.target.value } as IProject)
            }
          />
        </div>

        <InputTextArea
          label="Address"
          rows={4}
          value={selectedProject.address}
          onChange={(e) => {
            setSelectedProject({ ...selectedProject, address: e.target.value } as IProject)
          }}
        />

        <div className="flex gap-2">
          <InputText
            label="Start Date"
            className="w-full"
            value={selectedProject?.startDate || ""}
            type="date"
            onChange={(e) =>
              setSelectedProject({ ...selectedProject, startDate: e.target.value } as IProject)
            }
          />

          <InputText
            label="End Date"
            value={selectedProject?.endDate || ""}
            className="w-full"
            type="date"
            onChange={(e) =>
              setSelectedProject({ ...selectedProject, endDate: e.target.value } as IProject)
            }
          />
        </div>

        <InputText
          label="Type Of Work"
          value={selectedProject?.typeOfWork || ""}
          onChange={(e) =>
            setSelectedProject({ ...selectedProject, typeOfWork: e.target.value } as IProject)
          }
        />

        <div className="flex gap-2">
          <InputText
            label="Volume"
            value={selectedProject?.volume || ""}
            className="w-3/4"
            type="number"
            onChange={(e) =>
              setSelectedProject({
                ...selectedProject,
                volume: parseInt(e.target.value),
              } as IProject)
            }
          />

          <InputText
            label="Volume Unit"
            className="w-3/4"
            value={selectedProject?.volumeUnit || ""}
            onChange={(e) =>
              setSelectedProject({ ...selectedProject, volumeUnit: e.target.value } as IProject)
            }
          />
        </div>
        {selectedProject._id && (
          <InputSelect
            label="Status"
            value={selectedProject.isComplete}
            onChange={(e) =>
              setSelectedProject({
                ...selectedProject,
                isComplete: e.target.value === "true",
              } as IProject)
            }
            options={[
              { label: "Complete", value: true },
              { label: "Uncomplete", value: false },
            ]}
          />
        )}
      </div>
    </ModalForm>
  )
}
