import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/theme/themeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="shrink-0 bg-background font-medium hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      {isDark ? <Sun /> : <Moon />}
      <span className="hidden sm:inline">{isDark ? 'Claro' : 'Escuro'}</span>
    </Button>
  )
}
