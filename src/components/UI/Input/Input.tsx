import type { InputProps } from "./types"
import { useId } from "react"

export const InputComponent = ({
  label,
  onChange,
  value,
  placeholder,
  type = "text",
  isRequired,
  isDisabled,
  className,
  onKeyDown
}: InputProps) => {
  const inputId = useId()
  
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={inputId}
        data-testid="input-component"
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={isDisabled}
        required={isRequired}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          isDisabled ? "bg-gray-100 cursor-not-allowed border-gray-400" : ""
        } ${className || ""}`}
      />
    </div>
  )
}
