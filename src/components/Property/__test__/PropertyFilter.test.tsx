import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { BrowserRouter } from "react-router-dom"
import { PropertyFilter } from "../PropertyFilter"

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
  Filter: ({ className }: any) => (
    <div className={`lucide-filter ${className}`} data-testid="filter-icon" />
  ),
  Search: ({ className }: any) => (
    <div className={`lucide-search ${className}`} data-testid="search-icon" />
  ),
  X: ({ className }: any) => (
    <div className={`lucide-x ${className}`} data-testid="x-icon" />
  )
}))

// Mock UI components
vi.mock("../UI/Button/Button", () => ({
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

vi.mock("../UI/Input/Input", () => ({
  InputComponent: ({ value, onChange, label, placeholder, type }: any) => {
    const id = `input-${label?.toLowerCase().replace(/\s+/g, "-")}`
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={id}>
          {label}
        </label>
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500  "
          data-testid="input-component"
          id={id}
        />
      </div>
    )
  }
}))

// Helper function to get inputs by label text
const getInputByLabel = (labelText: string) => screen.getByLabelText(labelText) as HTMLInputElement

describe("PropertyFilter", () => {
  const mockOnFilterChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderPropertyFilter = (loading = false) => {
    return render(
      <BrowserRouter>
        <PropertyFilter onFilterChange={mockOnFilterChange} loading={loading} />
      </BrowserRouter>
    )
  }

  describe("Initial Rendering", () => {
    it("renders filter component with title and icon", () => {
      renderPropertyFilter()

      expect(screen.getByText("Filter Properties")).toBeInTheDocument()
      expect(screen.getByTestId("filter-icon")).toBeInTheDocument()
    })

    it("renders basic input fields", () => {
      renderPropertyFilter()

      expect(screen.getByText("Property Name")).toBeInTheDocument()
      expect(screen.getByText("Address")).toBeInTheDocument()
      expect(screen.getByText("Owner ID")).toBeInTheDocument()
    })

    it("renders More Filters button", () => {
      renderPropertyFilter()

      expect(screen.getByText("More Filters")).toBeInTheDocument()
    })

    it("renders Owners List button", () => {
      renderPropertyFilter()

      expect(screen.getByText("Owners List")).toBeInTheDocument()
    })

    it("renders Search button", () => {
      renderPropertyFilter()

      expect(screen.getByText("Search")).toBeInTheDocument()
      expect(screen.getByTestId("search-icon")).toBeInTheDocument()
    })

    it("applies correct styling to main container", () => {
      const { container } = renderPropertyFilter()

      const mainContainer = container.firstChild
      expect(mainContainer).toHaveClass(
        "bg-white",
        "rounded-lg",
        "shadow-md",
        "p-6",
        "mb-6"
      )
    })
  })

  describe("Filter Expansion", () => {
    it("does not show expanded filters initially", () => {
      renderPropertyFilter()

      expect(screen.queryByText("Min Price")).not.toBeInTheDocument()
      expect(screen.queryByText("Max Price")).not.toBeInTheDocument()
    })

    it("shows expanded filters when More Filters is clicked", () => {
      renderPropertyFilter()

      const moreFiltersButton = screen.getByText("More Filters")
      fireEvent.click(moreFiltersButton)

      expect(screen.getByText("Min Price")).toBeInTheDocument()
      expect(screen.getByText("Max Price")).toBeInTheDocument()
    })

    it("changes button text when expanded", () => {
      renderPropertyFilter()

      const moreFiltersButton = screen.getByText("More Filters")
      fireEvent.click(moreFiltersButton)

      expect(screen.getByText("Less Filters")).toBeInTheDocument()
      expect(screen.queryByText("More Filters")).not.toBeInTheDocument()
    })

    it("can toggle between expanded and collapsed states", () => {
      renderPropertyFilter()

      const moreFiltersButton = screen.getByText("More Filters")

      // Expand
      fireEvent.click(moreFiltersButton)
      expect(screen.getByText("Min Price")).toBeInTheDocument()

      // Collapse
      const lessFiltersButton = screen.getByText("Less Filters")
      fireEvent.click(lessFiltersButton)
      expect(screen.queryByText("Min Price")).not.toBeInTheDocument()
    })
  })

  describe("Input Field Interactions", () => {
    it("updates property name filter", () => {
      renderPropertyFilter()

      const nameInput = getInputByLabel("Property Name")
      fireEvent.change(nameInput, { target: { value: "Beautiful House" } })

      expect(nameInput).toHaveValue("Beautiful House")
    })

    it("updates address filter", () => {
      renderPropertyFilter()

      const addressInput = getInputByLabel("Address")
      fireEvent.change(addressInput, { target: { value: "123 Main St" } })

      expect(addressInput).toHaveValue("123 Main St")
    })

    it("updates owner ID filter", () => {
      renderPropertyFilter()

      const ownerInput = getInputByLabel("Owner ID")
      fireEvent.change(ownerInput, { target: { value: "owner-123" } })

      expect(ownerInput).toHaveValue("owner-123")
    })

    it("updates min price filter when expanded", () => {
      renderPropertyFilter()

      // Expand filters
      fireEvent.click(screen.getByText("More Filters"))

      const minPriceInput = getInputByLabel("Min Price")
      fireEvent.change(minPriceInput, { target: { value: "100000" } })

      expect(minPriceInput).toHaveValue(100000)
    })

    it("updates max price filter when expanded", () => {
      renderPropertyFilter()

      // Expand filters
      fireEvent.click(screen.getByText("More Filters"))

      const maxPriceInput = getInputByLabel("Max Price")
      fireEvent.change(maxPriceInput, { target: { value: "500000" } })

      expect(maxPriceInput).toHaveValue(500000)
    })
  })

  describe("Search Functionality", () => {
    it("calls onFilterChange when Search button is clicked", () => {
      renderPropertyFilter()

      const searchButton = screen.getByText("Search")
      fireEvent.click(searchButton)

      expect(mockOnFilterChange).toHaveBeenCalledTimes(1)
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        page: 1,
        pageSize: 12
      })
    })

    it("includes filter values when searching", () => {
      renderPropertyFilter()

      // Set some filter values
      const nameInput = getInputByLabel("Property Name")
      const addressInput = getInputByLabel("Address")

      fireEvent.change(nameInput, { target: { value: "House" } })
      fireEvent.change(addressInput, { target: { value: "Main St" } })

      const searchButton = screen.getByText("Search")
      fireEvent.click(searchButton)

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        page: 1,
        pageSize: 12,
        name: "House",
        address: "Main St"
      })
    })

    it("includes price filters when expanded and set", () => {
      renderPropertyFilter()

      // Expand filters
      fireEvent.click(screen.getByText("More Filters"))

      // Set price filters
      const minPriceInput = getInputByLabel("Min Price")
      const maxPriceInput = getInputByLabel("Max Price")

      fireEvent.change(minPriceInput, { target: { value: "100000" } })
      fireEvent.change(maxPriceInput, { target: { value: "500000" } })

      const searchButton = screen.getByText("Search")
      fireEvent.click(searchButton)

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        page: 1,
        pageSize: 12,
        minPrice: "100000",
        maxPrice: "500000"
      })
    })

    it("shows loading state when searching", () => {
      renderPropertyFilter(true)

      expect(screen.getByText("Searching...")).toBeInTheDocument()
      expect(screen.queryByText("Search")).not.toBeInTheDocument()
    })

    it("disables Search button when loading", () => {
      renderPropertyFilter(true)

      const searchButton = screen.getByText("Searching...")
      expect(searchButton).toBeDisabled()
    })
  })

  describe("Clear Functionality", () => {
    it("does not show Clear button when no filters are active", () => {
      renderPropertyFilter()

      expect(screen.queryByText("Clear")).not.toBeInTheDocument()
    })

    it("shows Clear button when filters are active", () => {
      renderPropertyFilter()

      // Set a filter
      const nameInput = getInputByLabel("Property Name")
      fireEvent.change(nameInput, { target: { value: "House" } })

      expect(screen.getByText("Clear")).toBeInTheDocument()
      expect(screen.getByTestId("x-icon")).toBeInTheDocument()
    })

    it("shows active filters indicator", () => {
      renderPropertyFilter()

      // Set a filter
      const nameInput = getInputByLabel("Property Name")
      fireEvent.change(nameInput, { target: { value: "House" } })

      expect(screen.getByText("Active filters applied")).toBeInTheDocument()
    })

    it("clears all filters when Clear button is clicked", () => {
      renderPropertyFilter()

      // Set some filters
      const nameInput = getInputByLabel("Property Name")
      const addressInput = getInputByLabel("Address")

      fireEvent.change(nameInput, { target: { value: "House" } })
      fireEvent.change(addressInput, { target: { value: "Main St" } })

      // Clear filters
      const clearButton = screen.getByText("Clear")
      fireEvent.click(clearButton)

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        page: 1,
        pageSize: 12
      })
    })

    it("clears input values after clearing filters", () => {
      renderPropertyFilter()

      // Set a filter
      const nameInput = getInputByLabel("Property Name")
      fireEvent.change(nameInput, { target: { value: "House" } })

      // Clear filters
      const clearButton = screen.getByText("Clear")
      fireEvent.click(clearButton)

      expect(nameInput).toHaveValue("")
    })

    it("disables Clear button when loading", () => {
      const { rerender } = renderPropertyFilter()

      // Set a filter to show Clear button
      const nameInput = getInputByLabel("Property Name")
      fireEvent.change(nameInput, { target: { value: "House" } })

      // Re-render with loading state
      rerender(
        <BrowserRouter>
          <PropertyFilter onFilterChange={mockOnFilterChange} loading={true} />
        </BrowserRouter>
      )

      const clearButton = screen.getByText("Clear")
      expect(clearButton).toBeDisabled()
    })
  })

  describe("Navigation", () => {
    it("navigates to owners list when Owners List button is clicked", () => {
      renderPropertyFilter()

      const ownersListButton = screen.getByText("Owners List")
      fireEvent.click(ownersListButton)

      expect(mockNavigate).toHaveBeenCalledWith("/ownerlist")
    })
  })

  describe("Active Filters Detection", () => {
    it("detects name filter as active", () => {
      renderPropertyFilter()

      const nameInput = getInputByLabel("Property Name")
      fireEvent.change(nameInput, { target: { value: "House" } })

      expect(screen.getByText("Clear")).toBeInTheDocument()
    })

    it("detects address filter as active", () => {
      renderPropertyFilter()

      const addressInput = getInputByLabel("Address")
      fireEvent.change(addressInput, { target: { value: "Main St" } })

      expect(screen.getByText("Clear")).toBeInTheDocument()
    })

    it("detects owner ID filter as active", () => {
      renderPropertyFilter()

      const ownerInput = getInputByLabel("Owner ID")
      fireEvent.change(ownerInput, { target: { value: "owner-123" } })

      expect(screen.getByText("Clear")).toBeInTheDocument()
    })

    it("detects price filters as active when expanded", () => {
      renderPropertyFilter()

      // Expand filters
      fireEvent.click(screen.getByText("More Filters"))

      const minPriceInput = getInputByLabel("Min Price")
      fireEvent.change(minPriceInput, { target: { value: "100000" } })

      expect(screen.getByText("Clear")).toBeInTheDocument()
    })

    it("detects multiple active filters", () => {
      renderPropertyFilter()

      // Expand filters
      fireEvent.click(screen.getByText("More Filters"))

      // Set multiple filters
      const nameInput = getInputByLabel("Property Name")
      const minPriceInput = getInputByLabel("Min Price")

      fireEvent.change(nameInput, { target: { value: "House" } })
      fireEvent.change(minPriceInput, { target: { value: "100000" } })

      expect(screen.getByText("Clear")).toBeInTheDocument()
      expect(screen.getByText("Active filters applied")).toBeInTheDocument()
    })
  })

  describe("Grid Layout", () => {
    it("uses responsive grid for input fields", () => {
      const { container } = renderPropertyFilter()

      const gridContainer = container.querySelector(
        ".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3"
      )
      expect(gridContainer).toBeInTheDocument()
    })

    it("maintains proper spacing between elements", () => {
      const { container } = renderPropertyFilter()

      const gapContainer = container.querySelector(".gap-4")
      expect(gapContainer).toBeInTheDocument()
    })
  })

  describe("Accessibility", () => {
    it("has proper heading structure", () => {
      renderPropertyFilter()

      const heading = screen.getByText("Filter Properties")
      expect(heading.tagName).toBe("H3")
      expect(heading).toHaveClass("text-lg", "font-semibold", "text-gray-900")
    })

    it("all buttons are accessible", () => {
      renderPropertyFilter()

      const buttons = screen.getAllByRole("button")
      buttons.forEach(button => {
        expect(button).toBeEnabled()
      })
    })

    it("inputs have proper labels", () => {
      renderPropertyFilter()

      expect(screen.getByText("Property Name")).toBeInTheDocument()
      expect(screen.getByText("Address")).toBeInTheDocument()
      expect(screen.getByText("Owner ID")).toBeInTheDocument()
    })
  })

  describe("Edge Cases", () => {
    it("handles empty string values correctly", () => {
      renderPropertyFilter()

      const nameInput = getInputByLabel("Property Name")
      fireEvent.change(nameInput, { target: { value: "" } })

      const searchButton = screen.getByText("Search")
      fireEvent.click(searchButton)

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        page: 1,
        pageSize: 12
      })
    })

    it("handles whitespace-only values", () => {
      renderPropertyFilter()

      const nameInput = getInputByLabel("Property Name")
      fireEvent.change(nameInput, { target: { value: "   " } })

      const searchButton = screen.getByText("Search")
      fireEvent.click(searchButton)

      // Should treat whitespace as a value
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        page: 1,
        pageSize: 12,
        name: "   "
      })
    })

    it("handles special characters in inputs", () => {
      renderPropertyFilter()

      const nameInput = getInputByLabel("Property Name")
      fireEvent.change(nameInput, { target: { value: "House & Co." } })

      const searchButton = screen.getByText("Search")
      fireEvent.click(searchButton)

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        page: 1,
        pageSize: 12,
        name: "House & Co."
      })
    })

    it("handles numeric strings in text fields", () => {
      renderPropertyFilter()

      const nameInput = getInputByLabel("Property Name")
      fireEvent.change(nameInput, { target: { value: "12345" } })

      const searchButton = screen.getByText("Search")
      fireEvent.click(searchButton)

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        page: 1,
        pageSize: 12,
        name: "12345"
      })
    })
  })

  describe("Multiple Interactions", () => {
    it("can handle multiple filter changes and searches", () => {
      renderPropertyFilter()

      // First search
      const nameInput = getInputByLabel("Property Name")
      fireEvent.change(nameInput, { target: { value: "House" } })
      fireEvent.click(screen.getByText("Search"))

      // Second search with different filters
      fireEvent.change(nameInput, { target: { value: "Apartment" } })
      const addressInput = getInputByLabel("Address")
      fireEvent.change(addressInput, { target: { value: "Main St" } })
      fireEvent.click(screen.getByText("Search"))

      expect(mockOnFilterChange).toHaveBeenCalledTimes(2)
      expect(mockOnFilterChange).toHaveBeenLastCalledWith({
        page: 1,
        pageSize: 12,
        name: "Apartment",
        address: "Main St"
      })
    })

    it("can toggle filters expansion multiple times", () => {
      renderPropertyFilter()

      const toggleButton = screen.getByText("More Filters")

      // Expand and collapse multiple times
      fireEvent.click(toggleButton)
      expect(screen.getByText("Min Price")).toBeInTheDocument()

      fireEvent.click(screen.getByText("Less Filters"))
      expect(screen.queryByText("Min Price")).not.toBeInTheDocument()

      fireEvent.click(screen.getByText("More Filters"))
      expect(screen.getByText("Min Price")).toBeInTheDocument()
    })
  })
})
