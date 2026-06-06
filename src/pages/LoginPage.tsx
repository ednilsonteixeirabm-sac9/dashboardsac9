import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Sac9Logo } from '@/components/brand/Sac9Logo'
import { LoginForm } from '@/components/auth/LoginForm'
import { login } from '@/services/authApi'
import { useAuthStore } from '@/store/authStore'

const INVALID_LOGIN_MESSAGE =
  'E-mail ou senha incorretos. Verifique seus dados e tente novamente.'

const benefits = [
  'Indicadores em tempo real',
  'Metas e desempenho comercial',
  'Ranking de vendedores',
  'Lucro e rentabilidade',
  'Inteligência de negócios com SAC9',
]

export function LoginPage() {
  const navigate = useNavigate()
  const authLogin = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const response = await login(email.trim(), senha)
      authLogin(response.token, response.usuario)
      navigate('/', { replace: true })
    } catch {
      setError(INVALID_LOGIN_MESSAGE)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page-bg flex min-h-screen bg-white">
      <aside className="login-brand-panel hidden md:flex md:w-[60%]">
        <div className="login-visual-fallback" aria-hidden="true">
          <div className="login-visual-card login-visual-card-main">
            <div className="flex items-center justify-between">
              <span className="h-3 w-28 rounded-full bg-white/30" />
              <span className="h-8 w-8 rounded-full bg-[#A6CE39]/80" />
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <span className="h-24 rounded-2xl bg-white/15" />
              <span className="h-24 rounded-2xl bg-white/25" />
              <span className="h-24 rounded-2xl bg-white/15" />
            </div>
            <div className="mt-8 h-36 rounded-3xl bg-white/15">
              <div className="flex h-full items-end gap-3 px-6 pb-6">
                <span className="h-16 flex-1 rounded-t-xl bg-[#A6CE39]/75" />
                <span className="h-24 flex-1 rounded-t-xl bg-white/55" />
                <span className="h-20 flex-1 rounded-t-xl bg-[#6F4AA8]/90" />
                <span className="h-28 flex-1 rounded-t-xl bg-[#A6CE39]/85" />
                <span className="h-32 flex-1 rounded-t-xl bg-white/60" />
              </div>
            </div>
          </div>
          <div className="login-visual-card login-visual-card-side" />
        </div>
        <div className="login-visual-overlay" aria-hidden="true" />
        <div className="relative z-[1] flex min-h-screen w-full max-w-3xl flex-col justify-center gap-9 px-10 py-12 text-white lg:px-16 xl:px-20">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/75">
              Dashboard corporativo
            </p>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
              Transforme dados em decisões.
            </h1>
            <p className="max-w-xl text-base leading-7 text-white/85 lg:text-lg">
              Acompanhe vendas, lucro, metas e desempenho da sua empresa em tempo
              real.
            </p>
          </div>
          <ul className="login-benefits grid max-w-xl gap-4">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.12] px-4 py-3 text-sm font-medium text-white shadow-sm backdrop-blur"
              >
                <CheckCircle2
                  className="size-4 shrink-0 text-[#A6CE39]"
                  aria-hidden
                />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="relative z-[1] flex min-h-screen flex-1 flex-col items-center justify-center bg-white px-4 py-8 sm:px-8 md:w-[40%] lg:py-10">
        <div className="flex w-full max-w-md flex-col items-center">
          <div className="mb-8 flex flex-col items-center gap-1.5 text-center">
            <Sac9Logo
              size="xl"
              className="h-32 max-h-[156px] max-w-[405px] shrink-0 lg:h-36 lg:max-h-[168px] lg:max-w-[450px]"
            />
            <p className="text-sm font-medium text-[#64748B]">
              Central de Gestão e Inteligência
            </p>
          </div>
          <LoginForm
            email={email}
            senha={senha}
            loading={loading}
            error={error}
            onEmailChange={setEmail}
            onSenhaChange={setSenha}
            onSubmit={handleSubmit}
          />
          <div className="mt-8 text-center text-xs leading-relaxed text-muted-foreground/80">
            <p>© SAC9 Tecnologia</p>
            <p>Dashboard Corporativo</p>
          </div>
        </div>
      </main>
    </div>
  )
}
