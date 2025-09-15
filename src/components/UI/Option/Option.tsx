import { useMemo } from "react";
import type { OptionProps, OptionItem } from "./types";

/**
 * Generic Option/Select component that can handle different types of data
 * Supports both OptionItem objects and simple arrays with custom extractors
 * 
 * @template T - The type of the option values
 * @param props - The component props
 * @returns JSX select element with normalized options
 */
export const OptionComponent = <T = unknown,>({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  className = "",
  getValue,
  getLabel,
}: OptionProps<T>) => {
  /**
   * Normalizes options to standard format
   * Converts simple arrays to OptionItem format using provided extractors
   */
  const normalizedOptions = useMemo(() => {
    return options.map((option) => {
      // If it's an OptionItem object, use it directly
      if (
        typeof option === "object" &&
        option !== null &&
        "value" in option &&
        "label" in option
      ) {
        return option as OptionItem<T>;
      }

      // If it's a simple value, create OptionItem
      const optionValue = getValue ? getValue(option) : option;
      const optionLabel = getLabel ? getLabel(option) : String(option);

      return {
        value: optionValue,
        label: optionLabel,
        disabled: false,
      } as OptionItem<T>;
    });
  }, [options, getValue, getLabel]);

  /**
   * Handles select change events and calls onChange with the selected value
   */
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = normalizedOptions.find(
      (opt) => String(opt.value) === e.target.value
    )?.value;
    if (selectedValue !== undefined) {
      onChange?.(selectedValue);
    }
  };

  const currentValue = String(value);

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {normalizedOptions.map((option, index) => (
          <option
            key={index}
            value={String(option.value)}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
