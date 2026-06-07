import { memo, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFilterStore } from '@/store/filterStore'
import { formatCurrency, formatNumber } from '@/utils/format'
import type { ParticipacaoLojaDTO } from '@/types/dashboard'

type ChartRow = ParticipacaoLojaDTO & {
  nome: string
  isOutras?: boolean
}

type Props = {
  participacaoLojas: ParticipacaoLojaDTO[]
  loading: boolean
}

const TOP_STORES_LIMIT = 10

function displayLoja(item: ParticipacaoLojaDTO): string {
  return item.lojaNome.trim() ? item.lojaNome : `Loja ${item.lojaId}`
}

function getRankAccent(index: number) {
  if (index === 0) {
    return {
      row: 'border-primary/25 bg-primary/5',
      rank: 'bg-primary text-primary-foreground',
      bar: 'from-primary to-primary/70',
    }
  }

  if (index === 1) {
    return {
      row: 'border-border bg-card',
      rank: 'bg-primary/15 text-primary',
      bar: 'from-primary/80 to-primary/45',
    }
  }

  if (index === 2) {
    return {
      row: 'border-border bg-card',
      rank: 'bg-secondary/20 text-foreground',
      bar: 'from-secondary to-secondary/50',
    }
  }

  return {
    row: 'border-border/70 bg-card',
    rank: 'bg-muted text-muted-foreground',
    bar: 'from-muted-foreground/70 to-muted-foreground/35',
  }
}

export const StoreParticipationChart = memo(function StoreParticipationChart({
  participacaoLojas,
  loading,
}: Props) {
  const setLojaId = useFilterStore((s) => s.setLojaId)
  const selectedLojaId = useFilterStore((s) => s.lojaId)

  const chartData = useMemo<ChartRow[]>(() => {
    const orderedRows = participacaoLojas
      .map((item) => ({
        ...item,
        nome: displayLoja(item),
      }))
      .sort((a, b) => b.valorVenda - a.valorVenda)

    const topRows = orderedRows.slice(0, TOP_STORES_LIMIT)
    const otherRows = orderedRows.slice(TOP_STORES_LIMIT)
    const outras = otherRows.reduce(
      (acc, item) => ({
        valorVenda: acc.valorVenda + item.valorVenda,
        percentual: acc.percentual + item.percentual,
      }),
      { valorVenda: 0, percentual: 0 },
    )

    if (outras.valorVenda <= 0 && outras.percentual <= 0) return topRows

    return [
      ...topRows,
      {
        lojaId: 0,
        lojaNome: 'OUTRAS',
        nome: 'OUTRAS',
        valorVenda: outras.valorVenda,
        percentual: outras.percentual,
        isOutras: true,
      },
    ]
  }, [participacaoLojas])

  const maxParticipation = Math.max(
    ...chartData.map((item) => item.percentual),
    0,
  )

  if (loading) {
    return (
      <Card className="rounded-2xl shadow-[var(--card-elevated-shadow)]">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl border-border bg-card shadow-[var(--card-elevated-shadow)]">
      <CardHeader className="border-b border-border">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold">
              Participação das Lojas
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Ranking Top 10 por valor vendido
            </CardDescription>
          </div>
          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            Clique para filtrar
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {chartData.length === 0 ? (
          <p className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            Sem dados no período
          </p>
        ) : (
          <div className="space-y-2">
            {chartData.map((item, index) => {
              const isSelected = item.lojaId === selectedLojaId
              const filterable = !item.isOutras && item.lojaId > 0
              const width =
                maxParticipation > 0
                  ? Math.max((item.percentual / maxParticipation) * 100, 2)
                  : 0
              const accent = getRankAccent(index)

              return (
                <button
                  key={`${item.lojaId}-${item.nome}-${index}`}
                  type="button"
                  className={[
                    'group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border px-4 py-3 text-left text-sm transition-all disabled:opacity-100',
                    accent.row,
                    filterable
                      ? 'cursor-pointer hover:border-primary/25 hover:bg-primary/5'
                      : 'cursor-default',
                    isSelected ? 'ring-2 ring-primary/30' : '',
                  ].join(' ')}
                  onClick={() => {
                    if (filterable) setLojaId(item.lojaId)
                  }}
                  disabled={!filterable}
                  aria-pressed={isSelected}
                  title={`${item.nome}: ${formatCurrency(item.valorVenda)} (${formatNumber(item.percentual, 2)}%)`}
                >
                  <span
                    className={[
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums',
                      accent.rank,
                    ].join(' ')}
                  >
                    {index + 1}
                  </span>

                  <span className="min-w-0 space-y-2">
                    <span className="flex min-w-0 items-center justify-between gap-3">
                      <span className="truncate font-medium text-foreground">
                        {item.nome}
                      </span>
                    </span>
                    <span className="block h-3 overflow-hidden rounded-full bg-muted shadow-inner">
                      <span
                        className={[
                          'block h-full rounded-full bg-gradient-to-r transition-[width]',
                          accent.bar,
                        ].join(' ')}
                        style={{ width: `${width}%` }}
                      />
                    </span>
                  </span>

                  <span className="w-28 text-right">
                    <span className="block font-semibold tabular-nums text-foreground">
                      {formatNumber(item.percentual, 2)}%
                    </span>
                    <span className="block text-xs font-medium tabular-nums text-muted-foreground">
                      {formatCurrency(item.valorVenda)}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
})
