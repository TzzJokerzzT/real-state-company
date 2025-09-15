// Tipos genéricos para opciones
export interface OptionItem<T = unknown> {
  value: T
  label: string
  disabled?: boolean
}

// Props del componente Option
export interface OptionProps<T = unknown> {
  label?: string
  options: OptionItem<T>[] | T[] // Puede recibir objetos OptionItem o arrays simples
  value: T
  onChange?: (value: T) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
  // Para arrays simples, define cómo extraer value y label
  getValue?: (item: T) => unknown
  getLabel?: (item: T) => string
}
