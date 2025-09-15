import { Filter, Search, X } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { PropertyFilterDto } from "../../types/Property"
import { ButtonComponent } from "../UI/Button/Button"
import { InputComponent } from "../UI/Input/Input"
import type { PropertyFilterProps } from "./types"

/**
 * PropertyFilter component provides filtering functionality for properties
 * Includes search by name, address, price range, and other criteria
 * Features expandable/collapsible interface and clear filters functionality
 * 
 * @param props - The property filter props
 * @returns JSX property filter element
 */
export const PropertyFilter = ({
  onFilterChange,
  loading = false
}: PropertyFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<PropertyFilterDto>({
    page: 1,
    pageSize: 12
  })

  const navigate = useNavigate()

  const handlerNavigate = () => {
    navigate("/ownerlist")
  }

  const handleInputChange = (
    field: keyof PropertyFilterDto,
    value: string | number
  ) => {
    const newFilters = {
      ...filters,
      [field]: value || undefined
    }
    setFilters(newFilters)
  }

  const handleApplyFilter = () => {
    onFilterChange(filters)
  }

  const handleClearFilter = () => {
    const clearedFilters = {
      page: 1,
      pageSize: 12
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters =
    filters.name ||
    filters.address ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.idOwner

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="w-5 h-5 mr-2 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Filter Properties
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          <ButtonComponent
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {isExpanded ? "Less Filters" : "More Filters"}
          </ButtonComponent>
          <ButtonComponent onClick={handlerNavigate}>
            Owners List
          </ButtonComponent>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputComponent
          value={filters.name || ""}
          onChange={e => handleInputChange("name", e.target.value)}
          label="Property Name"
          placeholder="Search by property name..."
        />

        <InputComponent
          value={filters.address || ""}
          onChange={e => handleInputChange("address", e.target.value)}
          label="Address"
          placeholder="Search by address..."
        />

        <InputComponent
          value={filters.idOwner || ""}
          onChange={e => handleInputChange("idOwner", e.target.value)}
          label="Owner ID"
          placeholder="Search by owner ID..."
        />

        {isExpanded && (
          <>
            <InputComponent
              value={filters.minPrice || ""}
              onChange={e => handleInputChange("minPrice", e.target.value)}
              label="Min Price"
              placeholder="Search by min price..."
              type="number"
            />

            <InputComponent
              value={filters.maxPrice || ""}
              onChange={e => handleInputChange("maxPrice", e.target.value)}
              label="Max Price"
              placeholder="Search by max price..."
              type="number"
            />
          </>
        )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-4">
          <ButtonComponent isDisabled={loading} onClick={handleApplyFilter}>
            <Search className="w-4 h-4 mr-2" />
            {loading ? "Searching..." : "Search"}
          </ButtonComponent>

          {hasActiveFilters && (
            <ButtonComponent
              onClick={handleClearFilter}
              isDisabled={loading}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </ButtonComponent>
          )}
        </div>

        {hasActiveFilters && (
          <div className="text-sm text-gray-600">Active filters applied</div>
        )}
      </div>
    </div>
  )
}
