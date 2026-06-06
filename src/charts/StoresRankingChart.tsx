import { memo, useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  chartAxisTick,
  chartCartesianGrid,
  chartLegendStyle,
  chartTooltipProps,
  chartVar,
} from '@/theme/chartTheme'
import { formatCurrency } from '@/utils/format'
import { tooltipCurrencyPair } from '@/utils/recharts'
import { useFilterStore } from '@/store/filterStore'
import type { RankingLojaDTO } from '@/types/dashboard'

type ChartRow = RankingLojaDTO & { nome: string }

type Props = {
  rankingLojas: RankingLojaDTO[]
  loading: boolean
}

export const StoresRankingChart = memo(function StoresRankingChart({
  rankingLojas,
  loading,
}: Props) {
  const setLojaId = useFilterStore((s) => s.setLojaId)
  const chartData = useMemo<ChartRow[]>(
    () =>
      rankingLojas.map((item) => ({
        ...item,
        nome: item.lojaNome.trim() ? item.lojaNome : `Loja ${item.lojaId}`,
      })),
    [rankingLojas],
  )

  if (loading) {
    return (
      <Card className="rounded-2xl shadow-[var(--card-elevated-shadow)]">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl border-border bg-card shadow-[var(--card-elevated-shadow)]">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Ranking de Lojas</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Clique em uma barra para filtrar loja
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {chartData.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sem dados no período
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 8, right: 16 }}>
              <CartesianGrid {...chartCartesianGrid} />
              <XAxis dataKey="nome" tick={chartAxisTick} />
              <YAxis
                tickFormatter={(v) => formatCurrency(v)}
                tick={chartAxisTick}
                width={72}
              />
              <Tooltip
                {...chartTooltipProps}
                formatter={(value, name) =>
                  tooltipCurrencyPair(
                    value,
                    name === 'Lucro' ? 'Lucro' : 'Vendas',
                  )
                }
              />
              <Legend wrapperStyle={chartLegendStyle} />
              <Bar
                dataKey="valorVendas"
                fill={chartVar(0)}
                name="Vendas"
                radius={[6, 6, 0, 0]}
                style={{ cursor: 'pointer' }}
                onClick={(_, index) => {
                  const item = chartData[index]
                  if (item?.lojaId > 0) setLojaId(item.lojaId)
                }}
              />
              <Bar
                dataKey="lucro"
                fill={chartVar(1)}
                name="Lucro"
                radius={[6, 6, 0, 0]}
                style={{ cursor: 'pointer' }}
                onClick={(_, index) => {
                  const item = chartData[index]
                  if (item?.lojaId > 0) setLojaId(item.lojaId)
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
})
