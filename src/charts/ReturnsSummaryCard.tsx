import { BadgePercent, FileText, PackageX, RotateCcw, type LucideIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatNumber } from '@/utils/format'
import type { DashboardDevolucoesDTO } from '@/types/dashboard'

type Props = {
  devolucoesResumo: DashboardDevolucoesDTO
  loading: boolean
  error?: string | null
}

type Indicator = {
  key: string
  title: string
  description: string
  value: string
  color: string
  icon: LucideIcon
}

const VALUE_RETURNED_COLOR = '#6F4DBF'

function formatPercent(value: number): string {
  return `${formatNumber(value, 2)}%`
}

function getPercentColor(value: number): string {
  if (value < 1) return '#16A34A'
  if (value <= 3) return '#F59E0B'
  return '#DC2626'
}

export function ReturnsSummaryCard({
  devolucoesResumo,
  loading,
  error,
}: Props) {
  if (loading) {
    return (
      <Card className="h-full rounded-2xl shadow-[var(--card-elevated-shadow)]">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="h-[300px]">
          <div className="grid h-full grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-full min-h-[126px] w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const indicators: Indicator[] = [
    {
      key: 'valor',
      title: 'Valor Devolvido',
      description: 'Valor total devolvido',
      value: formatCurrency(devolucoesResumo.valorDevolvido),
      color: VALUE_RETURNED_COLOR,
      icon: RotateCcw,
    },
    {
      key: 'quantidade',
      title: 'Quantidade Devolvida',
      description: 'Itens devolvidos',
      value: formatNumber(devolucoesResumo.quantidadeDevolvida, 0),
      color: '#2563EB',
      icon: PackageX,
    },
    {
      key: 'percentual',
      title: 'Percentual sobre Vendas',
      description: 'Percentual do faturamento',
      value: formatPercent(devolucoesResumo.percentualSobreVendas),
      color: getPercentColor(devolucoesResumo.percentualSobreVendas),
      icon: BadgePercent,
    },
    {
      key: 'registros',
      title: 'Quantidade de Registros',
      description: 'Devoluções registradas',
      value: formatNumber(devolucoesResumo.quantidadeRegistros, 0),
      color: '#0EA5E9',
      icon: FileText,
    },
  ]

  return (
    <Card className="h-full rounded-2xl border-border bg-card shadow-[var(--card-elevated-shadow)]">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Resumo de Devoluções
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Indicadores do período selecionado
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {error ? (
          <p className="flex h-full items-center justify-center rounded-xl border border-dashed border-border px-6 text-center text-sm font-medium text-muted-foreground">
            {error}
          </p>
        ) : (
          <div className="grid h-full grid-cols-2 gap-4">
            {indicators.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.key}
                  className="flex min-h-[126px] flex-col justify-between rounded-xl border border-border bg-muted/30 p-4"
                  style={{ borderTopWidth: 3, borderTopColor: item.color }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {item.title}
                      </p>
                      <p className="mt-2 text-xl font-semibold tabular-nums tracking-tight text-foreground">
                        {item.value}
                      </p>
                    </div>
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${item.color} 10%, transparent)`,
                        color: item.color,
                      }}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                  <CardDescription className="text-xs font-medium">
                    {item.description}
                  </CardDescription>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
