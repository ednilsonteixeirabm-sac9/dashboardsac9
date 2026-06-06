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
import { displayVendedor, formatCurrency } from '@/utils/format'
import { tooltipCurrency } from '@/utils/recharts'
import { useFilterStore } from '@/store/filterStore'
import type { TopVendedorLucroDTO } from '@/types/dashboard'

type ChartRow = TopVendedorLucroDTO & { nome: string }

type Props = {
  topVendedoresLucro: TopVendedorLucroDTO[]
  loading: boolean
}

export const SellerProfitRankingChart = memo(function SellerProfitRankingChart({
  topVendedoresLucro,
  loading,
}: Props) {
  const setVendedorId = useFilterStore((s) => s.setVendedorId)
  const chartData = useMemo<ChartRow[]>(
    () =>
      topVendedoresLucro.map((item) => ({
        ...item,
        nome: displayVendedor(item.vendedorNome),
      })),
    [topVendedoresLucro],
  )

  if (loading) {
    return (
      <Card className="rounded-2xl shadow-[var(--card-elevated-shadow)]">
        <CardHeader>
          <Skeleton className="h-5 w-56" />
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
          Ranking de Lucro por Vendedor
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Clique na barra para filtrar vendedor
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {chartData.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sem dados no período
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 8, right: 16 }}
            >
              <CartesianGrid {...chartCartesianGrid} />
              <XAxis
                type="number"
                tickFormatter={(v) => formatCurrency(v)}
                tick={chartAxisTick}
              />
              <YAxis
                type="category"
                dataKey="nome"
                width={100}
                tick={chartAxisTick}
              />
              <Tooltip
                {...chartTooltipProps}
                formatter={(value) => tooltipCurrency(value)}
              />
              <Bar
                dataKey="lucro"
                radius={[0, 6, 6, 0]}
                style={{ cursor: 'pointer' }}
                onClick={(_, index) => {
                  const item = chartData[index]
                  if (item?.vendedorId != null && item.vendedorId > 0) {
                    setVendedorId(item.vendedorId)
                  }
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
