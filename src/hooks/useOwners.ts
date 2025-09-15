import { useOwnerStore } from "@/store/OwnerStore"
import { useCallback, useMemo } from "react"
import { ownerApi } from "../services/api"
import type { CreateOwnerDto } from "../types/Owner"

export const useOwners = () => {
  const { owners, setOwners, setFilteredOwners, setLoading, setError } =
    useOwnerStore()

  const fetchOwners = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await ownerApi.getAllOwners()
      setOwners(data)
      setFilteredOwners(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch owners")
      setOwners([])
      setFilteredOwners([])
    } finally {
      setLoading(false)
    }
  }, [])

  const filterByName = useCallback(
    (name: string) => {
      const term = name.trim().toLowerCase()
      if (!term) {
        setFilteredOwners(owners)
        return
      }
      setFilteredOwners(owners.filter(o => o.name.toLowerCase().includes(term)))
    },
    [owners]
  )

  const createOwner = useCallback(async (payload: CreateOwnerDto) => {
    setError(null)
    const newOwner = await ownerApi.createOwner(payload)
    // Optimistically add to both lists
    setOwners(prev => [newOwner, ...prev])
    setFilteredOwners(prev => [newOwner, ...prev])
    return newOwner
  }, [])

  return useMemo(
    () => ({
      fetchOwners,
      filterByName,
      createOwner
    }),
    [fetchOwners, filterByName, createOwner]
  )
}
