import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { OptionComponent } from "../Option/Option"
import type { OptionItem } from "../Option/types"

describe("OptionComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Rendering with OptionItem array", () => {
    const optionItems: OptionItem<string>[] = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3", disabled: true }
    ]

    it("renders label and select element", () => {
      render(
        <OptionComponent
          label="Test Label"
          options={optionItems}
          value=""
          onChange={vi.fn()}
        />
      )

      expect(screen.getByText("Test Label")).toBeInTheDocument()
      expect(screen.getByRole("combobox")).toBeInTheDocument()
    })

    it("renders all options correctly", () => {
      render(
        <OptionComponent
          label="Test Label"
          options={optionItems}
          value=""
          onChange={vi.fn()}
        />
      )

      expect(screen.getByText("Option 1")).toBeInTheDocument()
      expect(screen.getByText("Option 2")).toBeInTheDocument()
      expect(screen.getByText("Option 3")).toBeInTheDocument()
    })

    it("renders placeholder option when provided", () => {
      render(
        <OptionComponent
          label="Test Label"
          options={optionItems}
          value=""
          onChange={vi.fn()}
          placeholder="Choose an option"
        />
      )

      expect(screen.getByText("Choose an option")).toBeInTheDocument()
    })

    it("uses default placeholder when none provided", () => {
      render(
        <OptionComponent
          label="Test Label"
          options={optionItems}
          value=""
          onChange={vi.fn()}
        />
      )

      expect(screen.getByText("Select an option")).toBeInTheDocument()
    })

    it("displays current value correctly", () => {
      render(
        <OptionComponent
          label="Test Label"
          options={optionItems}
          value="option2"
          onChange={vi.fn()}
        />
      )

      const select = screen.getByRole("combobox") as HTMLSelectElement
      expect(select.value).toBe("option2")
    })

    it("marks disabled options correctly", () => {
      render(
        <OptionComponent
          label="Test Label"
          options={optionItems}
          value=""
          onChange={vi.fn()}
        />
      )

      const option3 = screen.getByRole("option", {
        name: "Option 3"
      }) as HTMLOptionElement
      expect(option3.disabled).toBe(true)
    })
  })

  describe("Rendering with simple array and helper functions", () => {
    const simpleOptions = ["apple", "banana", "cherry"]

    it("renders simple string array correctly", () => {
      render(
        <OptionComponent
          label="Fruits"
          options={simpleOptions}
          value=""
          onChange={vi.fn()}
        />
      )

      expect(screen.getByText("apple")).toBeInTheDocument()
      expect(screen.getByText("banana")).toBeInTheDocument()
      expect(screen.getByText("cherry")).toBeInTheDocument()
    })

    it("uses getValue and getLabel functions correctly", () => {
      const complexOptions = [
        { id: 1, name: "Apple", category: "fruit" },
        { id: 2, name: "Banana", category: "fruit" }
      ]

      render(
        <OptionComponent
          label="Complex Options"
          options={complexOptions}
          value={1}
          onChange={vi.fn()}
          getValue={item => item.id}
          getLabel={item => item.name}
        />
      )

      expect(screen.getByText("Apple")).toBeInTheDocument()
      expect(screen.getByText("Banana")).toBeInTheDocument()
    })

    it("handles mixed object types with getValue/getLabel", () => {
      const mixedOptions = [
        { code: "US", country: "United States" },
        { code: "CA", country: "Canada" }
      ]

      render(
        <OptionComponent
          label="Countries"
          options={mixedOptions}
          value="US"
          onChange={vi.fn()}
          getValue={item => item.code}
          getLabel={item => `${item.country} (${item.code})`}
        />
      )

      expect(screen.getByText("United States (US)")).toBeInTheDocument()
      expect(screen.getByText("Canada (CA)")).toBeInTheDocument()
    })
  })

  describe("onChange behavior", () => {
    const optionItems: OptionItem<string>[] = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" }
    ]

    it("calls onChange with correct value when option is selected", () => {
      const handleChange = vi.fn()
      render(
        <OptionComponent
          label="Test Label"
          options={optionItems}
          value=""
          onChange={handleChange}
        />
      )

      const select = screen.getByRole("combobox")
      fireEvent.change(select, { target: { value: "option1" } })

      expect(handleChange).toHaveBeenCalledWith("option1")
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it("calls onChange with numeric values correctly", () => {
      const numericOptions: OptionItem<number>[] = [
        { value: 1, label: "One" },
        { value: 2, label: "Two" }
      ]

      const handleChange = vi.fn()
      render(
        <OptionComponent
          label="Numbers"
          options={numericOptions}
          value={0}
          onChange={handleChange}
        />
      )

      const select = screen.getByRole("combobox")
      fireEvent.change(select, { target: { value: "2" } })

      expect(handleChange).toHaveBeenCalledWith(2)
    })

    it("handles complex object values correctly", () => {
      const objectOptions = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" }
      ]

      const handleChange = vi.fn()
      render(
        <OptionComponent
          label="Objects"
          options={objectOptions}
          value={null}
          onChange={handleChange}
          getValue={item => item.id}
          getLabel={item => item.name}
        />
      )

      const select = screen.getByRole("combobox")
      fireEvent.change(select, { target: { value: "1" } })

      expect(handleChange).toHaveBeenCalledWith(1)
    })

    it("does not call onChange when selecting placeholder", () => {
      const handleChange = vi.fn()
      render(
        <OptionComponent
          label="Test Label"
          options={optionItems}
          value="option1"
          onChange={handleChange}
          placeholder="Select option"
        />
      )

      const select = screen.getByRole("combobox")
      fireEvent.change(select, { target: { value: "" } })

      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe("Required field behavior", () => {
    const optionItems: OptionItem<string>[] = [
      { value: "option1", label: "Option 1" }
    ]

    it("displays asterisk for required field", () => {
      render(
        <OptionComponent
          label="Required Field"
          options={optionItems}
          value=""
          onChange={vi.fn()}
          required={true}
        />
      )

      expect(screen.getByText("*")).toBeInTheDocument()
    })

    it("does not display asterisk for non-required field", () => {
      render(
        <OptionComponent
          label="Optional Field"
          options={optionItems}
          value=""
          onChange={vi.fn()}
          required={false}
        />
      )

      expect(screen.queryByText("*")).not.toBeInTheDocument()
    })

    it("sets required attribute on select element", () => {
      render(
        <OptionComponent
          label="Required Field"
          options={optionItems}
          value=""
          onChange={vi.fn()}
          required={true}
        />
      )

      const select = screen.getByRole("combobox")
      expect(select).toHaveAttribute("required")
    })
  })

  describe("Disabled state", () => {
    const optionItems: OptionItem<string>[] = [
      { value: "option1", label: "Option 1" }
    ]

    it("disables select when disabled prop is true", () => {
      render(
        <OptionComponent
          label="Disabled Field"
          options={optionItems}
          value=""
          onChange={vi.fn()}
          disabled={true}
        />
      )

      const select = screen.getByRole("combobox")
      expect(select).toBeDisabled()
    })

    it("enables select when disabled prop is false", () => {
      render(
        <OptionComponent
          label="Enabled Field"
          options={optionItems}
          value=""
          onChange={vi.fn()}
          disabled={false}
        />
      )

      const select = screen.getByRole("combobox")
      expect(select).toBeEnabled()
    })

    it("applies disabled styling classes", () => {
      render(
        <OptionComponent
          label="Disabled Field"
          options={optionItems}
          value=""
          onChange={vi.fn()}
          disabled={true}
        />
      )

      const select = screen.getByRole("combobox")
      expect(select).toHaveClass("disabled:bg-gray-100")
      expect(select).toHaveClass("disabled:cursor-not-allowed")
    })
  })

  describe("CSS classes and styling", () => {
    const optionItems: OptionItem<string>[] = [
      { value: "option1", label: "Option 1" }
    ]

    it("applies default CSS classes", () => {
      render(
        <OptionComponent
          label="Styled Field"
          options={optionItems}
          value=""
          onChange={vi.fn()}
        />
      )

      const select = screen.getByRole("combobox")
      expect(select).toHaveClass("w-full")
      expect(select).toHaveClass("px-3")
      expect(select).toHaveClass("py-2")
      expect(select).toHaveClass("border")
      expect(select).toHaveClass("border-gray-300")
      expect(select).toHaveClass("rounded-md")
      expect(select).toHaveClass("focus:outline-none")
      expect(select).toHaveClass("focus:ring-2")
      expect(select).toHaveClass("focus:ring-blue-500")
      expect(select).toHaveClass("focus:border-transparent")
    })

    it("applies custom className to container", () => {
      render(
        <OptionComponent
          label="Custom Class Field"
          options={optionItems}
          value=""
          onChange={vi.fn()}
          className="custom-class mb-8"
        />
      )

      const container = screen.getByRole("combobox").closest("div")
      expect(container).toHaveClass("custom-class")
      expect(container).toHaveClass("mb-8")
    })

    it("applies empty className correctly", () => {
      render(
        <OptionComponent
          label="Default Class Field"
          options={optionItems}
          value=""
          onChange={vi.fn()}
          className=""
        />
      )

      const container = screen.getByRole("combobox").closest("div")
      expect(container).toBeInTheDocument()
    })
  })

  describe("Label behavior", () => {
    const optionItems: OptionItem<string>[] = [
      { value: "option1", label: "Option 1" }
    ]

    it("renders with empty label", () => {
      render(
        <OptionComponent
          label=""
          options={optionItems}
          value=""
          onChange={vi.fn()}
        />
      )

      expect(screen.getByRole("combobox")).toBeInTheDocument()
    })
  })

  describe("Edge cases and error handling", () => {
    it("handles empty options array", () => {
      render(
        <OptionComponent
          label="Empty Options"
          options={[]}
          value=""
          onChange={vi.fn()}
        />
      )

      const select = screen.getByRole("combobox")
      expect(select).toBeInTheDocument()
      expect(screen.getByText("Select an option")).toBeInTheDocument()
    })

    it("handles null/undefined values gracefully", () => {
      const optionItems: OptionItem<string | null>[] = [
        { value: null, label: "None" },
        { value: "option1", label: "Option 1" }
      ]

      render(
        <OptionComponent
          label="Nullable Options"
          options={optionItems}
          value={null}
          onChange={vi.fn()}
        />
      )

      expect(screen.getByText("None")).toBeInTheDocument()
      expect(screen.getByText("Option 1")).toBeInTheDocument()
    })

    it("handles boolean values correctly", () => {
      const booleanOptions: OptionItem<boolean>[] = [
        { value: true, label: "Yes" },
        { value: false, label: "No" }
      ]

      const handleChange = vi.fn()
      render(
        <OptionComponent
          label="Boolean Options"
          options={booleanOptions}
          value={false}
          onChange={handleChange}
        />
      )

      const select = screen.getByRole("combobox")
      fireEvent.change(select, { target: { value: "true" } })

      expect(handleChange).toHaveBeenCalledWith(true)
    })
  })

  describe("Accessibility", () => {
    const optionItems: OptionItem<string>[] = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" }
    ]

    it("has proper accessibility attributes", () => {
      render(
        <OptionComponent
          label="Accessible Select"
          options={optionItems}
          value=""
          onChange={vi.fn()}
          required={true}
        />
      )

      const select = screen.getByRole("combobox")
      expect(select).toHaveAttribute("required")
      expect(select).toBeInTheDocument()
    })

    it("placeholder option is properly marked as disabled", () => {
      render(
        <OptionComponent
          label="With Placeholder"
          options={optionItems}
          value=""
          onChange={vi.fn()}
          placeholder="Choose option"
        />
      )

      const placeholderOption = screen.getByRole("option", {
        name: "Choose option"
      }) as HTMLOptionElement
      expect(placeholderOption.disabled).toBe(true)
      expect(placeholderOption.value).toBe("")
    })

    it("options have correct values and are selectable", () => {
      render(
        <OptionComponent
          label="Selectable Options"
          options={optionItems}
          value=""
          onChange={vi.fn()}
        />
      )

      const option1 = screen.getByRole("option", {
        name: "Option 1"
      }) as HTMLOptionElement
      const option2 = screen.getByRole("option", {
        name: "Option 2"
      }) as HTMLOptionElement

      expect(option1.value).toBe("option1")
      expect(option2.value).toBe("option2")
      expect(option1.disabled).toBe(false)
      expect(option2.disabled).toBe(false)
    })
  })

  describe("useMemo optimization", () => {
    it("memoizes normalized options correctly", () => {
      const options = ["apple", "banana"]
      const { rerender } = render(
        <OptionComponent
          label="Memoized Options"
          options={options}
          value=""
          onChange={vi.fn()}
        />
      )

      expect(screen.getByText("apple")).toBeInTheDocument()
      expect(screen.getByText("banana")).toBeInTheDocument()

      // Rerender with same options
      rerender(
        <OptionComponent
          label="Memoized Options"
          options={options}
          value="apple"
          onChange={vi.fn()}
        />
      )

      expect(screen.getByText("apple")).toBeInTheDocument()
      expect(screen.getByText("banana")).toBeInTheDocument()
    })
  })
})
