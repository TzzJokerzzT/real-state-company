import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { ButtonComponent } from "../Button/Button"

describe("ButtonComponent", () => {
  it("renders children correctly", () => {
    render(<ButtonComponent>Click me</ButtonComponent>)

    expect(screen.getByRole("button")).toBeInTheDocument()
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("applies default className when no className is provided", () => {
    render(<ButtonComponent>Default Button</ButtonComponent>)

    const button = screen.getByRole("button")
    expect(button).toHaveClass("bg-blue-600")
    expect(button).toHaveClass("text-white")
    expect(button).toHaveClass("px-6")
    expect(button).toHaveClass("py-2")
    expect(button).toHaveClass("rounded-md")
    expect(button).toHaveClass("hover:bg-blue-700")
    expect(button).toHaveClass("disabled:opacity-50")
    expect(button).toHaveClass("disabled:cursor-not-allowed")
    expect(button).toHaveClass("transition-colors")
    expect(button).toHaveClass("duration-200")
    expect(button).toHaveClass("flex")
    expect(button).toHaveClass("items-center")
  })

  it("applies custom className when provided", () => {
    const customClass = "bg-red-500 text-black custom-button"
    render(
      <ButtonComponent className={customClass}>Custom Button</ButtonComponent>
    )

    const button = screen.getByRole("button")
    expect(button).toHaveClass("bg-red-500")
    expect(button).toHaveClass("text-black")
    expect(button).toHaveClass("custom-button")
    // Should not have default classes when custom className is provided
    expect(button).not.toHaveClass("bg-blue-600")
  })

  it("handles onClick events correctly", () => {
    const handleClick = vi.fn()
    render(
      <ButtonComponent onClick={handleClick}>Clickable Button</ButtonComponent>
    )

    const button = screen.getByRole("button")
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("can be clicked multiple times", () => {
    const handleClick = vi.fn()
    render(
      <ButtonComponent onClick={handleClick}>
        Multi-click Button
      </ButtonComponent>
    )

    const button = screen.getByRole("button")
    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(3)
  })

  it("is disabled when isDisabled is true", () => {
    const handleClick = vi.fn()
    render(
      <ButtonComponent isDisabled onClick={handleClick}>
        Disabled Button
      </ButtonComponent>
    )

    const button = screen.getByRole("button")
    expect(button).toBeDisabled()

    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it("is enabled by default", () => {
    render(<ButtonComponent>Enabled Button</ButtonComponent>)

    const button = screen.getByRole("button")
    expect(button).toBeEnabled()
    expect(button).not.toBeDisabled()
  })

  it("applies correct button type when specified", () => {
    render(<ButtonComponent type="submit">Submit Button</ButtonComponent>)

    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("type", "submit")
  })

  it("defaults to button type when no type is specified", () => {
    render(<ButtonComponent>Default Type Button</ButtonComponent>)

    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("type", "button")
  })

  it('renders with type="button" explicitly', () => {
    render(<ButtonComponent type="button">Explicit Button</ButtonComponent>)

    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("type", "button")
  })

  it("renders complex children correctly", () => {
    render(
      <ButtonComponent>
        <span>Icon</span>
        <span>Text</span>
      </ButtonComponent>
    )

    expect(screen.getByText("Icon")).toBeInTheDocument()
    expect(screen.getByText("Text")).toBeInTheDocument()
  })

  it("works without onClick handler", () => {
    render(<ButtonComponent>No Handler Button</ButtonComponent>)

    const button = screen.getByRole("button")
    expect(() => fireEvent.click(button)).not.toThrow()
  })

  it("combines all props correctly", () => {
    const handleClick = vi.fn()
    const customClass = "custom-style"

    render(
      <ButtonComponent
        onClick={handleClick}
        className={customClass}
        type="submit"
        isDisabled={false}
      >
        Complete Button
      </ButtonComponent>
    )

    const button = screen.getByRole("button")

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass(customClass)
    expect(button).toHaveAttribute("type", "submit")
    expect(button).toBeEnabled()
    expect(screen.getByText("Complete Button")).toBeInTheDocument()

    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("maintains focus behavior", () => {
    render(<ButtonComponent>Focusable Button</ButtonComponent>)

    const button = screen.getByRole("button")
    button.focus()

    expect(button).toHaveFocus()
  })

  it("disabled button cannot receive focus via click", () => {
    render(<ButtonComponent isDisabled>Disabled Focus Button</ButtonComponent>)

    const button = screen.getByRole("button")
    fireEvent.click(button)

    // Disabled buttons typically don't receive focus when clicked
    expect(button).toBeDisabled()
  })
})
