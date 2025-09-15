import type { ButtonProps } from "./types"

/**
 * Reusable Button component with consistent styling and behavior
 * Supports custom styling, disabled state, and different button types
 * 
 * @param props - The button props
 * @returns JSX button element
 */
export const ButtonComponent = ({
  children,
  isDisabled,
  onClick,
  className,
  type = "button"
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      type={type}
      className={
        className ||
        "bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
      }
    >
      {children}
    </button>
  )
}
