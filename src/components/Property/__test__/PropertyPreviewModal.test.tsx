import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import PropertyPreviewModal from "../PropertyPreviewModal"
import type { Property } from "@/types/Property"
import type { PropertyPreviewData } from "../types"

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Calendar: ({ className }: any) => (
    <div
      className={`lucide-calendar ${className}`}
      data-testid="calendar-icon"
    />
  ),
  CheckCircle: ({ className }: any) => (
    <div
      className={`lucide-check-circle ${className}`}
      data-testid="check-circle-icon"
    />
  ),
  DollarSign: ({ className }: any) => (
    <div
      className={`lucide-dollar-sign ${className}`}
      data-testid="dollar-sign-icon"
    />
  ),
  Eye: ({ className }: any) => (
    <div className={`lucide-eye ${className}`} data-testid="eye-icon" />
  ),
  MapPin: ({ className }: any) => (
    <div className={`lucide-map-pin ${className}`} data-testid="map-pin-icon" />
  ),
  User: ({ className }: any) => (
    <div className={`lucide-user ${className}`} data-testid="user-icon" />
  )
}))

// Mock ButtonComponent
vi.mock("../../UI/Button/Button", () => ({
  ButtonComponent: ({ children, onClick, className, isDisabled }: any) => (
    <button
      onClick={onClick}
      className={className}
      disabled={isDisabled}
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

// Mock window.location
Object.defineProperty(window, "location", {
  value: {
    href: ""
  },
  writable: true
})

describe("PropertyPreviewModal", () => {
  const mockPropertyData: PropertyPreviewData = {
    name: "Beautiful House",
    address: "123 Main Street",
    price: 500000,
    image: "https://example.com/house.jpg",
    ownerName: "John Doe"
  }

  const mockCreatedProperty: Property = {
    id: "property-123",
    name: "Beautiful House",
    address: "123 Main Street",
    price: 500000,
    image: "https://example.com/house.jpg",
    idOwner: "owner-123",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  }

  const mockOnClose = vi.fn()
  const mockOnConfirm = vi.fn()
  const mockOnGoHome = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    window.location.href = ""
  })

  const renderPropertyPreviewModal = (props: any = {}) => {
    const defaultProps = {
      isOpen: true,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
      onGoHome: mockOnGoHome,
      loading: false,
      mode: "preview" as const,
      propertyData: mockPropertyData,
      ...props
    }

    return render(<PropertyPreviewModal {...defaultProps} />)
  }

  describe("Conditional Rendering", () => {
    it("renders nothing when isOpen is false", () => {
      const { container } = renderPropertyPreviewModal({ isOpen: false })
      expect(container.firstChild).toBeNull()
    })

    it("renders nothing when no display data is available", () => {
      const { container } = renderPropertyPreviewModal({
        propertyData: null,
        createdProperty: null
      })
      expect(container.firstChild).toBeNull()
    })

    it("renders modal when isOpen is true and data exists", () => {
      renderPropertyPreviewModal()
      expect(screen.getByText("Property Preview")).toBeInTheDocument()
    })
  })

  describe("Preview Mode", () => {
    it("renders preview mode correctly", () => {
      renderPropertyPreviewModal({ mode: "preview" })

      expect(screen.getByText("Property Preview")).toBeInTheDocument()
      expect(screen.getByTestId("eye-icon")).toBeInTheDocument()
      expect(screen.queryByTestId("check-circle-icon")).not.toBeInTheDocument()
    })

    it("displays property data in preview mode", () => {
      renderPropertyPreviewModal({ mode: "preview" })

      expect(screen.getByText("Beautiful House")).toBeInTheDocument()
      expect(screen.getByText("123 Main Street")).toBeInTheDocument()
      expect(screen.getByText("$500,000")).toBeInTheDocument()
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    })

    it("renders preview mode action buttons", () => {
      renderPropertyPreviewModal({ mode: "preview" })

      expect(screen.getByText("Cancel")).toBeInTheDocument()
      expect(screen.getByText("Confirm & Create Property")).toBeInTheDocument()
    })

    it("calls onClose when Cancel is clicked in preview mode", () => {
      renderPropertyPreviewModal({ mode: "preview" })

      const cancelButton = screen.getByText("Cancel")
      fireEvent.click(cancelButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it("calls onConfirm when Confirm button is clicked in preview mode", () => {
      renderPropertyPreviewModal({ mode: "preview" })

      const confirmButton = screen.getByText("Confirm & Create Property")
      fireEvent.click(confirmButton)

      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    })

    it("shows loading state in preview mode", () => {
      renderPropertyPreviewModal({ mode: "preview", loading: true })

      expect(screen.getByText("Creating...")).toBeInTheDocument()
      expect(
        screen.queryByText("Confirm & Create Property")
      ).not.toBeInTheDocument()
    })

    it("disables buttons when loading in preview mode", () => {
      renderPropertyPreviewModal({ mode: "preview", loading: true })

      const actionButtons = screen
        .getAllByTestId("button-component")
        .filter(
          btn =>
            btn.textContent === "Cancel" || btn.textContent === "Creating..."
        )
      actionButtons.forEach(button => {
        expect(button).toBeDisabled()
      })
    })
  })

  describe("Confirmation Mode", () => {
    it("renders confirmation mode correctly", () => {
      renderPropertyPreviewModal({
        mode: "confirmation",
        createdProperty: mockCreatedProperty
      })

      expect(
        screen.getByText("Property Created Successfully!")
      ).toBeInTheDocument()
      expect(screen.getByTestId("check-circle-icon")).toBeInTheDocument()
      expect(screen.queryByTestId("eye-icon")).not.toBeInTheDocument()
    })

    it("displays created property data in confirmation mode", () => {
      renderPropertyPreviewModal({
        mode: "confirmation",
        createdProperty: mockCreatedProperty
      })

      expect(screen.getByText("Beautiful House")).toBeInTheDocument()
      expect(screen.getByText("123 Main Street")).toBeInTheDocument()
      expect(screen.getByText("$500,000")).toBeInTheDocument()
    })

    it("shows additional info in confirmation mode", () => {
      renderPropertyPreviewModal({
        mode: "confirmation",
        createdProperty: mockCreatedProperty
      })

      expect(screen.getByText("Dec 31, 2022")).toBeInTheDocument()
      expect(screen.getByText("property-123")).toBeInTheDocument()
    })

    it("renders confirmation mode action buttons", () => {
      renderPropertyPreviewModal({
        mode: "confirmation",
        createdProperty: mockCreatedProperty
      })

      expect(screen.getByText("Close")).toBeInTheDocument()
      expect(screen.getByText("Go to Home")).toBeInTheDocument()
      expect(screen.getByText("View Property Details")).toBeInTheDocument()
    })

    it("calls onClose when Close is clicked in confirmation mode", () => {
      renderPropertyPreviewModal({
        mode: "confirmation",
        createdProperty: mockCreatedProperty
      })

      const closeButton = screen.getByText("Close")
      fireEvent.click(closeButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it("calls onGoHome when Go to Home is clicked", () => {
      renderPropertyPreviewModal({
        mode: "confirmation",
        createdProperty: mockCreatedProperty
      })

      const goHomeButton = screen.getByText("Go to Home")
      fireEvent.click(goHomeButton)

      expect(mockOnGoHome).toHaveBeenCalledTimes(1)
    })

    it("navigates to property details when View Property Details is clicked", () => {
      renderPropertyPreviewModal({
        mode: "confirmation",
        createdProperty: mockCreatedProperty
      })

      const viewDetailsButton = screen.getByText("View Property Details")
      fireEvent.click(viewDetailsButton)

      expect(window.location.href).toBe("/properties/property-123")
    })

    it("does not show View Property Details button without createdProperty", () => {
      renderPropertyPreviewModal({
        mode: "confirmation",
        createdProperty: null
      })

      expect(
        screen.queryByText("View Property Details")
      ).not.toBeInTheDocument()
    })
  })

  describe("Modal Structure", () => {
    it("renders modal overlay with correct styling", () => {
      const { container } = renderPropertyPreviewModal()

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
      renderPropertyPreviewModal()

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
      renderPropertyPreviewModal()

      const header = screen.getByText("Property Preview").closest(".sticky")
      expect(header).toHaveClass(
        "sticky",
        "top-0",
        "bg-white",
        "border-b",
        "border-gray-200",
        "p-6"
      )
    })

    it("renders close button in header", () => {
      renderPropertyPreviewModal()

      const closeButtons = screen.getAllByTestId("button-component")
      const headerCloseButton = closeButtons.find(
        btn => btn.textContent === "✕"
      )

      expect(headerCloseButton).toBeInTheDocument()
    })
  })

  describe("Property Image", () => {
    it("renders property image with correct attributes", () => {
      renderPropertyPreviewModal()

      const image = screen.getByRole("img")
      expect(image).toHaveAttribute("src", "https://example.com/house.jpg")
      expect(image).toHaveAttribute("alt", "Beautiful House")
      expect(image).toHaveClass("w-full", "h-64", "object-cover", "rounded-lg")
    })

    it("uses placeholder when image is null", () => {
      const dataWithoutImage = { ...mockPropertyData, image: null }
      renderPropertyPreviewModal({ propertyData: dataWithoutImage })

      const image = screen.getByRole("img")
      expect(image).toHaveAttribute("src", "/placeholder-property.svg")
    })

    it("handles image error by falling back to placeholder", () => {
      renderPropertyPreviewModal()

      const image = screen.getByRole("img") as HTMLImageElement
      fireEvent.error(image)

      expect(image.src).toContain("/placeholder-property.svg")
    })
  })

  describe("Property Information Display", () => {
    it("renders property name correctly", () => {
      renderPropertyPreviewModal()

      const name = screen.getByText("Beautiful House")
      expect(name).toHaveClass("text-3xl", "font-bold", "text-gray-900", "mb-2")
    })

    it("renders formatted price with dollar sign icon", () => {
      renderPropertyPreviewModal()

      expect(screen.getByText("$500,000")).toBeInTheDocument()
      expect(screen.getByTestId("dollar-sign-icon")).toBeInTheDocument()
    })

    it("renders address with map pin icon", () => {
      renderPropertyPreviewModal()

      expect(screen.getByText("123 Main Street")).toBeInTheDocument()
      expect(screen.getByTestId("map-pin-icon")).toBeInTheDocument()
    })

    it("renders owner name with user icon", () => {
      renderPropertyPreviewModal()

      expect(screen.getByText("John Doe")).toBeInTheDocument()
      expect(screen.getByTestId("user-icon")).toBeInTheDocument()
    })

    it("uses unknown owner when owner name is not provided", () => {
      renderPropertyPreviewModal({
        mode: "confirmation",
        createdProperty: mockCreatedProperty,
        propertyData: { ...mockPropertyData, ownerName: undefined }
      })

      expect(screen.getByText("Unknown Owner")).toBeInTheDocument()
    })
  })

  describe("Icons Display", () => {
    it("renders all required icons in preview mode", () => {
      renderPropertyPreviewModal({ mode: "preview" })

      expect(screen.getByTestId("eye-icon")).toBeInTheDocument()
      expect(screen.getByTestId("dollar-sign-icon")).toBeInTheDocument()
      expect(screen.getByTestId("map-pin-icon")).toBeInTheDocument()
      expect(screen.getByTestId("user-icon")).toBeInTheDocument()
    })

    it("renders all required icons in confirmation mode", () => {
      renderPropertyPreviewModal({
        mode: "confirmation",
        createdProperty: mockCreatedProperty
      })

      expect(screen.getByTestId("check-circle-icon")).toBeInTheDocument()
      expect(screen.getByTestId("dollar-sign-icon")).toBeInTheDocument()
      expect(screen.getByTestId("map-pin-icon")).toBeInTheDocument()
      expect(screen.getByTestId("user-icon")).toBeInTheDocument()
      expect(screen.getAllByTestId("calendar-icon")).toHaveLength(2)
    })
  })

  describe("Layout and Grid", () => {
    it("uses responsive grid layout", () => {
      const { container } = renderPropertyPreviewModal()

      const gridContainer = container.querySelector(
        ".grid.grid-cols-1.md\\:grid-cols-2"
      )
      expect(gridContainer).toBeInTheDocument()
    })

    it("has proper spacing between sections", () => {
      const { container } = renderPropertyPreviewModal()

      const spacedSection = container.querySelector(".space-y-6")
      expect(spacedSection).toBeInTheDocument()
    })

    it("has border separator before actions", () => {
      const { container } = renderPropertyPreviewModal()

      const borderSection = container.querySelector(
        ".pt-6.border-t.border-gray-200"
      )
      expect(borderSection).toBeInTheDocument()
    })
  })

  describe("Helper Function Integration", () => {
    it("calls formatPrice with correct value", () => {
      renderPropertyPreviewModal()

      // Check that the formatted price appears in the DOM
      expect(screen.getByText("$500,000")).toBeInTheDocument()
    })

    it("calls formatDate in confirmation mode", () => {
      renderPropertyPreviewModal({
        mode: "confirmation",
        createdProperty: mockCreatedProperty
      })

      // Check that the formatted date appears in the DOM
      expect(screen.getByText("Dec 31, 2022")).toBeInTheDocument()
    })
  })

  describe("Accessibility", () => {
    it("has proper semantic structure", () => {
      renderPropertyPreviewModal()

      const mainHeading = screen.getByText("Property Preview")
      expect(mainHeading.tagName).toBe("H2")

      const propertyName = screen.getByText("Beautiful House")
      expect(propertyName.tagName).toBe("H3")

      const addressHeading = screen.getByText("Address")
      expect(addressHeading.tagName).toBe("H4")
    })

    it("buttons are accessible", () => {
      renderPropertyPreviewModal()

      const buttons = screen.getAllByRole("button")
      buttons.forEach(button => {
        expect(button).toBeInTheDocument()
      })
    })
  })

  describe("Different Data Scenarios", () => {
    it("handles different property data", () => {
      const differentData: PropertyPreviewData = {
        name: "Luxury Apartment",
        address: "456 Oak Avenue",
        price: 750000,
        image: "https://example.com/apartment.jpg",
        ownerName: "Jane Smith"
      }

      renderPropertyPreviewModal({ propertyData: differentData })

      expect(screen.getByText("Luxury Apartment")).toBeInTheDocument()
      expect(screen.getByText("456 Oak Avenue")).toBeInTheDocument()
      expect(screen.getByText("$750,000")).toBeInTheDocument()
      expect(screen.getByText("Jane Smith")).toBeInTheDocument()
    })

    it("handles empty/minimal data", () => {
      const minimalData: PropertyPreviewData = {
        name: "",
        address: "",
        price: 0,
        image: "",
        ownerName: ""
      }

      expect(() =>
        renderPropertyPreviewModal({ propertyData: minimalData })
      ).not.toThrow()
    })

    it("handles special characters in data", () => {
      const specialData: PropertyPreviewData = {
        name: 'Property & Co. - "Luxury" Home!',
        address: "123 Main St. #A, City & State",
        price: 500000,
        image: "",
        ownerName: "John & Jane Doe"
      }

      renderPropertyPreviewModal({ propertyData: specialData })

      expect(
        screen.getByText('Property & Co. - "Luxury" Home!')
      ).toBeInTheDocument()
      expect(
        screen.getByText("123 Main St. #A, City & State")
      ).toBeInTheDocument()
      expect(screen.getByText("John & Jane Doe")).toBeInTheDocument()
    })
  })

  describe("Edge Cases", () => {
    it("handles missing callbacks gracefully", () => {
      expect(() =>
        renderPropertyPreviewModal({
          onClose: undefined,
          onConfirm: undefined,
          onGoHome: undefined
        })
      ).not.toThrow()
    })

    it("handles very large price values", () => {
      const expensiveData = { ...mockPropertyData, price: 99999999 }
      renderPropertyPreviewModal({ propertyData: expensiveData })

      expect(screen.getByText("$99,999,999")).toBeInTheDocument()
    })

    it("handles mode switching", () => {
      const { rerender } = renderPropertyPreviewModal({ mode: "preview" })

      expect(screen.getByText("Property Preview")).toBeInTheDocument()

      rerender(
        <PropertyPreviewModal
          mode="confirmation"
          createdProperty={mockCreatedProperty}
          propertyData={mockPropertyData}
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          onGoHome={mockOnGoHome}
        />
      )

      expect(
        screen.getByText("Property Created Successfully!")
      ).toBeInTheDocument()
    })
  })

  describe("Multiple Interactions", () => {
    it("can handle multiple button clicks", () => {
      renderPropertyPreviewModal({ mode: "preview" })

      const cancelButton = screen.getByText("Cancel")
      const confirmButton = screen.getByText("Confirm & Create Property")

      fireEvent.click(cancelButton)
      fireEvent.click(confirmButton)
      fireEvent.click(cancelButton)

      expect(mockOnClose).toHaveBeenCalledTimes(2)
      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    })

    it("handles header close button clicks", () => {
      renderPropertyPreviewModal()

      const headerCloseButton = screen.getByText("✕")
      fireEvent.click(headerCloseButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })
})
