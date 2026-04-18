import { motion } from 'framer-motion'
import type{ ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface AnimatedButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  loading?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const AnimatedButton = ({
  children,
  onClick,
  className,
  variant = 'primary',
  loading = false,
  disabled = false,
  size = 'md',
}: AnimatedButtonProps) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-border hover:bg-accent",
    ghost: "hover:bg-accent",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={loading ? { scale: 0.98 } : { scale: 1 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "relative rounded-lg font-medium transition-all duration-300",
        "overflow-hidden group",
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {variant === 'outline' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
      )}
      
      {!disabled && (
        <motion.span
          className="absolute inset-0 bg-white/20 rounded-lg"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
          />
        ) : (
          children
        )}
      </span>
    </motion.button>
  )
}