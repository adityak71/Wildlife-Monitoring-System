import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface BaseSkeletonProps {
  className?: string
  variant?: 'rect' | 'circle' | 'text'
  width?: string | number
  height?: string | number
  animated?: boolean
  style?: React.CSSProperties
}

export const BaseSkeleton = ({ 
  className, 
  variant = 'rect',
  width,
  height,
  animated = true,
  style
}: BaseSkeletonProps) => {
  const variants = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded',
  }

  const styles = {
    width: width,
    height: height,
  }

  if (animated) {
    return (
      <motion.div
        className={cn(
          "bg-linear-to-r from-muted/50 via-muted/30 to-muted/50",
          "bg-[length:200%_100%]",
          variants[variant],
          className
        )}
        style={styles}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    )
  }

  return (
    <div
      className={cn(
        "bg-muted/50",
        variants[variant],
        className
      )}
      style={style}
    
    />
  )
}