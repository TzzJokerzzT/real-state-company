import type { Property } from "@/types/Property"
import { fireEvent, render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { PropertyDetails } from "../PropertyDetails"

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Calendar: ({ className }: any) => (
    <div
      className={`lucide-calendar ${className}`}
      data-testid="calendar-icon"
    />
  ),
  DollarSign: ({ className }: any) => (
    <div
      className={`lucide-dollar-sign ${className}`}
      data-testid="dollar-sign-icon"
    />
  ),
  MapPin: ({ className }: any) => (
    <div className={`lucide-map-pin ${className}`} data-testid="map-pin-icon" />
  ),
  User: ({ className }: any) => (
    <div className={`lucide-user ${className}`} data-testid="user-icon" />
  ),
  X: ({ className }: any) => (
    <div className={`lucide-x ${className}`} data-testid="x-icon" />
  )
}))

// Mock ButtonComponent
vi.mock("../UI/Button/Button", () => ({
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

describe("PropertyDetails", () => {
  const mockProperty: Property = {
    id: "1",
    name: "Beautiful House",
    address: "123 Main Street, City",
    price: 500000,
    image: "https://example.com/image.jpg",
    idOwner: "owner-123",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-02T00:00:00Z"
  }

  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderPropertyDetails = (
    property = mockProperty,
    onClose = mockOnClose,
    isOpen = true
  ) => {
    return render(
      <BrowserRouter>
        <PropertyDetails
          property={property}
          onClose={onClose}
          isOpen={isOpen}
        />
      </BrowserRouter>
    )
  }

  describe("Conditional Rendering", () => {
    it("renders nothing when isOpen is false", () => {
      const { container } = renderPropertyDetails(
        mockProperty,
        mockOnClose,
        false
      )
      expect(container.firstChild).toBeNull()
    })

    it("renders nothing when property is null", () => {
      const { container } = renderPropertyDetails(null, mockOnClose, true)
      expect(container.firstChild).toBeNull()
    })

    it("renders modal when isOpen is true and property exists", () => {
      renderPropertyDetails()
      expect(screen.getByText("Property Details")).toBeInTheDocument()
    })
  })

  describe("Modal Structure", () => {
    it("renders modal overlay with correct styling", () => {
      const { container } = renderPropertyDetails()

      const overlay = container.querySelector(".fixed.inset-0")
      expect(overlay).toHaveClass(
        "bg-black",
        "bg-opacity-50",
        "flex",
        "items-center",
        "justify-center",
        "p-4",
        "z-50"
      )
    })

    it("renders modal content with correct structure", () => {
      renderPropertyDetails()

      const modal = document.querySelector(".bg-white.rounded-lg.max-w-2xl")
      expect(modal).toBeInTheDocument()
      expect(modal).toHaveClass(
        "bg-white",
        "rounded-lg",
        "max-w-2xl",
        "w-full",
        "max-h-[90vh]",
        "overflow-y-auto"
      )
    })

    it("renders sticky header", () => {
      renderPropertyDetails()

      const header = screen.getByText("Property Details").closest(".sticky")
      expect(header).toHaveClass(
        "sticky",
        "top-0",
        "bg-white",
        "border-b",
        "border-gray-200",
        "p-6"
      )
    })
  })

  describe("Header Section", () => {
    it("renders title correctly", () => {
      renderPropertyDetails()

      const title = screen.getByText("Property Details")
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass("text-2xl", "font-bold", "text-gray-900")
    })

    it("renders close button with X icon", () => {
      renderPropertyDetails()

      expect(screen.getByTestId("x-icon")).toBeInTheDocument()
    })

    it("calls onClose when close button is clicked", () => {
      renderPropertyDetails()

      // Find the X icon and click its nearest button, supporting both
      // cases where the header uses a ButtonComponent (with data-testid)
      // or a plain native button.
      const xIcon = screen.getByTestId("x-icon")
      const closeButton = xIcon.closest("button")

      expect(closeButton).not.toBeNull()
      if (closeButton) {
        fireEvent.click(closeButton)
        expect(mockOnClose).toHaveBeenCalledTimes(1)
      }
    })
  })

  describe("Property Image", () => {
    it("renders property image with correct attributes", () => {
      renderPropertyDetails()

      const images = screen.getAllByRole("img")
      const mainImage = images.find(
        img => img.getAttribute("alt") === "Beautiful House"
      )

      expect(mainImage).toHaveAttribute("src", "https://example.com/image.jpg")
      expect(mainImage).toHaveClass(
        "w-full",
        "h-64",
        "object-cover",
        "rounded-lg"
      )
    })

    it("uses placeholder when image is null", () => {
      const propertyWithoutImage = { ...mockProperty, image: null }
      renderPropertyDetails(propertyWithoutImage)

      const images = screen.getAllByRole("img")
      const mainImage = images.find(
        img => img.getAttribute("alt") === "Beautiful House"
      )

      expect(mainImage).toHaveAttribute("src", "/placeholder-property.svg")
    })

    it("handles image error by falling back to placeholder", () => {
      renderPropertyDetails()

      const images = screen.getAllByRole("img")
      const mainImage = images.find(
        img => img.getAttribute("alt") === "Beautiful House"
      ) as HTMLImageElement

      fireEvent.error(mainImage)
      expect(mainImage.src).toContain("/placeholder-property.svg")
    })
  })

  describe("Property Information", () => {
    it("renders property name", () => {
      renderPropertyDetails()

      const name = screen.getByText("Beautiful House")
      expect(name).toHaveClass("text-3xl", "font-bold", "text-gray-900", "mb-2")
    })

    it("renders formatted price with dollar sign icon", () => {
      renderPropertyDetails()

      expect(screen.getByText("$500,000")).toBeInTheDocument()
      expect(screen.getByTestId("dollar-sign-icon")).toBeInTheDocument()
    })

    it("renders address with map pin icon", () => {
      renderPropertyDetails()

      expect(screen.getByText("123 Main Street, City")).toBeInTheDocument()
      expect(screen.getByTestId("map-pin-icon")).toBeInTheDocument()
    })

    it("renders owner ID with user icon", () => {
      renderPropertyDetails()

      expect(screen.getByText("owner-123")).toBeInTheDocument()
      expect(screen.getByTestId("user-icon")).toBeInTheDocument()
    })

    it("renders created date", () => {
      renderPropertyDetails()

      expect(screen.getByText("Dec 31, 2022")).toBeInTheDocument()
    })

    it("renders updated date", () => {
      renderPropertyDetails()

      expect(screen.getByText("Jan 1, 2023")).toBeInTheDocument()
    })
  })

  describe("Icons Display", () => {
    it("renders all required icons", () => {
      renderPropertyDetails()

      expect(screen.getByTestId("dollar-sign-icon")).toBeInTheDocument()
      expect(screen.getByTestId("map-pin-icon")).toBeInTheDocument()
      expect(screen.getByTestId("user-icon")).toBeInTheDocument()
      expect(screen.getAllByTestId("calendar-icon")).toHaveLength(2) // Created and Updated dates
      expect(screen.getByTestId("x-icon")).toBeInTheDocument()
    })

    it("applies correct styling to icons", () => {
      renderPropertyDetails()

      const mapPinIcon = screen.getByTestId("map-pin-icon")
      expect(mapPinIcon).toHaveClass(
        "w-5",
        "h-5",
        "text-gray-400",
        "mr-3",
        "mt-0.5",
        "flex-shrink-0"
      )
    })
  })

  describe("Action Buttons", () => {
    it("renders Close button in footer", () => {
      renderPropertyDetails()

      const closeButton = screen.getByText("Close")
      expect(closeButton).toBeInTheDocument()
    })

    it("renders More Details button", () => {
      renderPropertyDetails()

      const moreDetailsButton = screen.getByText("More Details")
      expect(moreDetailsButton).toBeInTheDocument()
    })

    it("calls onClose when footer Close button is clicked", () => {
      renderPropertyDetails()

      const closeButton = screen.getByText("Close")
      fireEvent.click(closeButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it("navigates to property details page when More Details is clicked", () => {
      renderPropertyDetails()

      const moreDetailsButton = screen.getByText("More Details")
      fireEvent.click(moreDetailsButton)

      expect(mockNavigate).toHaveBeenCalledWith("/properties/1")
    })

    it("applies correct styling to action buttons", () => {
      renderPropertyDetails()

      const closeButton = screen.getByText("Close")
      expect(closeButton).toHaveClass(
        "px-6",
        "py-2",
        "border",
        "border-gray-300",
        "text-gray-700",
        "rounded-md",
        "hover:bg-gray-50",
        "transition-colors",
        "duration-200"
      )
    })
  })

  describe("Layout and Grid", () => {
    it("uses responsive grid layout", () => {
      const { container } = renderPropertyDetails()

      const gridContainer = container.querySelector(
        ".grid.grid-cols-1.md\\:grid-cols-2"
      )
      expect(gridContainer).toBeInTheDocument()
    })

    it("has proper spacing between sections", () => {
      const { container } = renderPropertyDetails()

      const spacedSection = container.querySelector(".space-y-6")
      expect(spacedSection).toBeInTheDocument()
    })

    it("has border separator before actions", () => {
      const { container } = renderPropertyDetails()

      const borderSection = container.querySelector(
        ".pt-6.border-t.border-gray-200"
      )
      expect(borderSection).toBeInTheDocument()
    })
  })

  describe("Accessibility", () => {
    it("has proper semantic structure", () => {
      renderPropertyDetails()

      // Main heading
      const mainHeading = screen.getByText("Property Details")
      expect(mainHeading.tagName).toBe("H2")

      // Property name
      const propertyName = screen.getByText("Beautiful House")
      expect(propertyName.tagName).toBe("H3")

      // Section headings
      const addressHeading = screen.getByText("Address")
      expect(addressHeading.tagName).toBe("H4")
    })

    it("buttons are accessible", () => {
      renderPropertyDetails()

      const buttons = screen.getAllByRole("button")
      buttons.forEach(button => {
        expect(button).toBeEnabled()
      })
    })
  })

  describe("Helper Function Integration", () => {
    it("calls formatPrice with correct value", () => {
      renderPropertyDetails()

      // Check that the formatted price appears in the DOM
      expect(screen.getByText("$500,000")).toBeInTheDocument()
    })

    it("calls formatDate with correct values", () => {
      renderPropertyDetails()

      // Check that the formatted dates appear in the DOM
      expect(screen.getByText("Dec 31, 2022")).toBeInTheDocument()
      expect(screen.getByText("Jan 1, 2023")).toBeInTheDocument()
    })
  })

  describe("Different Property Data", () => {
    it("handles property with different values", () => {
      const differentProperty: Property = {
        id: "2",
        name: "Luxury Apartment",
        address: "456 Oak Avenue, Downtown",
        price: 750000,
        image: "https://example.com/apartment.jpg",
        idOwner: "owner-456",
        createdAt: "2023-02-01T00:00:00Z",
        updatedAt: "2023-02-02T00:00:00Z"
      }

      renderPropertyDetails(differentProperty)

      expect(screen.getByText("Luxury Apartment")).toBeInTheDocument()
      expect(screen.getByText("456 Oak Avenue, Downtown")).toBeInTheDocument()
      expect(screen.getByText("$750,000")).toBeInTheDocument()
      expect(screen.getByText("owner-456")).toBeInTheDocument()
    })

    it("handles property with empty/null image", () => {
      const propertyWithoutImage = { ...mockProperty, image: "" }
      renderPropertyDetails(propertyWithoutImage)

      const images = screen.getAllByRole("img")
      const mainImage = images.find(
        img => img.getAttribute("alt") === "Beautiful House"
      )
      expect(mainImage).toHaveAttribute("src", "/placeholder-property.svg")
    })

    it("handles property with special characters", () => {
      const specialProperty = {
        ...mockProperty,
        name: 'Property & Co. - "Luxury" Home!',
        address: "123 Main St. #A, City & State"
      }

      renderPropertyDetails(specialProperty)

      expect(
        screen.getByText('Property & Co. - "Luxury" Home!')
      ).toBeInTheDocument()
      expect(
        screen.getByText("123 Main St. #A, City & State")
      ).toBeInTheDocument()
    })
  })

  describe("Multiple Interactions", () => {
    it("can handle multiple button clicks", () => {
      renderPropertyDetails()

      const closeButton = screen.getByText("Close")
      const moreDetailsButton = screen.getByText("More Details")

      fireEvent.click(closeButton)
      fireEvent.click(moreDetailsButton)
      fireEvent.click(closeButton)

      expect(mockOnClose).toHaveBeenCalledTimes(2)
      expect(mockNavigate).toHaveBeenCalledTimes(1)
    })
  })

  describe("Edge Cases", () => {
    it("handles property with minimal data", () => {
      const minimalProperty: Property = {
        id: "",
        name: "",
        address: "",
        price: 0,
        image: null,
        idOwner: "",
        createdAt: "",
        updatedAt: ""
      }

      expect(() => renderPropertyDetails(minimalProperty)).not.toThrow()
    })

    it("handles very large price values", () => {
      const expensiveProperty = { ...mockProperty, price: 99999999 }
      renderPropertyDetails(expensiveProperty)

      expect(screen.getByText("$99,999,999")).toBeInTheDocument()
    })

    it("handles navigation with empty property id", () => {
      const propertyWithoutId = { ...mockProperty, id: "" }
      renderPropertyDetails(propertyWithoutId)

      const moreDetailsButton = screen.getByText("More Details")
      fireEvent.click(moreDetailsButton)

      expect(mockNavigate).toHaveBeenCalledWith("/properties/")
    })
  })
})
