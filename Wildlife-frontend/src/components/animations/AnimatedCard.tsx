import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import type{ HTMLMotionProps } from "framer-motion";

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
  hoverEffect?: 'glow' | 'scale' | 'border' | 'none'
  onClick?: () => void
}

export const AnimatedCard = ({ 
  children, 
  className, 
  delay = 0,
  hoverEffect = 'glow',
  onClick 
}: AnimatedCardProps) => {

const getHoverAnimation = (): HTMLMotionProps<"div"> => { 
  switch (hoverEffect) {
    case 'glow':
      return {
        whileHover: { 
          scale: 1.02,
          boxShadow: "0 0 30px rgba(var(--primary), 0.2)",
          transition: { type: "spring", stiffness: 400, damping: 17 }
        }
      }
    case 'scale':
      return {
        whileHover: { 
          scale: 1.03,
          transition: { type: "spring", stiffness: 400, damping: 17 }
        }
      }
    case 'border':
      return {
        whileHover: { 
          scale: 1.01,
          borderColor: "hsl(var(--primary))",
          transition: { duration: 0.2 }
        }
      }
    default:
      return {}
  }
}

  return (
        <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
            delay, 
            type: "spring", 
            stiffness: 300, 
            damping: 24 
        }}
        {...getHoverAnimation()}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
            "rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm",
            "transition-all duration-300 cursor-pointer",
            className
        )}
        >
        {children}
        </motion.div>
  )
}
