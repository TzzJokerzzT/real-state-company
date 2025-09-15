import type { Owner } from "@/types/Owner"
import type { Property } from "../types/Property"

export interface Pagination {
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
}

export interface PropertyStore {
  properties: Property[] | null
  property: Property | null
  loading: boolean
  error: string | null
  pagination: Pagination
  selectedProperty: Property[] | null
  setProperties: (
    properties: Property[] | ((prev: Property[]) => Property[])
  ) => void
  setProperty: (property: Property) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setPagination: (
    pagination: Pagination | ((prev: Pagination) => Pagination)
  ) => void
  setSelectedProperty: (property: Property[] | null) => void
}

export interface OwnerStore {
  owners: Owner[]
  owner: Owner | null
  ownerProperties: Property[]
  loading: boolean
  error: string | null
  pagination: Pagination
  selectedOwner: Owner | null
  setOwners: (owners: Owner[] | ((prev: Owner[]) => Owner[])) => void
  setOwner: (owner: Owner) => void
  setOwnerProperties: (ownerProperties: Property[]) => void
  setFilteredOwners: (owners: Owner[] | ((prev: Owner[]) => Owner[])) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setPagination: (pagination: any) => void
  setSelectedOwner: (owner: any) => void
}
