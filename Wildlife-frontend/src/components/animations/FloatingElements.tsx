import { motion } from 'framer-motion'
import { Leaf, Trees, PawPrint, Cloud, Sun } from 'lucide-react'

export const FloatingElements = () => {
  const elements = [
    { icon: Leaf, x: "10%", y: "20%", delay: 0, duration: 8 },
    { icon: Trees, x: "85%", y: "15%", delay: 1, duration: 10 },
    { icon: PawPrint, x: "15%", y: "70%", delay: 2, duration: 9 },
    { icon: Cloud, x: "75%", y: "60%", delay: 0.5, duration: 12 },
    { icon: Sun, x: "90%", y: "80%", delay: 3, duration: 7 },
    { icon: Leaf, x: "5%", y: "85%", delay: 1.5, duration: 11 },
    { icon: Trees, x: "50%", y: "90%", delay: 2.5, duration: 13 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element, index) => {
        const Icon = element.icon
        return (
          <motion.div
            key={index}
            className="absolute text-primary/10"
            style={{ left: element.x, top: element.y }}
            animate={{
              y: [0, -30, 0, 30, 0],
              x: [0, 20, -10, -20, 0],
              rotate: [0, 10, -5, 5, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut",
            }}
          >
            <Icon className="w-12 h-12 opacity-20" />
          </motion.div>
        )
      })}
    </div>
  )
}