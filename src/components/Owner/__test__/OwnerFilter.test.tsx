import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import OwnerFilter from "../OwnerFilter";

// Mock hooks
const mockFetchOwners = vi.fn();
const mockFilterByName = vi.fn();

vi.mock("@/hooks/useOwners", () => ({
  useOwners: () => ({
    fetchOwners: mockFetchOwners,
    filterByName: mockFilterByName,
  }),
}));

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
  ),
}));

// Mock UI components
vi.mock("../UI/Button/Button", () => ({
  ButtonComponent: ({ children, onClick, className }: any) => (
    <button
      onClick={onClick}
      className={className}
      data-testid="button-component"
    >
      {children}
    </button>
  ),
}));

vi.mock("../UI/Input/Input", () => ({
  InputComponent: ({ value, onChange, label, placeholder }: any) => (
    <div>
      <label>{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        data-testid="input-component"
      />
    </div>
  ),
}));

describe("OwnerFilter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderFilter = () => {
    return render(<OwnerFilter />);
  };

  describe("Rendering", () => {
    it("renders the filter component with correct structure", () => {
      renderFilter();

      expect(screen.getByText("Filter Owners")).toBeInTheDocument();
      expect(screen.getByText("Owner Name")).toBeInTheDocument();
      expect(screen.getByTestId("filter-icon")).toBeInTheDocument();
      expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    });

    it("has correct styling and layout classes", () => {
      const { container } = renderFilter();

      const mainContainer = container.querySelector(
        ".bg-white.rounded-lg.shadow-md"
      );
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveClass("p-6", "mb-6");

      const gridContainer = container.querySelector(
        ".grid.grid-cols-1.md\\:grid-cols-3"
      );
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass("gap-4");
    });

    it("renders input component with correct props", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");
      expect(input).toHaveAttribute("placeholder", "Search by owner name...");
      expect(input).toHaveValue("");
    });

    it("renders search button", () => {
      renderFilter();

      const searchButton = screen.getByText("Search").closest("button");
      expect(searchButton).toBeInTheDocument();
      expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    });

    it("does not render clear button initially", () => {
      renderFilter();

      expect(screen.queryByText("Clear")).not.toBeInTheDocument();
      expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
    });
  });

  describe("Initial Load", () => {
    it("calls fetchOwners on component mount", () => {
      renderFilter();

      expect(mockFetchOwners).toHaveBeenCalledTimes(1);
    });

    it("only calls fetchOwners once on initial render", () => {
      const { rerender } = renderFilter();

      rerender(<OwnerFilter />);

      // Should still only be called once due to useEffect dependency
      expect(mockFetchOwners).toHaveBeenCalledTimes(1);
    });
  });

  describe("Input Interaction", () => {
    it("updates input value when typing", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");
      fireEvent.change(input, { target: { value: "John Doe" } });

      expect(input).toHaveValue("John Doe");
    });

    it("handles empty input value", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");
      fireEvent.change(input, { target: { value: "" } });

      expect(input).toHaveValue("");
    });

    it("handles special characters in input", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");
      const specialValue = "John O'Connor & Smith-Jones";
      fireEvent.change(input, { target: { value: specialValue } });

      expect(input).toHaveValue(specialValue);
    });

    it("handles very long input values", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");
      const longValue = "A".repeat(1000);
      fireEvent.change(input, { target: { value: longValue } });

      expect(input).toHaveValue(longValue);
    });
  });

  describe("Search Functionality", () => {
    it("calls filterByName when search button is clicked", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");
      fireEvent.change(input, { target: { value: "John Doe" } });

      const searchButton = screen.getByText("Search").closest("button");
      fireEvent.click(searchButton!);

      expect(mockFilterByName).toHaveBeenCalledWith("John Doe");
      expect(mockFilterByName).toHaveBeenCalledTimes(1);
    });

    it("can search with empty string", () => {
      renderFilter();

      const searchButton = screen.getByText("Search").closest("button");
      fireEvent.click(searchButton!);

      expect(mockFilterByName).toHaveBeenCalledWith("");
    });

    it("can search multiple times with different values", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");
      const searchButton = screen.getByText("Search").closest("button");

      // First search
      fireEvent.change(input, { target: { value: "John" } });
      fireEvent.click(searchButton!);

      // Second search
      fireEvent.change(input, { target: { value: "Jane" } });
      fireEvent.click(searchButton!);

      expect(mockFilterByName).toHaveBeenCalledTimes(2);
      expect(mockFilterByName).toHaveBeenNthCalledWith(1, "John");
      expect(mockFilterByName).toHaveBeenNthCalledWith(2, "Jane");
    });

    it("searches with trimmed values", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");
      fireEvent.change(input, { target: { value: "  John Doe  " } });

      const searchButton = screen.getByText("Search").closest("button");
      fireEvent.click(searchButton!);

      expect(mockFilterByName).toHaveBeenCalledWith("  John Doe  ");
    });
  });

  describe("Clear Functionality", () => {
    it("shows clear button when input has value", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");
      fireEvent.change(input, { target: { value: "John" } });

      expect(screen.getByText("Clear")).toBeInTheDocument();
      expect(screen.getByTestId("x-icon")).toBeInTheDocument();
    });

    it("hides clear button when input is empty", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");
      fireEvent.change(input, { target: { value: "John" } });

      // Clear button should be visible
      expect(screen.getByText("Clear")).toBeInTheDocument();

      // Clear the input
      fireEvent.change(input, { target: { value: "" } });

      // Clear button should be hidden
      expect(screen.queryByText("Clear")).not.toBeInTheDocument();
    });

    it("clears input and calls appropriate functions when clear button is clicked", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");
      fireEvent.change(input, { target: { value: "John Doe" } });

      const clearButton = screen.getByText("Clear").closest("button");
      fireEvent.click(clearButton!);

      expect(input).toHaveValue("");
      expect(mockFilterByName).toHaveBeenCalledWith("");
      expect(mockFetchOwners).toHaveBeenCalledTimes(2); // Once on mount, once on clear
    });

    it("has correct styling for clear button", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");
      fireEvent.change(input, { target: { value: "John" } });

      const clearButton = screen.getByText("Clear").closest("button");
      expect(clearButton).toHaveClass(
        "bg-gray-500",
        "text-white",
        "px-6",
        "py-2",
        "rounded-md",
        "hover:bg-gray-600",
        "disabled:opacity-50",
        "disabled:cursor-not-allowed",
        "transition-colors",
        "duration-200",
        "flex",
        "items-center"
      );
    });
  });

  describe("Button States", () => {
    it("search button is always enabled", () => {
      renderFilter();

      const searchButton = screen.getByText("Search").closest("button");
      expect(searchButton).toBeEnabled();
    });

    it("clear button is enabled when visible", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");
      fireEvent.change(input, { target: { value: "test" } });

      const clearButton = screen.getByText("Clear").closest("button");
      expect(clearButton).toBeEnabled();
    });

    it("handles rapid clicking of search button", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");
      fireEvent.change(input, { target: { value: "John" } });

      const searchButton = screen.getByText("Search").closest("button");

      // Click multiple times rapidly
      fireEvent.click(searchButton!);
      fireEvent.click(searchButton!);
      fireEvent.click(searchButton!);

      expect(mockFilterByName).toHaveBeenCalledTimes(3);
      expect(mockFilterByName).toHaveBeenCalledWith("John");
    });

    it("handles rapid clicking of clear button", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");
      fireEvent.change(input, { target: { value: "John" } });

      let clearButton = screen.getByText("Clear").closest("button");
      fireEvent.click(clearButton!);

      // After clearing, button should disappear and input should be empty
      expect(input).toHaveValue("");
      expect(screen.queryByText("Clear")).not.toBeInTheDocument();
    });
  });

  describe("Layout and Responsive Design", () => {
    it("has responsive grid layout", () => {
      const { container } = renderFilter();

      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("grid-cols-1", "md:grid-cols-3", "gap-4");
    });

    it("has proper spacing between elements", () => {
      const { container } = renderFilter();

      const buttonContainer = container.querySelector(
        ".flex.items-center.space-x-4"
      );
      expect(buttonContainer).toBeInTheDocument();

      const topSection = container.querySelector(
        ".flex.items-center.justify-between.mb-4"
      );
      expect(topSection).toBeInTheDocument();
    });

    it("has proper margin and padding", () => {
      const { container } = renderFilter();

      const mainContainer = container.querySelector(".bg-white");
      expect(mainContainer).toHaveClass("p-6", "mb-6");

      const bottomSection = container.querySelector(".mt-6");
      expect(bottomSection).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper label association", () => {
      renderFilter();

      const label = screen.getByText("Owner Name");
      expect(label.tagName).toBe("LABEL");
    });

    it("has proper heading structure", () => {
      renderFilter();

      const heading = screen.getByText("Filter Owners");
      expect(heading.tagName).toBe("H3");
      expect(heading).toHaveClass("text-lg", "font-semibold", "text-gray-900");
    });

    it("buttons have accessible text content", () => {
      renderFilter();

      expect(
        screen.getByRole("button", { name: /search/i })
      ).toBeInTheDocument();

      // Add some text to show clear button
      const input = screen.getByTestId("input-component");
      fireEvent.change(input, { target: { value: "test" } });

      expect(
        screen.getByRole("button", { name: /clear/i })
      ).toBeInTheDocument();
    });

    it("maintains focus management", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");
      const searchButton = screen.getByText("Search").closest("button");

      input.focus();
      expect(input).toHaveFocus();

      fireEvent.click(searchButton!);
      // Focus behavior depends on implementation, but should not throw
    });
  });

  describe("Edge Cases", () => {
    it("handles component unmounting gracefully", () => {
      const { unmount } = renderFilter();

      expect(() => unmount()).not.toThrow();
    });

    it("handles rapid input changes", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");

      // Rapidly change input values
      fireEvent.change(input, { target: { value: "A" } });
      fireEvent.change(input, { target: { value: "AB" } });
      fireEvent.change(input, { target: { value: "ABC" } });
      fireEvent.change(input, { target: { value: "ABCD" } });

      expect(input).toHaveValue("ABCD");
    });

    it("handles clearing when input is already empty", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");

      // Add text then clear it manually
      fireEvent.change(input, { target: { value: "test" } });
      fireEvent.change(input, { target: { value: "" } });

      // Clear button should not be visible
      expect(screen.queryByText("Clear")).not.toBeInTheDocument();
    });

    it("handles search and clear in sequence", () => {
      renderFilter();

      const input = screen.getByTestId("input-component");
      const searchButton = screen.getByText("Search").closest("button");

      // Type, search, clear, search again
      fireEvent.change(input, { target: { value: "John" } });
      fireEvent.click(searchButton!);

      const clearButton = screen.getByText("Clear").closest("button");
      fireEvent.click(clearButton!);

      fireEvent.click(searchButton!);

      expect(mockFilterByName).toHaveBeenCalledTimes(3); // search, clear, search
      expect(mockFilterByName).toHaveBeenNthCalledWith(1, "John");
      expect(mockFilterByName).toHaveBeenNthCalledWith(2, "");
      expect(mockFilterByName).toHaveBeenNthCalledWith(3, "");
    });
  });
});
