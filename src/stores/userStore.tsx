import { createStore } from "zustand/vanilla"
import { IUser, IFilterUser, UserState } from "@/lib/definitions"

export type UserActions = {
  setFilter: (filter: IFilterUser) => void
  setRefreshKey: () => void
  setIsFilterOpen: (status: boolean) => void
  setIsFormOpen: (status: boolean) => void
  setSelectedUser: (formUser: Partial<IUser>) => void
  setIsFormDeleteOpen: (status: boolean) => void
}

export type UserStore = UserState & UserActions

export const initUserStore = (): UserState => ({
  refreshKey: 0,
  isFilterOpen: false,
  filter: {
    username: "",
    name: "",
    email: "",
    status: true,
    phoneNumber: "",
  },
  isFormOpen: false,
  selectedUser: {
    _id: "",
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
    userRole: "technician",
    password: "",
    status: true,
  },
  isFormDeleteOpen: false,
})

export const defaultInitState: UserState = {
  refreshKey: 0,
  isFilterOpen: false,
  isFormOpen: false,
  filter: {
    username: "",
    name: "",
    email: "",
    status: true,
    phoneNumber: "",
  },
  selectedUser: {
    _id: "",
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
    userRole: "technician",
    password: "",
  },
  isFormDeleteOpen: false,
}

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setRefreshKey() {
      set((state) => ({ refreshKey: state.refreshKey + 1 }))
    },

    setIsFilterOpen(status) {
      set(() => ({
        isFilterOpen: status,
      }))
    },
    setFilter: (filter) =>
      set(() => ({
        filter: filter,
      })),

    setIsFormOpen(status) {
      set(() => ({
        isFormOpen: status,
      }))
    },
    setSelectedUser: (formUser) =>
      set(() => ({
        selectedUser: formUser,
      })),

    setIsFormDeleteOpen(status) {
      set(() => ({
        isFormDeleteOpen: status,
      }))
    },
  }))
}
