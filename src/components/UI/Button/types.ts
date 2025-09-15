export interface ButtonProps {
  children: React.ReactNode
  isDisabled?: boolean
  className?: string
  onClick?: () => void
  type?: "button" | "submit"
}
