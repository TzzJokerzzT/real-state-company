import { motion } from "framer-motion"

export const HoverGesture = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.0 }}>
      {children}
    </motion.div>
  )
}

export const HoverAnimation = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1 } }}
      whileHover={{ scale: 1.05 }}
    >
      {children}
    </motion.div>
  )
}
