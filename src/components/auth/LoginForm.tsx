import { type FormEvent } from 'react'
import { Loader2, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

type LoginFormProps = {
  email: string
  senha: string
  loading: boolean
  error: string | null
  onEmailChange: (value: string) => void
  onSenhaChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
}

export function LoginForm({
  email,
  senha,
  loading,
  error,
  onEmailChange,
  onSenhaChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <Card className="login-card w-full max-w-md border-0">
      <CardHeader className="space-y-2 px-7 pb-2 pt-7 sm:px-8 sm:pt-8">
        <CardTitle className="text-xl font-semibold tracking-tight text-foreground/95">
          Entrar
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Informe e-mail e senha para acessar o painel de vendas.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-7 pb-7 pt-4 sm:px-8 sm:pb-8">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              E-mail
            </Label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                disabled={loading}
                required
                className="login-input h-12 rounded-xl pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="senha" className="text-sm font-medium">
              Senha
            </Label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="senha"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => onSenhaChange(e.target.value)}
                disabled={loading}
                required
                className="login-input h-12 rounded-xl pl-10"
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="login-submit-btn h-12 w-full rounded-xl text-sm font-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Entrando…
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
