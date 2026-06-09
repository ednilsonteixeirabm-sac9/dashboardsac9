import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { META_MENSAL_DASHBOARD } from '@/config/dashboardGoals'
import { formatCurrency, formatNumber } from '@/utils/format'
import type { DashboardResumoDTO } from '@/types/dashboard'

type Props = {
  resumo: DashboardResumoDTO | null
  loading: boolean
}

export function GoalProgressCard({ resumo, loading }: Props) {
  if (loading) {
    return (
      <Card className="overflow-hidden rounded-2xl shadow-[var(--card-elevated-shadow)]">
        <CardHeader>
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-3 md:grid-cols-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-4 w-full rounded-full" />
        </CardContent>
      </Card>
    )
  }

  const realizado = resumo?.vendaMesAtual ?? 0
  const percentual = META_MENSAL_DASHBOARD > 0
    ? (realizado / META_MENSAL_DASHBOARD) * 100
    : 0
  const percentualVisual = Math.max(0, Math.min(percentual, 100))

  return (
    <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-[var(--card-elevated-shadow)]">
      <CardHeader className="border-b border-border px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="mt-1 text-lg font-semibold tracking-tight">
              Meta x Realizado
            </CardTitle>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Painel executivo
            </p>
          </div>
          <span className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-sm font-semibold text-primary">
            {formatNumber(percentual, 2)}% atingido
          </span>
        </div>
        <CardDescription className="text-xs sm:text-sm">
          Acompanhamento mensal do principal indicador gerencial.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Meta Mensal
            </p>
            <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              {formatCurrency(META_MENSAL_DASHBOARD)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Realizado
            </p>
            <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              {formatCurrency(realizado)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Percentual Atingido
            </p>
            <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              {formatNumber(percentual, 2)}%
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Progresso</span>
            <span>{formatNumber(percentualVisual, 2)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-muted shadow-inner">
            <div
              className="h-full rounded-full bg-[image:var(--sac9-gradient)] shadow-sm transition-all"
              style={{
                width: `${percentualVisual}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
