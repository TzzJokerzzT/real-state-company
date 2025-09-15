import { create } from "zustand"
import type { PropertyStore } from "./types"

export const usePropertyStore = create<PropertyStore>(set => ({
  properties: [],
  property: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 12
  },
  selectedProperty: [],
  setProperties: properties =>
    set({
      properties: typeof properties === "function" ? properties([]) : properties
    }),
  setProperty: property => set({ property }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  setPagination: pagination =>
    set(state => ({
      pagination:
        typeof pagination === "function"
          ? pagination(state.pagination)
          : pagination
    })),
  setSelectedProperty: selectedProperty => set({ selectedProperty })
}))
