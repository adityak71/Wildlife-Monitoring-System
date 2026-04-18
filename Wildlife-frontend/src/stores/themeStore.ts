import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ColorPalette = 
  | 'forest' 
  | 'ocean' 
  | 'sunset' 
  | 'midnight' 
  | 'slack' 
  | 'vscode'

export type ThemeMode = 'dark' | 'light' | 'system'

interface ThemeColors {
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  accent: string
  accentForeground: string
  background: string
  foreground: string
  muted: string
  mutedForeground: string
  card: string
  cardForeground: string
  border: string
  ring: string
}

interface ThemeStore {
  mode: ThemeMode
  palette: ColorPalette
  customColors?: Partial<ThemeColors>
  setMode: (mode: ThemeMode) => void
  setPalette: (palette: ColorPalette) => void
  setCustomColor: (colorKey: keyof ThemeColors, value: string) => void
  resetCustomColors: () => void
}

// Color palettes definition
export const colorPalettes: Record<ColorPalette, ThemeColors> = {
  forest: {
    primary: '142.1 76.2% 36.3%',
    primaryForeground: '355.7 100% 97.3%',
    secondary: '142.1 70.6% 45.3%',
    secondaryForeground: '144.9 80.4% 10%',
    accent: '38 92% 50%',
    accentForeground: '48 96% 89%',
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    muted: '210 40% 96.1%',
    mutedForeground: '215.4 16.3% 46.9%',
    card: '0 0% 100%',
    cardForeground: '222.2 84% 4.9%',
    border: '214.3 31.8% 91.4%',
    ring: '142.1 76.2% 36.3%',
  },
  ocean: {
    primary: '201 96% 32%',
    primaryForeground: '0 0% 100%',
    secondary: '187 100% 42%',
    secondaryForeground: '0 0% 100%',
    accent: '226 100% 64%',
    accentForeground: '0 0% 100%',
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    muted: '210 40% 96.1%',
    mutedForeground: '215.4 16.3% 46.9%',
    card: '0 0% 100%',
    cardForeground: '222.2 84% 4.9%',
    border: '214.3 31.8% 91.4%',
    ring: '201 96% 32%',
  },
  sunset: {
    primary: '14 100% 53%',
    primaryForeground: '0 0% 100%',
    secondary: '350 89% 60%',
    secondaryForeground: '0 0% 100%',
    accent: '272 67% 64%',
    accentForeground: '0 0% 100%',
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    muted: '210 40% 96.1%',
    mutedForeground: '215.4 16.3% 46.9%',
    card: '0 0% 100%',
    cardForeground: '222.2 84% 4.9%',
    border: '214.3 31.8% 91.4%',
    ring: '14 100% 53%',
  },
  midnight: {
    primary: '271 91% 65%',
    primaryForeground: '0 0% 100%',
    secondary: '270 70% 55%',
    secondaryForeground: '0 0% 100%',
    accent: '290 70% 65%',
    accentForeground: '0 0% 100%',
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    muted: '210 40% 96.1%',
    mutedForeground: '215.4 16.3% 46.9%',
    card: '0 0% 100%',
    cardForeground: '222.2 84% 4.9%',
    border: '214.3 31.8% 91.4%',
    ring: '271 91% 65%',
  },
  slack: {
    primary: '258 89% 66%',
    primaryForeground: '0 0% 100%',
    secondary: '176 80% 45%',
    secondaryForeground: '0 0% 100%',
    accent: '350 89% 60%',
    accentForeground: '0 0% 100%',
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    muted: '210 40% 96.1%',
    mutedForeground: '215.4 16.3% 46.9%',
    card: '0 0% 100%',
    cardForeground: '222.2 84% 4.9%',
    border: '214.3 31.8% 91.4%',
    ring: '258 89% 66%',
  },
  vscode: {
    primary: '199 89% 48%',
    primaryForeground: '0 0% 100%',
    secondary: '88 50% 53%',
    secondaryForeground: '0 0% 0%',
    accent: '28 87% 62%',
    accentForeground: '0 0% 0%',
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    muted: '210 40% 96.1%',
    mutedForeground: '215.4 16.3% 46.9%',
    card: '0 0% 100%',
    cardForeground: '222.2 84% 4.9%',
    border: '214.3 31.8% 91.4%',
    ring: '199 89% 48%',
  },
}

