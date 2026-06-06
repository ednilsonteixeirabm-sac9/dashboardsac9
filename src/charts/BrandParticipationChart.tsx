import { memo, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { displayMarca, formatNumber } from '@/utils/format'
import { useFilterStore } from '@/store/filterStore'
import type { ParticipacaoMarcaDTO, SelectOption } from '@/types/dashboard'

type ChartRow = ParticipacaoMarcaDTO & {
  nome: string
  marcaId?: number
  isOutras?: boolean
}

type Props = {
  participacaoMarcas: ParticipacaoMarcaDTO[]
  marcas: SelectOption[]
  loading: boolean
}

const TOP_BRANDS_LIMIT = 10

function normalizeLabel(value: string) {
  return value.trim().toLocaleLowerCase('pt-BR')
}

function buildMarcaIdByName(marcas: SelectOption[]) {
  const idsByName = new Map<string, number[]>()

  marcas.forEach((marca) => {
    const key = normalizeLabel(marca.label)
    const ids = idsByName.get(key)
    if (ids) {
      ids.push(marca.id)
      return
    }
    idsByName.set(key, [marca.id])
  })

  const uniqueIdsByName = new Map<string, number>()
  idsByName.forEach((ids, name) => {
    if (ids.length === 1) uniqueIdsByName.set(name, ids[0])
  })

  return uniqueIdsByName
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

export const BrandParticipationChart = memo(function BrandParticipationChart({
  participacaoMarcas,
  marcas,
  loading,
}: Props) {
  const setMarcaId = useFilterStore((s) => s.setMarcaId)
  const selectedMarcaId = useFilterStore((s) => s.marcaId)

  const chartData = useMemo<ChartRow[]>(() => {
    const marcaIdByName = buildMarcaIdByName(marcas)
    const orderedRows = participacaoMarcas
      .map((item) => {
        const nome = displayMarca(item.marcaNome)
        return {
          ...item,
          nome,
          marcaId: item.marcaId ?? marcaIdByName.get(normalizeLabel(nome)),
        }
      })
      .sort((a, b) => b.percentual - a.percentual)

    const topRows = orderedRows.slice(0, TOP_BRANDS_LIMIT)
    const otherRows = orderedRows.slice(TOP_BRANDS_LIMIT)
    const outras = otherRows.reduce(
      (acc, item) => ({
        valor: acc.valor + item.valor,
        percentual: acc.percentual + item.percentual,
      }),
      { valor: 0, percentual: 0 },
    )

    if (outras.valor <= 0 && outras.percentual <= 0) return topRows

    return [
      ...topRows,
      {
        nome: 'OUTRAS',
        marcaNome: 'OUTRAS',
        valor: outras.valor,
        percentual: outras.percentual,
        isOutras: true,
      },
    ]
  }, [marcas, participacaoMarcas])

  const canFilterRow = (item: ChartRow) => !item.isOutras && item.marcaId != null

  const handleRowClick = (item: ChartRow) => {
    if (canFilterRow(item)) setMarcaId(item.marcaId)
  }

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
              Participação das Marcas
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Ranking Top 10
            </CardDescription>
          </div>
          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            Top 3 em destaque
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
              const isSelected = item.marcaId === selectedMarcaId
              const filterable = canFilterRow(item)
              const width =
                maxParticipation > 0
                  ? Math.max((item.percentual / maxParticipation) * 100, 2)
                  : 0
              const accent = getRankAccent(index)

              return (
                <button
                  key={`${item.nome}-${index}`}
                  type="button"
                  className={[
                    'group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border px-4 py-3 text-left text-sm transition-all disabled:opacity-100',
                    accent.row,
                    filterable
                      ? 'cursor-pointer hover:border-primary/25 hover:bg-primary/5'
                      : 'cursor-default',
                    isSelected ? 'ring-2 ring-primary/30' : '',
                  ].join(' ')}
                  onClick={() => handleRowClick(item)}
                  disabled={!filterable}
                  aria-pressed={isSelected}
                  title={
                    item.isOutras
                      ? 'OUTRAS agrupa marcas fora do Top 10'
                      : undefined
                  }
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

                  <span className="w-24 text-right">
                    <span className="block font-semibold tabular-nums text-foreground">
                      {formatNumber(item.percentual, 2)}%
                    </span>
                    <span className="block text-xs font-medium tabular-nums text-muted-foreground">
                      {formatNumber(item.valor, 0)}
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
