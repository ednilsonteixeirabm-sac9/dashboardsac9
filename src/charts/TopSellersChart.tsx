import { memo, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
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
import { formatCurrency, displayVendedor } from '@/utils/format'
import { tooltipCurrency } from '@/utils/recharts'
import { useFilterStore } from '@/store/filterStore'
import type { TopVendedorDTO } from '@/types/dashboard'

type ChartRow = TopVendedorDTO & { nome: string }

type Props = {
  topVendedores: TopVendedorDTO[]
  loading: boolean
}

export const TopSellersChart = memo(function TopSellersChart({
  topVendedores,
  loading,
}: Props) {
  const setVendedorId = useFilterStore((s) => s.setVendedorId)
  const chartData = useMemo<ChartRow[]>(
    () =>
      topVendedores.map((item) => ({
        ...item,
        nome: displayVendedor(item.vendedorNome),
      })),
    [topVendedores],
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
        <CardTitle className="text-base font-semibold">Top 5 vendedores</CardTitle>
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
                dataKey="valorVendas"
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
