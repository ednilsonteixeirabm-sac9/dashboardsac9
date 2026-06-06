import { memo, useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  CHART_COLORS,
  chartAxisTick,
  chartCartesianGrid,
  chartTooltipProps,
} from '@/theme/chartTheme'
import { displayMarca, formatCurrency } from '@/utils/format'
import { tooltipCurrency } from '@/utils/recharts'
import { useFilterStore } from '@/store/filterStore'
import type { TopMarcaLucroDTO } from '@/types/dashboard'

type ChartRow = TopMarcaLucroDTO & { nome: string }

type Props = {
  topMarcasLucro: TopMarcaLucroDTO[]
  loading: boolean
}

export const TopBrandProfitChart = memo(function TopBrandProfitChart({
  topMarcasLucro,
  loading,
}: Props) {
  const setMarcaId = useFilterStore((s) => s.setMarcaId)
  const chartData = useMemo<ChartRow[]>(
    () =>
      topMarcasLucro.map((item) => ({
        ...item,
        nome: displayMarca(item.marcaNome),
      })),
    [topMarcasLucro],
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
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Top 5 Marcas por Lucro
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Clique na barra para filtrar marca
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
                formatter={(value) => tooltipCurrency(value)}
              />
              <Bar
                dataKey="lucro"
                radius={[6, 6, 0, 0]}
                style={{ cursor: 'pointer' }}
                onClick={(_, index) => {
                  const item = chartData[index]
                  if (item?.marcaId != null) setMarcaId(item.marcaId)
                }}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
})
