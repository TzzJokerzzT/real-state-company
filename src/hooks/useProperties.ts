import { useCallback, useMemo } from "react"
import { propertyApi } from "../services/api"
import { usePropertyStore } from "../store/PropertyStore"
import type { Pagination } from "../store/types"
import type { Property, PropertyFilterDto } from "../types/Property"

export const useProperties = () => {
  const { pagination, setProperties, setLoading, setError, setPagination } =
    usePropertyStore()

  const fetchProperties = useCallback(
    async (filter: PropertyFilterDto = {}) => {
      setLoading(true)
      setError(null)

      try {
        const response = await propertyApi.getPropertiesByFilter({
          page: 1,
          pageSize: 12,
          ...filter
        })

        setProperties(response.properties)
        setPagination({
          currentPage: response.page,
          totalPages: response.totalPages,
          totalCount: response.totalCount,
          pageSize: response.pageSize
        })
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch properties"
        )
        setProperties([])
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const searchProperties = useCallback(
    async (filter: PropertyFilterDto) => {
      setLoading(true)
      setError(null)

      try {
        const response = await propertyApi.getPropertiesByFilter({
          page: 1,
          pageSize: pagination.pageSize,
          ...filter
        })

        setProperties(response.properties)
        setPagination({
          currentPage: response.page,
          totalPages: response.totalPages,
          totalCount: response.totalCount,
          pageSize: response.pageSize
        })
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to search properties"
        )
        setProperties([])
      } finally {
        setLoading(false)
      }
    },
    [pagination.pageSize, setLoading, setError, setProperties, setPagination]
  )

  const changePage = useCallback(
    async (page: number, currentFilter?: PropertyFilterDto) => {
      setLoading(true)
      setError(null)

      try {
        const response = await propertyApi.getPropertiesByFilter({
          ...currentFilter,
          page,
          pageSize: pagination.pageSize
        })

        setProperties(response.properties)
        setPagination((prev: Pagination) => ({
          ...prev,
          currentPage: response.page,
          totalPages: response.totalPages,
          totalCount: response.totalCount
        }))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to change page")
      } finally {
        setLoading(false)
      }
    },
    [pagination.pageSize, setLoading, setError, setProperties, setPagination]
  )

  const getPropertyById = useCallback(
    async (id: string): Promise<Property | null> => {
      try {
        const property = await propertyApi.getPropertyById(id)
        return property
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch property"
        )
        return null
      }
    },
    [setError]
  )

  const createProperty = useCallback(
    async (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
      try {
        const newProperty = await propertyApi.createProperty(propertyData)
        // Refresh the current page to show the new property
        await fetchProperties({
          page: pagination.currentPage,
          pageSize: pagination.pageSize
        })
        return newProperty
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create property"
        )
        throw err
      }
    },
    [fetchProperties, pagination.currentPage, pagination.pageSize, setError]
  )

  const updateProperty = useCallback(
    async (
      id: string,
      propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">
    ) => {
      try {
        const updatedProperty = await propertyApi.updateProperty(
          id,
          propertyData
        )
        // Update the property in the current list
        setProperties(prev =>
          prev.map(p => (p.id === id ? updatedProperty : p))
        )
        return updatedProperty
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update property"
        )
        throw err
      }
    },
    [setProperties, setError]
  )

  const deleteProperty = useCallback(
    async (id: string) => {
      try {
        await propertyApi.deleteProperty(id)
        // Remove the property from the current list
        setProperties(prev => prev.filter(p => p.id !== id))
        setPagination(prev => ({
          ...prev,
          totalCount: prev.totalCount - 1
        }))
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete property"
        )
        throw err
      }
    },
    [setProperties, setPagination, setError]
  )

  return useMemo(
    () => ({
      pagination,
      fetchProperties,
      searchProperties,
      changePage,
      getPropertyById,
      createProperty,
      updateProperty,
      deleteProperty
    }),
    [
      pagination,
      fetchProperties,
      searchProperties,
      changePage,
      getPropertyById,
      createProperty,
      updateProperty,
      deleteProperty
    ]
  )
}
