import { create } from "zustand"
import type { OwnerStore } from "./types"
import { persist } from "zustand/middleware"

export const useOwnerStore = create<OwnerStore>()(
  persist(
    set => ({
      owners: [],
      owner: null,
      ownerProperties: [],
      loading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        pageSize: 12
      },
      selectedOwner: null,
      setOwners: owners =>
        set({ owners: typeof owners === "function" ? owners([]) : owners }),
      setOwner: owner => set({ owner }),
      setOwnerProperties: ownerProperties => set({ ownerProperties }),
      setFilteredOwners: owners =>
        set({ owners: typeof owners === "function" ? owners([]) : owners }),
      setLoading: loading => set({ loading }),
      setError: error => set({ error }),
      setPagination: pagination => set({ pagination }),
      setSelectedOwner: selectedOwner => set({ selectedOwner })
    }),
    {
      name: "owner-store",
      partialize: state => ({ owners: state.owners })
    }
  )
)
