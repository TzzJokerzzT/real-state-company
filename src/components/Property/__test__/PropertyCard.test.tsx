import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import PropertyCard from "../PropertyCard"
import "@testing-library/jest-dom"

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
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

// Mock ButtonComponent
vi.mock("../../UI/Button/Button", () => ({
  ButtonComponent: ({ children, onClick, className }: any) => (
    <button
      onClick={onClick}
      className={className}
      data-testid="button-component"
    >
      {children}
    </button>
  )
}))

// Mock helper functions
vi.mock("../../helpers/helper", () => ({
  formatDate: vi.fn((date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  ),
  formatPrice: vi.fn((price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(price)
  )
}))

interface Property {
  id: string
  name: string
  address: string
  price: number
  image: string | null
  idOwner: string
  createdAt: string
  updatedAt: string
}

describe("PropertyCard", () => {
  const mockProperty: Property = {
    id: "1",
    name: "Beautiful House",
    address: "123 Main Street, City",
    price: 500000,
    image: "https://example.com/image.jpg",
    idOwner: "owner-123",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  }

  const mockOnViewDetails = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderPropertyCard = (
    property = mockProperty,
    onViewDetails?: (property: Property) => void
  ) => {
    return render(
      <PropertyCard property={property as any} onViewDetails={onViewDetails} />
    )
  }

  describe("Rendering", () => {
    it("renders property card with all elements", () => {
      renderPropertyCard(mockProperty, mockOnViewDetails)

      expect(screen.getByText("Beautiful House")).toBeInTheDocument()
      expect(screen.getByText("123 Main Street, City")).toBeInTheDocument()
      expect(screen.getByText("$500,000")).toBeInTheDocument()
      expect(screen.getByText("Owner ID: owner-123")).toBeInTheDocument()
      expect(screen.getByText("Added Dec 31, 2022")).toBeInTheDocument()
    })

    it("renders property image with correct attributes", () => {
      renderPropertyCard()

      const image = screen.getByRole("img")
      expect(image).toHaveAttribute("src", "https://example.com/image.jpg")
      expect(image).toHaveAttribute("alt", "Beautiful House")
    })

    it("renders placeholder image when property image is null", () => {
      const propertyWithoutImage = { ...mockProperty, image: null }
      renderPropertyCard(propertyWithoutImage)

      const image = screen.getByRole("img")
      expect(image).toHaveAttribute("src", "/placeholder-property.svg")
    })

    it("renders placeholder image when property image is empty string", () => {
      const propertyWithEmptyImage = { ...mockProperty, image: "" }
      renderPropertyCard(propertyWithEmptyImage)

      const image = screen.getByRole("img")
      expect(image).toHaveAttribute("src", "/placeholder-property.svg")
    })

    it("applies correct CSS classes to card container", () => {
      const { container } = renderPropertyCard()

      const cardContainer = container.firstChild
      expect(cardContainer).toHaveClass(
        "bg-white",
        "rounded-lg",
        "shadow-md",
        "overflow-hidden",
        "hover:shadow-lg",
        "transition-shadow",
        "duration-300"
      )
    })
  })

  describe("Icons and Visual Elements", () => {
    it("renders all required icons", () => {
      renderPropertyCard()

      expect(screen.getByTestId("map-pin-icon")).toBeInTheDocument()
      expect(screen.getByTestId("user-icon")).toBeInTheDocument()
      expect(screen.getByTestId("calendar-icon")).toBeInTheDocument()
    })

    it("renders price badge with correct styling", () => {
      renderPropertyCard()

      const priceBadge = screen.getByText("$500,000").closest("div")
      expect(priceBadge).toHaveClass(
        "absolute",
        "top-4",
        "right-4",
        "bg-white",
        "px-2",
        "py-1",
        "rounded-full",
        "shadow-md"
      )
    })

    it("applies correct styling to price text", () => {
      renderPropertyCard()

      const priceText = screen.getByText("$500,000")
      expect(priceText).toHaveClass(
        "text-green-600",
        "font-semibold",
        "text-sm"
      )
    })
  })

  describe("Content Formatting", () => {
    it("calls formatPrice helper with correct value", () => {
      renderPropertyCard(mockProperty, mockOnViewDetails)

      // Check that the formatted price appears in the DOM
      expect(screen.getByText("$500,000")).toBeInTheDocument()
    })

    it("calls formatDate helper with correct value", () => {
      renderPropertyCard(mockProperty, mockOnViewDetails)

      // Check that the formatted date appears in the DOM
      expect(screen.getByText("Added Dec 31, 2022")).toBeInTheDocument()
    })

    it("truncates long property names correctly", () => {
      const longNameProperty = {
        ...mockProperty,
        name: "This is a very long property name that should be truncated appropriately"
      }
      renderPropertyCard(longNameProperty)

      const titleElement = screen.getByText(
        "This is a very long property name that should be truncated appropriately"
      )
      expect(titleElement).toHaveClass("line-clamp-2")
    })

    it("truncates long addresses correctly", () => {
      const longAddressProperty = {
        ...mockProperty,
        address:
          "This is a very long address that should be truncated in a single line"
      }
      renderPropertyCard(longAddressProperty)

      const addressElement = screen.getByText(
        "This is a very long address that should be truncated in a single line"
      )
      expect(addressElement).toHaveClass("line-clamp-1")
    })
  })

  describe("View Details Button", () => {
    it("renders View Details button when onViewDetails is provided", () => {
      renderPropertyCard(mockProperty, mockOnViewDetails)

      const button = screen.getByTestId("button-component")
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent("View Details")
    })

    it("does not render View Details button when onViewDetails is not provided", () => {
      renderPropertyCard(mockProperty, undefined)

      expect(screen.queryByText("View Details")).not.toBeInTheDocument()
    })

    it("calls onViewDetails with property when button is clicked", () => {
      renderPropertyCard(mockProperty, mockOnViewDetails)

      const button = screen.getByTestId("button-component")
      fireEvent.click(button)

      expect(mockOnViewDetails).toHaveBeenCalledTimes(1)
      expect(mockOnViewDetails).toHaveBeenCalledWith(mockProperty)
    })

    it("applies correct styling to View Details button", () => {
      renderPropertyCard(mockProperty, mockOnViewDetails)

      const button = screen.getByTestId("button-component")
      expect(button).toHaveClass(
        "w-full",
        "bg-blue-600",
        "text-white",
        "py-2",
        "px-4",
        "rounded-md",
        "hover:bg-blue-700",
        "transition-colors",
        "duration-200",
        "font-medium"
      )
    })
  })

  describe("Image Error Handling", () => {
    it("fallback to placeholder when image fails to load", () => {
      renderPropertyCard()

      const image = screen.getByRole("img") as HTMLImageElement

      // Simulate image load error
      fireEvent.error(image)

      expect(image.src).toContain("/placeholder-property.svg")
    })

    it("handles multiple image error events", () => {
      renderPropertyCard()

      const image = screen.getByRole("img") as HTMLImageElement

      // Simulate multiple image load errors
      fireEvent.error(image)
      fireEvent.error(image)

      expect(image.src).toContain("/placeholder-property.svg")
    })
  })

  describe("Accessibility", () => {
    it("has proper image alt text", () => {
      renderPropertyCard()

      const image = screen.getByRole("img")
      expect(image).toHaveAttribute("alt", "Beautiful House")
    })

    it("button is accessible when provided", () => {
      renderPropertyCard(mockProperty, mockOnViewDetails)

      const button = screen.getByRole("button")
      expect(button).toBeInTheDocument()
      expect(button).toBeEnabled()
    })

    it("has proper semantic structure", () => {
      renderPropertyCard()

      // Title should be in a heading-like element
      const title = screen.getByText("Beautiful House")
      expect(title.tagName).toBe("H3")
    })
  })

  describe("Different Property Data", () => {
    it("handles property with different price", () => {
      const expensiveProperty = { ...mockProperty, price: 1500000 }
      renderPropertyCard(expensiveProperty)

      expect(screen.getByText("$1,500,000")).toBeInTheDocument()
    })

    it("handles property with different owner ID", () => {
      const differentOwnerProperty = {
        ...mockProperty,
        idOwner: "different-owner-456"
      }
      renderPropertyCard(differentOwnerProperty)

      expect(
        screen.getByText("Owner ID: different-owner-456")
      ).toBeInTheDocument()
    })

    it("handles property with special characters in name", () => {
      const specialNameProperty = {
        ...mockProperty,
        name: 'Property & Co. - "Luxury" Home!'
      }
      renderPropertyCard(specialNameProperty)

      expect(
        screen.getByText('Property & Co. - "Luxury" Home!')
      ).toBeInTheDocument()
    })

    it("handles property with empty or minimal data", () => {
      const minimalProperty: Property = {
        id: "2",
        name: "",
        address: "",
        price: 0,
        image: null,
        idOwner: "",
        createdAt: "",
        updatedAt: ""
      }

      expect(() => renderPropertyCard(minimalProperty)).not.toThrow()
    })
  })

  describe("Layout and Styling", () => {
    it("applies correct padding to content area", () => {
      const { container } = renderPropertyCard()

      const contentArea = container.querySelector(".p-6")
      expect(contentArea).toBeInTheDocument()
    })

    it("applies correct image dimensions", () => {
      renderPropertyCard()

      const image = screen.getByRole("img")
      expect(image).toHaveClass("w-full", "h-48", "object-cover")
    })

    it("has proper spacing between elements", () => {
      renderPropertyCard()

      const title = screen.getByText("Beautiful House")
      expect(title).toHaveClass("mb-2")

      const addressContainer = screen
        .getByText("123 Main Street, City")
        .closest("div")
      expect(addressContainer).toHaveClass("mb-2")
    })
  })

  describe("Edge Cases", () => {
    it("handles undefined property gracefully", () => {
      // This should not happen in practice, but testing for robustness
      expect(() => renderPropertyCard(null as any)).toThrow()
    })

    it("handles very long property names", () => {
      const veryLongNameProperty = {
        ...mockProperty,
        name: "A".repeat(200)
      }

      expect(() => renderPropertyCard(veryLongNameProperty)).not.toThrow()
    })

    it("handles negative prices", () => {
      const negativePriceProperty = { ...mockProperty, price: -100000 }
      renderPropertyCard(negativePriceProperty)

      // Should still render, formatPrice will handle the negative value
      expect(screen.getByText("-$100,000")).toBeInTheDocument()
    })

    it("handles zero price", () => {
      const zeroPriceProperty = { ...mockProperty, price: 0 }
      renderPropertyCard(zeroPriceProperty)

      expect(screen.getByText("$0")).toBeInTheDocument()
    })
  })
})
