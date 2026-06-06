import { memo, useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
  chartLegendStyle,
  chartPieStroke,
  chartTooltipProps,
} from '@/theme/chartTheme'
import { displayMarca } from '@/utils/format'
import { tooltipCurrency } from '@/utils/recharts'
import { useFilterStore } from '@/store/filterStore'
import type { TopMarcaDTO } from '@/types/dashboard'

type ChartRow = TopMarcaDTO & { nome: string }

type Props = {
  topMarcas: TopMarcaDTO[]
  loading: boolean
}

export const TopBrandsChart = memo(function TopBrandsChart({
  topMarcas,
  loading,
}: Props) {
  const setMarcaId = useFilterStore((s) => s.setMarcaId)
  const chartData = useMemo<ChartRow[]>(
    () =>
      topMarcas.map((item) => ({
        ...item,
        nome: displayMarca(item.marcaNome),
      })),
    [topMarcas],
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
        <CardTitle className="text-base font-semibold">Top 5 marcas</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Clique na fatia para filtrar marca
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {chartData.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sem dados no período
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="valorVendas"
                nameKey="nome"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                stroke={chartPieStroke}
                strokeWidth={2}
                onClick={(_, index) => {
                  const item = chartData[index]
                  if (item?.marcaId != null) setMarcaId(item.marcaId)
                }}
                style={{ cursor: 'pointer' }}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                {...chartTooltipProps}
                formatter={(value) => tooltipCurrency(value)}
              />
              <Legend wrapperStyle={chartLegendStyle} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
})
