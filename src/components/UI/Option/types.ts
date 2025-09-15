/**
 * Generic types for options
 */

/**
 * Interface for option items
 * @template T - The type of the option value
 */
export interface OptionItem<T = unknown> {
  /** The value of the option */
  value: T
  /** The display label for the option */
  label: string
  /** Whether the option is disabled */
  disabled?: boolean
}

/**
 * Props for the Option component
 * @template T - The type of the option value
 */
export interface OptionProps<T = unknown> {
  /** Label for the select field */
  label?: string
  /** Array of options - can be OptionItem objects or simple arrays */
  options: OptionItem<T>[] | T[]
  /** Currently selected value */
  value: T
  /** Callback function when value changes */
  onChange?: (value: T) => void
  /** Placeholder text when no option is selected */
  placeholder?: string
  /** Whether the select is disabled */
  disabled?: boolean
  /** Whether the field is required */
  required?: boolean
  /** Additional CSS classes */
  className?: string
  /** For simple arrays, defines how to extract value */
  getValue?: (item: T) => unknown
  /** For simple arrays, defines how to extract label */
  getLabel?: (item: T) => string
}
