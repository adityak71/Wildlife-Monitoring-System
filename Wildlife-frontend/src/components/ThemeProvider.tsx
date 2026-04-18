import { useEffect,type ReactNode } from 'react'
import { useThemeStore, colorPalettes, darkPalettes } from "../stores/themeStore"

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { mode, palette, customColors } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement
    
    let effectiveMode = mode
    if (mode === 'system') {
      effectiveMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    
    root.classList.remove('light', 'dark')
    root.classList.add(effectiveMode)
    
    const colors = effectiveMode === 'dark' ? darkPalettes[palette] : colorPalettes[palette]
    
    const finalColors = { ...colors, ...customColors }
    
    Object.entries(finalColors).forEach(([key, value]) => {
      if (value) {
        root.style.setProperty(`--${key}`, value)
      }
    })
    
    root.style.transition = 'background-color 0.3s ease, color 0.2s ease'
    
  }, [mode, palette, customColors])

  return <>{children}</>
}