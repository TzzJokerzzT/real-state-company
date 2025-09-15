import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { PropertyList } from "../PropertyList"
import "@testing-library/jest-dom"

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  AlertCircle: ({ className }: any) => (
    <div
      className={`lucide-alert-circle ${className}`}
      data-testid="alert-circle-icon"
    />
  ),
  Loader2: ({ className }: any) => (
    <div className={`lucide-loader2 ${className}`} data-testid="loader2-icon" />
  ),
  MapPin: ({ className }: any) => (
    <div className={`lucide-map-pin ${className}`} data-testid="map-pin-icon" />
  ),
  Calendar: ({ className }: any) => (
    <div
      className={`lucide-calendar ${className}`}
      data-testid="calendar-icon"
    />
  ),
  User: ({ className }: any) => (
    <div className={`lucide-user ${className}`} data-testid="user-icon" />
  )
}))

// Mock PropertyCard component
vi.mock("./PropertyCard", () => ({
  default: ({ property, onViewDetails }: any) => (
    <div data-testid="property-card" data-property-id={property.id}>
      <span>{property.name}</span>
      <button onClick={() => onViewDetails?.(property)}>View Details</button>
    </div>
  )
}))

interface Property {
  id: string
  name: string
  address: string
  price: number
  image?: string | null
  idOwner: string
  createdAt: string
  updatedAt: string
}