// Dark mode variants
export const darkPalettes: Record<ColorPalette, ThemeColors> = {
  forest: {
    primary: '142.1 70.6% 45.3%',
    primaryForeground: '144.9 80.4% 10%',
    secondary: '142.1 70.6% 35%',
    secondaryForeground: '0 0% 100%',
    accent: '38 92% 50%',
    accentForeground: '0 0% 0%',
    background: '222.2 84% 4.9%',
    foreground: '210 40% 98%',
    muted: '217.2 32.6% 17.5%',
    mutedForeground: '215 20.2% 65.1%',
    card: '222.2 84% 4.9%',
    cardForeground: '210 40% 98%',
    border: '217.2 32.6% 17.5%',
    ring: '142.4 71.8% 29.2%',
  },
  ocean: {
    primary: '201 96% 45%',
    primaryForeground: '0 0% 100%',
    secondary: '187 100% 42%',
    secondaryForeground: '0 0% 100%',
    accent: '226 100% 64%',
    accentForeground: '0 0% 100%',
    background: '222.2 84% 4.9%',
    foreground: '210 40% 98%',
    muted: '217.2 32.6% 17.5%',
    mutedForeground: '215 20.2% 65.1%',
    card: '222.2 84% 4.9%',
    cardForeground: '210 40% 98%',
    border: '217.2 32.6% 17.5%',
    ring: '201 96% 45%',
  },
  sunset: {
    primary: '14 100% 63%',
    primaryForeground: '0 0% 0%',
    secondary: '350 89% 60%',
    secondaryForeground: '0 0% 100%',
    accent: '272 67% 64%',
    accentForeground: '0 0% 100%',
    background: '222.2 84% 4.9%',
    foreground: '210 40% 98%',
    muted: '217.2 32.6% 17.5%',
    mutedForeground: '215 20.2% 65.1%',
    card: '222.2 84% 4.9%',
    cardForeground: '210 40% 98%',
    border: '217.2 32.6% 17.5%',
    ring: '14 100% 63%',
  },
  midnight: {
    primary: '271 91% 65%',
    primaryForeground: '0 0% 100%',
    secondary: '270 70% 55%',
    secondaryForeground: '0 0% 100%',
    accent: '290 70% 65%',
    accentForeground: '0 0% 100%',
    background: '240 50% 5%',
    foreground: '0 0% 98%',
    muted: '240 30% 15%',
    mutedForeground: '240 10% 70%',
    card: '240 40% 8%',
    cardForeground: '0 0% 98%',
    border: '240 30% 20%',
    ring: '271 91% 65%',
  },
  slack: {
    primary: '258 89% 66%',
    primaryForeground: '0 0% 100%',
    secondary: '176 80% 45%',
    secondaryForeground: '0 0% 100%',
    accent: '350 89% 60%',
    accentForeground: '0 0% 100%',
    background: '222.2 84% 4.9%',
    foreground: '210 40% 98%',
    muted: '217.2 32.6% 17.5%',
    mutedForeground: '215 20.2% 65.1%',
    card: '222.2 84% 4.9%',
    cardForeground: '210 40% 98%',
    border: '217.2 32.6% 17.5%',
    ring: '258 89% 66%',
  },
  vscode: {
    primary: '199 89% 48%',
    primaryForeground: '0 0% 0%',
    secondary: '88 50% 53%',
    secondaryForeground: '0 0% 0%',
    accent: '28 87% 62%',
    accentForeground: '0 0% 0%',
    background: '0 0% 0%',
    foreground: '0 0% 95%',
    muted: '0 0% 15%',
    mutedForeground: '0 0% 65%',
    card: '0 0% 5%',
    cardForeground: '0 0% 95%',
    border: '0 0% 20%',
    ring: '199 89% 48%',
  },
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'dark', // Default dark mode
      palette: 'forest', // Default forest palette
      customColors: undefined,
      setMode: (mode) => set({ mode }),
      setPalette: (palette) => set({ palette, customColors: undefined }),
      setCustomColor: (colorKey, value) =>
        set((state) => ({
          customColors: {
            ...state.customColors,
            [colorKey]: value,
          },
        })),
      resetCustomColors: () => set({ customColors: undefined }),
    }),
    {
      name: 'theme-storage',
    }
  )
)