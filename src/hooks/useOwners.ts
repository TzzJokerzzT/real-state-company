import { useOwnerStore } from "@/store/OwnerStore"
import { useCallback, useMemo } from "react"
import { ownerApi } from "../services/api"
import type { CreateOwnerDto } from "../types/Owner"

/**
 * Custom hook for managing owner-related operations
 * Provides functions for fetching, filtering, and creating owners
 * 
 * @returns Object containing owner management functions
 */
export const useOwners = () => {
  const { owners, setOwners, setFilteredOwners, setLoading, setError } =
    useOwnerStore()

  /**
   * Fetches all owners from the API and updates both owners and filtered owners state
   */
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

  /**
   * Filters owners by name (case-insensitive search)
   * If no search term is provided, shows all owners
   * 
   * @param name - The name or partial name to search for
   */
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

  /**
   * Creates a new owner and optimistically updates the local state
   * 
   * @param payload - Owner creation data
   * @returns Promise resolving to the created owner
   * @throws Error if creation fails
   */
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
