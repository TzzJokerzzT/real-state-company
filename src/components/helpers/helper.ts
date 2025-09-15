/**
 * Formats a numeric price value as USD currency
 * @param price - The numeric price to format
 * @returns The formatted price string in USD currency format
 * @example
 * formatPrice(1500) // "$1,500"
 * formatPrice(1250.99) // "$1,251"
 */
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  }).format(price)
}

/**
 * Formats a date string into a human-readable format
 * @param dateString - The date string to format (ISO format)
 * @returns The formatted date string in US locale format
 * @example
 * formatDate("2023-12-15T10:30:00") // "Dec 15, 2023"
 */
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}
