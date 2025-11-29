export interface BigdataCloudReverseGeo {
  latitude: number
  lookupSource: string
  longitude: number
  localityLanguageRequested: string
  continent: string
  continentCode: string
  countryName: string
  countryCode: string
  principalSubdivision: string
  principalSubdivisionCode: string
  city: string
  locality: string
  postcode: string
  plusCode: string
  localityInfo: LocalityInfo
}

export interface LocalityInfo {
  administrative: Administrative[]
  informative: Informative[]
}

export interface Administrative {
  name: string
  description: string
  isoName?: string
  order: number
  adminLevel: number
  isoCode?: string
  wikidataId: string
  geonameId: number
}

export interface Informative {
  name: string
  description: string
  isoName?: string
  order: number
  isoCode?: string
  wikidataId?: string
  geonameId?: number
}

export type UserRole = "admin" | "technician" | "manager" | "warehouse"

export interface IUser {
  _id?: string
  username: string
  email: string
  name: string
  phoneNumber: string
  userRole: UserRole
  password?: string
  // status: "true" | "false"
  status: boolean
}

export interface IFilterUser {
  username?: string
  name?: string
  email?: string
  status?: boolean | null
  phoneNumber?: string
}

export type UserState = {
  filter: IFilterUser
  refreshKey: number
  isFilterOpen: boolean
  isFormOpen: boolean
  selectedUser: Partial<IUser>
  isFormDeleteOpen: boolean
}

export interface TableColumn<T> {
  key: keyof T
  label: string
  additionalClass?: string // 👈 NEW: specify column width
  hiddenKey?: string // 👈 NEW: store value but don't render the column
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

export interface TableProps<T> {
  columns: TableColumn<T>[]
  apiEndpoint: string
  pageSize?: number
  renderActions?: (row: T) => React.ReactNode
  actionsColumnFixed?: boolean // 👈 NEW: sticky right actions column
  actionsColumnWidth?: string // 👈 NEW: width for actions column
  emptyValue?: string
}
