import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ScaleInProps {
  children: ReactNode
  delay?: number
  className?: string
}

export const ScaleIn = ({ children, delay = 0, className = '' }: ScaleInProps) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay, type: 'spring', stiffness: 200 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}