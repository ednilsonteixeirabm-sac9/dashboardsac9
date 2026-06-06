import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  ThemeContext,
  type Theme,
  type ThemeContextValue,
} from '@/theme/themeContext'

const THEME_STORAGE_KEY = 'sac9-dashboard-theme'
const DEFAULT_THEME: Theme = 'light'

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  return isTheme(storedTheme) ? storedTheme : DEFAULT_THEME
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return

  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.dataset.theme = theme
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme())

  useIsomorphicLayoutEffect(() => {
    applyTheme(theme)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: setThemeState,
      toggleTheme: () => {
        setThemeState((current) => (current === 'light' ? 'dark' : 'light'))
      },
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
