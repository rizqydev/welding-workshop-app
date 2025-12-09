import { createStore } from "zustand/vanilla"
import { ProjectState, IProject } from "@/lib/definitions"

export type ProjectActions = {
  setRefreshKey: () => void
  setIsFormOpen: (status: boolean) => void
  setSelectedProject: (formProject: Partial<IProject>) => void
  setIsFormDeleteOpen: (status: boolean) => void
  // setIsFilterOpen: (status: boolean) => void
  // setFilter: (filter: IFilterProject) => void
}

export type ProjectStore = ProjectState & ProjectActions

export const initProjectStore = (): ProjectState => ({
  refreshKey: 0,
  isFormOpen: false,
  selectedProject: {
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
  },
  isFormDeleteOpen: false,
  // isFilterOpen: false,
  // filter: {
  //   username: "",
  //   name: "",
  //   email: "",
  //   status: true,
  //   phoneNumber: "",
  // },
})

export const defaultInitState: ProjectState = {
  refreshKey: 0,
  isFormOpen: false,
  selectedProject: {
    _id: "",
    projectName: "",
    customerName: "",
    address: "",
    typeOfWork: "",
    volume: 0,
    volumeUnit: "",
    isComplete: false,
  },
  isFormDeleteOpen: false,
  // isFilterOpen: false,
  // filter: {
  //   username: "",
  //   name: "",
  //   email: "",
  //   status: true,
  //   phoneNumber: "",
  // },
}

export const createProjectStore = (initState: ProjectState = defaultInitState) => {
  return createStore<ProjectStore>()((set) => ({
    ...initState,
    setRefreshKey() {
      set((state) => ({ refreshKey: state.refreshKey + 1 }))
    },
    setIsFormOpen(status) {
      set(() => ({
        isFormOpen: status,
      }))
    },
    setSelectedProject: (formProject) => {
      set(() => ({
        selectedProject: formProject,
      }))
    },
    setIsFormDeleteOpen(status) {
      set(() => ({
        isFormDeleteOpen: status,
      }))
    },
    // setIsFilterOpen(status) {
    //   set(() => ({
    //     isFilterOpen: status,
    //   }))
    // },
    // setFilter: (filter) =>
    //   set(() => ({
    //     filter: filter,
    //   })),
  }))
}
