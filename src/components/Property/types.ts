import type { Property, PropertyFilterDto } from "@/types/Property"

export interface PropertyPreviewData {
  name: string
  address: string
  price: number
  image: string
  ownerName: string
}

export interface PropertyPreviewModalProps {
  propertyData?: PropertyPreviewData
  createdProperty?: Property
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  onGoHome?: () => void
  loading?: boolean
  mode: "preview" | "confirmation"
}

export interface PropertyDetailsProps {
  property: Property | null
  onClose: () => void
  isOpen: boolean
}

export interface PropertyFilterProps {
  onFilterChange: (filter: PropertyFilterDto) => void
  loading?: boolean
}

export interface PropertyListProps {
  properties: Property[]
  loading: boolean
  error: string | null
  onViewDetails?: (property: Property) => void
}

export interface PropertyCardProps {
  property: Property
  onViewDetails?: (property: Property) => void
}
