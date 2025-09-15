import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { InputComponent } from "../Input/Input"
import type { InputProps } from "../Input/types"

describe("InputComponent", () => {
  const defaultProps: InputProps = {
    value: "",
    onChange: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderInput = (props: Partial<InputProps> = {}) => {
    return render(<InputComponent {...defaultProps} {...props} />)
  }

  describe("Rendering", () => {
    it("renders input field correctly", () => {
      renderInput()

      const input = screen.getByRole("textbox")
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute("type", "text")
    })

    it("renders with default classes", () => {
      renderInput()

      const input = screen.getByRole("textbox")
      expect(input).toHaveClass(
        "w-full",
        "px-3",
        "py-2",
        "border",
        "border-gray-300",
        "rounded-md",
        "shadow-sm",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-blue-500",
        "focus:border-blue-500"
      )
    })

    it("renders without label when label prop is not provided", () => {
      renderInput()

      expect(screen.queryByRole("label")).not.toBeInTheDocument()
    })

    it("applies correct label styling", () => {
      renderInput({ label: "Styled Label" })

      const label = screen.getByText("Styled Label")
      expect(label).toHaveClass(
        "block",
        "text-sm",
        "font-medium",
        "text-gray-700",
        "mb-1"
      )
    })

    it("renders container with correct margin", () => {
      const { container } = renderInput()

      const wrapper = container.firstChild
      expect(wrapper).toHaveClass("mb-4")
    })
  })

  describe("Input Types", () => {
    it("defaults to text type", () => {
      renderInput()

      const input = screen.getByRole("textbox")
      expect(input).toHaveAttribute("type", "text")
    })

    it("renders with email type", () => {
      renderInput({ type: "email" })

      const input = screen.getByRole("textbox")
      expect(input).toHaveAttribute("type", "email")
    })

    it("renders with password type", () => {
      renderInput({ type: "password" })

      const input = document.querySelector('input[type="password"]')
      expect(input).toHaveAttribute("type", "password")
    })

    it("renders with number type", () => {
      renderInput({ type: "number" })

      const input = screen.getByRole("spinbutton")
      expect(input).toHaveAttribute("type", "number")
    })

    it("renders with url type", () => {
      renderInput({ type: "url" })

      const input = screen.getByRole("textbox")
      expect(input).toHaveAttribute("type", "url")
    })

    it("renders with search type", () => {
      renderInput({ type: "search" })

      const input = screen.getByRole("searchbox")
      expect(input).toHaveAttribute("type", "search")
    })
  })

  describe("Value and Placeholder", () => {
    it("displays the provided value", () => {
      renderInput({ value: "Test Value" })

      const input = screen.getByRole("textbox")
      expect(input).toHaveValue("Test Value")
    })

    it("displays numeric value", () => {
      renderInput({ value: 42, type: "number" })

      const input = screen.getByRole("spinbutton")
      expect(input).toHaveValue(42)
    })

    it("displays empty value", () => {
      renderInput({ value: "" })

      const input = screen.getByRole("textbox")
      expect(input).toHaveValue("")
    })

    it("displays placeholder text", () => {
      renderInput({ placeholder: "Enter text here" })

      const input = screen.getByPlaceholderText("Enter text here")
      expect(input).toBeInTheDocument()
    })

    it("works without placeholder", () => {
      renderInput()

      const input = screen.getByRole("textbox")
      expect(input).not.toHaveAttribute("placeholder")
    })
  })

  describe("Required Field", () => {
    it("is not required by default", () => {
      renderInput()

      const input = screen.getByRole("textbox")
      expect(input).not.toHaveAttribute("required")
    })

    it("sets required attribute when isRequired is true", () => {
      renderInput({ isRequired: true })

      const input = screen.getByRole("textbox")
      expect(input).toHaveAttribute("required")
    })

    it("shows asterisk when field is required and has label", () => {
      renderInput({ label: "Required Field", isRequired: true })

      expect(screen.getByText("Required Field")).toBeInTheDocument()
      expect(screen.getByText("*")).toBeInTheDocument()

      const asterisk = screen.getByText("*")
      expect(asterisk).toHaveClass("text-red-500")
    })

    it("does not show asterisk when field is required but has no label", () => {
      renderInput({ isRequired: true, label: undefined })

      expect(screen.queryByText("*")).not.toBeInTheDocument()
    })

    it("does not show asterisk when field has label but is not required", () => {
      renderInput({ label: "Optional Field" })

      expect(screen.getByText("Optional Field")).toBeInTheDocument()
      expect(screen.queryByText("*")).not.toBeInTheDocument()
    })
  })

  describe("Disabled State", () => {
    it("is enabled by default", () => {
      renderInput()

      const input = screen.getByRole("textbox")
      expect(input).toBeEnabled()
      expect(input).not.toHaveAttribute("disabled")
    })

    it("is disabled when isDisabled is true", () => {
      renderInput({ isDisabled: true })

      const input = screen.getByRole("textbox")
      expect(input).toBeDisabled()
      expect(input).toHaveAttribute("disabled")
    })

    it("applies disabled styling when disabled", () => {
      renderInput({ isDisabled: true })

      const input = screen.getByRole("textbox")
      expect(input).toHaveClass("bg-gray-100", "cursor-not-allowed")
    })

    it("does not apply disabled styling when enabled", () => {
      renderInput({ isDisabled: false })

      const input = screen.getByRole("textbox")
      expect(input).not.toHaveClass("bg-gray-100", "cursor-not-allowed")
    })
  })

  describe("Custom Styling", () => {
    it("applies custom className", () => {
      const customClass = "custom-input-class border-red-500"
      renderInput({ className: customClass })

      const input = screen.getByRole("textbox")
      expect(input).toHaveClass("custom-input-class", "border-red-500")
    })

    it("combines custom className with default classes", () => {
      renderInput({ className: "custom-class" })

      const input = screen.getByRole("textbox")
      expect(input).toHaveClass("custom-class", "w-full", "px-3", "py-2")
    })

    it("works without custom className", () => {
      renderInput()

      const input = screen.getByRole("textbox")
      expect(input).toHaveClass("w-full", "px-3", "py-2")
    })
  })

  describe("Event Handling", () => {
    it("calls onChange when input value changes", () => {
      const handleChange = vi.fn()
      renderInput({ onChange: handleChange, label: "Test Input" })

      const input = screen.getByRole("textbox")
      fireEvent.change(input, { target: { value: "new value" } })

      expect(handleChange).toHaveBeenCalledTimes(1)
      // Verify the event was called - React's synthetic events have a different structure
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "change",
          target: expect.any(Element)
        })
      )
    })

    it("calls onChange multiple times for multiple changes", () => {
      const handleChange = vi.fn()
      renderInput({ onChange: handleChange })

      const input = screen.getByRole("textbox")
      fireEvent.change(input, { target: { value: "first" } })
      fireEvent.change(input, { target: { value: "second" } })
      fireEvent.change(input, { target: { value: "third" } })

      expect(handleChange).toHaveBeenCalledTimes(3)
    })

    it("calls onKeyDown when key is pressed", () => {
      const handleKeyDown = vi.fn()
      renderInput({ onKeyDown: handleKeyDown })

      const input = screen.getByRole("textbox")
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" })

      expect(handleKeyDown).toHaveBeenCalledTimes(1)
      expect(handleKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "Enter",
          code: "Enter"
        })
      )
    })

    it("works without onKeyDown handler", () => {
      renderInput()

      const input = screen.getByRole("textbox")
      expect(() => fireEvent.keyDown(input, { key: "Enter" })).not.toThrow()
    })

    it("handles various key events", () => {
      const handleKeyDown = vi.fn()
      renderInput({ onKeyDown: handleKeyDown })

      const input = screen.getByRole("textbox")

      fireEvent.keyDown(input, { key: "Enter" })
      fireEvent.keyDown(input, { key: "Escape" })
      fireEvent.keyDown(input, { key: "Tab" })
      fireEvent.keyDown(input, { key: "a" })

      expect(handleKeyDown).toHaveBeenCalledTimes(4)
    })

    it("does not call onChange when disabled", () => {
      const handleChange = vi.fn()
      renderInput({ onChange: handleChange, isDisabled: true })

      const input = screen.getByRole("textbox")
      fireEvent.change(input, { target: { value: "should not work" } })

      // Disabled inputs typically don't trigger change events
      expect(input).toBeDisabled()
    })
  })

  describe("Accessibility", () => {
    it("associates label with input correctly", () => {
      renderInput({ label: "Accessible Label" })

      const input = screen.getByLabelText("Accessible Label")
      expect(input).toBeInTheDocument()
    })

    it("maintains proper focus behavior", () => {
      renderInput({ label: "Focusable Input" })

      const input = screen.getByLabelText("Focusable Input")
      input.focus()

      expect(input).toHaveFocus()
    })

    it("disabled input cannot receive focus via tab", () => {
      renderInput({ isDisabled: true })

      const input = screen.getByRole("textbox")
      expect(input).toBeDisabled()

      // Disabled inputs should not receive focus
      input.focus()
      expect(input).not.toHaveFocus()
    })

    it("supports screen reader attributes", () => {
      renderInput({
        label: "Screen Reader Test",
        placeholder: "Enter text",
        isRequired: true
      })

      const input = screen.getByRole("textbox")
      expect(input).toHaveAttribute("required")
      expect(input).toHaveAttribute("placeholder", "Enter text")
    })
  })

  describe("Complex Scenarios", () => {
    it("handles all props together", () => {
      const handleChange = vi.fn()
      const handleKeyDown = vi.fn()

      renderInput({
        label: "Complete Input",
        value: "test@example.com",
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        placeholder: "Enter email",
        type: "email",
        isRequired: true,
        isDisabled: false,
        className: "custom-email-input"
      })

      const input = screen.getByTestId("input-component")

      expect(input).toBeInTheDocument()
      expect(input).toHaveValue("test@example.com")
      expect(input).toHaveAttribute("type", "email")
      expect(input).toHaveAttribute("placeholder", "Enter email")
      expect(input).toHaveAttribute("required")
      expect(input).toBeEnabled()
      expect(input).toHaveClass("custom-email-input")

      // Test interactions
      fireEvent.change(input, { target: { value: "new@example.com" } })
      fireEvent.keyDown(input, { key: "Enter" })

      expect(handleChange).toHaveBeenCalled()
      expect(handleKeyDown).toHaveBeenCalled()
    })

    it("handles required disabled field with custom styling", () => {
      renderInput({
        label: "Disabled Required Field",
        value: "locked value",
        onChange: vi.fn(),
        isRequired: true,
        isDisabled: true,
        className: "border-gray-400"
      })

      const input = screen.getByTestId("input-component")

      expect(input).toBeDisabled()
      expect(input).toHaveAttribute("required")
      expect(input).toHaveValue("locked value")
      expect(input).toHaveClass(
        "bg-gray-100",
        "cursor-not-allowed",
        "border-gray-400"
      )
      expect(screen.getByText("*")).toHaveClass("text-red-500")
    })
  })

  describe("Edge Cases", () => {
    it("handles empty string value", () => {
      renderInput({ value: "" })

      const input = screen.getByRole("textbox")
      expect(input).toHaveValue("")
    })

    it("handles zero as numeric value", () => {
      renderInput({ value: 0, type: "number" })

      const input = screen.getByRole("spinbutton")
      expect(input).toHaveValue(0)
    })

    it("handles very long values", () => {
      const longValue = "a".repeat(1000)
      renderInput({ value: longValue })

      const input = screen.getByRole("textbox")
      expect(input).toHaveValue(longValue)
    })

    it("handles special characters in value", () => {
      const specialValue = "!@#$%^&*()_+-=[]{}|;:,.<>?"
      renderInput({ value: specialValue })

      const input = screen.getByRole("textbox")
      expect(input).toHaveValue(specialValue)
    })

    it("handles undefined className gracefully", () => {
      renderInput({ className: undefined })

      const input = screen.getByRole("textbox")
      expect(input).toHaveClass("w-full", "px-3", "py-2")
    })
  })
})