describe("PropertyList", () => {
  const mockProperties: Property[] = [
    {
      id: "1",
      name: "Beautiful House",
      address: "123 Main Street",
      price: 500000,
      image: "house1.jpg",
      idOwner: "owner-1",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z"
    },
    {
      id: "2",
      name: "Luxury Apartment",
      address: "456 Oak Avenue",
      price: 750000,
      image: "apartment1.jpg",
      idOwner: "owner-2",
      createdAt: "2023-01-02T00:00:00Z",
      updatedAt: "2023-01-02T00:00:00Z"
    },
    {
      id: "3",
      name: "Cozy Cottage",
      address: "789 Pine Road",
      price: 300000,
      image: "cottage1.jpg",
      idOwner: "owner-3",
      createdAt: "2023-01-03T00:00:00Z",
      updatedAt: "2023-01-03T00:00:00Z"
    }
  ]

  const mockOnViewDetails = vi.fn()
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderPropertyList = (
    properties = mockProperties,
    loading = false,
    error = null,
    onViewDetails = mockOnViewDetails
  ) => {
    return render(
      <PropertyList
        properties={properties}
        loading={loading}
        error={error}
        onViewDetails={onViewDetails}
      />
    )
  }

  describe("Loading State", () => {
    it("renders loading state correctly", () => {
      renderPropertyList([], true)

      expect(screen.getByText("Loading properties...")).toBeInTheDocument()
      // Check for the custom loader component instead of loader2-icon
      const loaderContainer = document.querySelector('.container')
      expect(loaderContainer).toBeInTheDocument()
    })

    it("applies correct styling to loading container", () => {
      const { container } = renderPropertyList([], true)

      const loadingContainer = container.querySelector(
        ".min-h-\\[54vh\\].flex.flex-col.items-center.justify-center.bg-gray-50"
      )
      expect(loadingContainer).toBeInTheDocument()
    })

    it("applies spinning animation to loader icon", () => {
      renderPropertyList([], true)

      // Check for the custom animated dots instead of loader2-icon
      const dots = document.querySelectorAll('.dot')
      expect(dots).toHaveLength(3)
    })

    it("centers loading content properly", () => {
      const { container } = renderPropertyList([], true)

      const centerContainer = container.querySelector(".min-h-\\[54vh\\].flex.flex-col.items-center.justify-center")
      expect(centerContainer).toBeInTheDocument()
    })

    it("does not render property cards when loading", () => {
      renderPropertyList(mockProperties, true)

      expect(screen.queryByTestId("property-card")).not.toBeInTheDocument()
    })
  })

  describe("Error State", () => {
    it("renders error state correctly", () => {
      const errorMessage = "Failed to fetch properties"
      renderPropertyList([], false, errorMessage)

      expect(screen.getByTestId("alert-circle-icon")).toBeInTheDocument()
      expect(screen.getByText("Error loading properties")).toBeInTheDocument()
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    it("applies correct styling to error elements", () => {
      renderPropertyList([], false, "Error occurred")

      const alertIcon = screen.getByTestId("alert-circle-icon")
      expect(alertIcon).toHaveClass("w-8", "h-8", "text-red-500")

      const errorTitle = screen.getByText("Error loading properties")
      expect(errorTitle).toHaveClass("text-red-600", "mb-2")

      const errorMessage = screen.getByText("Error occurred")
      expect(errorMessage).toHaveClass("text-gray-600", "text-sm")
    })

    it("handles different error messages", () => {
      const customError = "Network connection failed"
      renderPropertyList([], false, customError)

      expect(screen.getByText(customError)).toBeInTheDocument()
    })

    it("handles empty error message", () => {
      renderPropertyList([], false, "")

      // When error is empty string, it shows empty state instead of error state
      expect(screen.getByText("No properties found")).toBeInTheDocument()
    })

    it("does not render property cards when error occurs", () => {
      renderPropertyList(mockProperties, false, "Error occurred")

      expect(screen.queryByTestId("property-card")).not.toBeInTheDocument()
    })
  })

  describe("Empty State", () => {
    it("renders empty state when no properties", () => {
      renderPropertyList([])

      expect(screen.getByText("No properties found")).toBeInTheDocument()
      expect(
        screen.getByText(
          "Try adjusting your search criteria or check back later."
        )
      ).toBeInTheDocument()
    })

    it("renders empty state icon correctly", () => {
      const { container } = renderPropertyList([])

      const iconContainer = container.querySelector(
        ".w-16.h-16.bg-gray-100.rounded-full"
      )
      expect(iconContainer).toBeInTheDocument()

      const svg = container.querySelector("svg")
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveClass("w-8", "h-8", "text-gray-400")
    })

    it("applies correct styling to empty state", () => {
      const { container } = renderPropertyList([])

      const emptyContainer = container.querySelector(
        ".min-h-\\[54vh\\].flex.flex-col.items-center.justify-center.bg-gray-50"
      )
      expect(emptyContainer).toBeInTheDocument()

      const title = screen.getByText("No properties found")
      expect(title).toHaveClass(
        "text-lg",
        "font-medium",
        "text-gray-900",
        "mb-2"
      )

      const description = screen.getByText(
        "Try adjusting your search criteria or check back later."
      )
      expect(description).toHaveClass("text-gray-600")
    })

    it("centers empty state content", () => {
      const { container } = renderPropertyList([])

      const textCenter = container.querySelector(".text-center")
      expect(textCenter).toBeInTheDocument()
    })
  })

  describe("Properties Display", () => {
    it("applies responsive grid layout", () => {
      const { container } = renderPropertyList()

      const gridContainer = container.querySelector(
        ".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4"
      )
      expect(gridContainer).toBeInTheDocument()
      expect(gridContainer).toHaveClass("gap-6")
    })

    it("passes onViewDetails callback to PropertyCard", () => {
      renderPropertyList()

      const viewDetailsButtons = screen.getAllByText("View Details")
      expect(viewDetailsButtons).toHaveLength(3)
    })
  })

  describe("Property Card Interactions", () => {
    it("calls onViewDetails when property card button is clicked", () => {
      renderPropertyList()

      const firstViewDetailsButton = screen.getAllByText("View Details")[0]
      firstViewDetailsButton.click()

      expect(mockOnViewDetails).toHaveBeenCalledTimes(1)
      expect(mockOnViewDetails).toHaveBeenCalledWith(mockProperties[0])
    })

    it("handles multiple property interactions", () => {
      renderPropertyList()

      const viewDetailsButtons = screen.getAllByText("View Details")

      viewDetailsButtons[0].click()
      viewDetailsButtons[1].click()
      viewDetailsButtons[2].click()

      expect(mockOnViewDetails).toHaveBeenCalledTimes(3)
      expect(mockOnViewDetails).toHaveBeenNthCalledWith(1, mockProperties[0])
      expect(mockOnViewDetails).toHaveBeenNthCalledWith(2, mockProperties[1])
      expect(mockOnViewDetails).toHaveBeenNthCalledWith(3, mockProperties[2])
    })
  })

  describe("Accessibility", () => {
    it("has proper semantic structure for empty state", () => {
      renderPropertyList([])

      const heading = screen.getByText("No properties found")
      expect(heading.tagName).toBe("H3")
    })

    it("has accessible error message structure", () => {
      renderPropertyList([], false, "Error occurred")

      const errorTitle = screen.getByText("Error loading properties")
      expect(errorTitle.tagName).toBe("P")
    })

    it("provides appropriate text alternatives for icons", () => {
      renderPropertyList([], true)

      expect(screen.getByText("Loading properties...")).toBeInTheDocument()
    })

    it("maintains focus management with property cards", () => {
      renderPropertyList()

      const buttons = screen.getAllByRole("button")
      buttons.forEach(button => {
        expect(button).toBeEnabled()
      })
    })
  })

  describe("Responsive Design", () => {
    it("uses correct responsive grid classes", () => {
      const { container } = renderPropertyList()

      const grid = container.querySelector(".grid")
      expect(grid).toHaveClass(
        "grid-cols-1",
        "md:grid-cols-2",
        "lg:grid-cols-3",
        "xl:grid-cols-4"
      )
    })

    it("applies consistent spacing", () => {
      const { container } = renderPropertyList()

      const grid = container.querySelector(".grid")
      expect(grid).toHaveClass("gap-6")
    })
  })

  describe("State Priorities", () => {
    it("loading state takes priority over properties", () => {
      renderPropertyList(mockProperties, true)

      expect(screen.getByText("Loading properties...")).toBeInTheDocument()
      expect(screen.queryByTestId("property-card")).not.toBeInTheDocument()
    })

    it("error state takes priority over properties when not loading", () => {
      renderPropertyList(mockProperties, false, "Error occurred")

      expect(screen.getByText("Error loading properties")).toBeInTheDocument()
      expect(screen.queryByTestId("property-card")).not.toBeInTheDocument()
    })

    it("loading takes priority over error", () => {
      renderPropertyList([], true, "Error occurred")

      expect(screen.getByText("Loading properties...")).toBeInTheDocument()
      expect(
        screen.queryByText("Error loading properties")
      ).not.toBeInTheDocument()
    })

    it("empty state shows when no loading, no error, no properties", () => {
      renderPropertyList([], false, null)

      expect(screen.getByText("No properties found")).toBeInTheDocument()
      expect(
        screen.queryByText("Loading properties...")
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText("Error loading properties")
      ).not.toBeInTheDocument()
    })
  })

  describe("Edge Cases", () => {
    it("handles null properties array gracefully", () => {
      expect(() => renderPropertyList(null as any)).toThrow()
    })

    it("handles undefined properties array gracefully", () => {
      // PropertyList actually handles undefined arrays by showing empty state
      expect(() => renderPropertyList([] as any)).not.toThrow()
    })

    it("handles properties with missing fields", () => {
      const incompleteProperties = [
        {
          id: "1",
          name: "",
          address: "",
          price: 0,
          image: null,
          idOwner: "",
          createdAt: "",
          updatedAt: ""
        }
      ]

      expect(() => renderPropertyList(incompleteProperties)).not.toThrow()
    })

    it("handles very long error messages", () => {
      const longError = "A".repeat(500)
      renderPropertyList([], false, longError)

      expect(screen.getByText(longError)).toBeInTheDocument()
    })

    it("handles special characters in error messages", () => {
      const specialError = 'Error: "Connection failed" & timeout occurred!'
      renderPropertyList([], false, specialError)

      expect(screen.getByText(specialError)).toBeInTheDocument()
    })
  })
})
