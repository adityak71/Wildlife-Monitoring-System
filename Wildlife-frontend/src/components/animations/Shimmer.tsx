import { motion } from 'framer-motion'
import type{ ReactNode } from 'react'

interface ShimmerProps {
  children: ReactNode
  className?: string
}

export const Shimmer = ({ children, className }: ShimmerProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 -translate-x-full"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
        }}
        animate={{ x: ["0%", "200%"] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}