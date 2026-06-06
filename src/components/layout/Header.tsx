import { LogOut, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Sac9Logo } from '@/components/brand/Sac9Logo'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { ThemeToggle } from '@/theme/ThemeToggle'

export function Header() {
  const navigate = useNavigate()
  const usuario = useAuthStore((s) => s.usuario)
  const logout = useAuthStore((s) => s.logout)

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <Sac9Logo size="sm" className="shrink-0" />
          <div className="min-w-0 border-l border-border pl-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              SAC9
            </p>
            <h1 className="truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              Dashboard SAC9
            </h1>
            <p className="hidden text-sm text-muted-foreground sm:block">
              Central de Gestão e Inteligência de Vendas
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          {usuario?.nome && (
            <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <UserRound className="h-4 w-4" aria-hidden />
              </span>
              <span className="max-w-[180px] truncate font-semibold text-foreground">
                {usuario.nome}
              </span>
            </div>
          )}
          <ThemeToggle />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="shrink-0 bg-background font-medium hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
          >
            <LogOut />
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}
