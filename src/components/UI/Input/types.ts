export interface InputProps {
  label?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: "text" | "number" | "email" | "password" | "url" | "search"
  isRequired?: boolean
  isDisabled?: boolean
  className?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}
