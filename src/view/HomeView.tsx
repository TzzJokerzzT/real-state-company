import Pagination from "@/components/Pagination"
import { PropertyDetails } from "@/components/Property/PropertyDetails"
import { PropertyFilter } from "@/components/Property/PropertyFilter"
import { PropertyList } from "@/components/Property/PropertyList"
import { TransitionAnimation } from "@/components/UI/Animation/Transition"
import { useProperties } from "@/hooks/useProperties"
import { Layout } from "@/layout/Layout"
import { usePropertyStore } from "@/store/PropertyStore"
import type { Property, PropertyFilterDto } from "@/types/Property"
import { useCallback, useState } from "react"

export function HomeView() {
  const [currentFilter, setCurrentFilter] = useState<PropertyFilterDto>({
    page: 1,
    pageSize: 12
  })
  const {
    properties,
    loading,
    error,
    pagination,
    selectedProperty,
    setSelectedProperty
  } = usePropertyStore()
  const { searchProperties, changePage } = useProperties()
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (filter: PropertyFilterDto) => {
    setCurrentFilter(filter)
    searchProperties(filter)
  }

  const handlePageChange = (page: number) => {
    changePage(page, currentFilter)
  }

  const handleViewDetails = useCallback((property: Property) => {
    setSelectedProperty([property])
    setIsOpen(true)
  }, [])

  const handleCloseDetails = useCallback(() => {
    setSelectedProperty(null)
  }, [setSelectedProperty])
  return (
    <Layout>
      {/* Filter Section */}
      <PropertyFilter onFilterChange={handleFilterChange} loading={loading} />

      {/* Properties Grid */}
      <PropertyList
        properties={properties ?? []}
        loading={loading}
        error={error}
        onViewDetails={handleViewDetails}
      />

      {/* Pagination */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        loading={loading}
      />

      {/* Property Details Modal */}
      <PropertyDetails
        isOpen={isOpen}
        property={selectedProperty ? selectedProperty[0] : null}
        onClose={handleCloseDetails}
      />
    </Layout>
  )
}
