import { motion } from "framer-motion"

export const EnterAnimation = ({
  children,
  bounce = 0.2,
  initalScale = 0,
  endScale = 1
}: {
  children: React.ReactNode
  bounce?: number
  initalScale?: number
  endScale?: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: initalScale }}
      animate={{ opacity: 1, scale: endScale }}
      transition={{
        duration: 0.4,
        scale: { type: "spring", visualDuration: 0.4, bounce: bounce }
      }}
    >
      {children}
    </motion.div>
  )
}

export const FormEnterAnimation = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <motion.div
      initial={{ x: 10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -10, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
