import { memo, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
  chartTooltipProps,
} from '@/theme/chartTheme'
import { chartVar } from '@/theme/colors'
import { formatCurrency } from '@/utils/format'
import { chartClickPayload, tooltipCurrencyPair } from '@/utils/recharts'
import {
  formatMonthLabel,
  monthKeyFromAnoMes,
  monthRangeFromAnoMes,
} from '@/utils/dates'
import { useFilterStore } from '@/store/filterStore'
import type { VendaMensalDTO } from '@/types/dashboard'

type ChartRow = VendaMensalDTO & { month: string }

type Props = {
  vendasMensais: VendaMensalDTO[]
  loading: boolean
}

const fillId = 'fillVendasMensais'

export const MonthlySalesChart = memo(function MonthlySalesChart({
  vendasMensais,
  loading,
}: Props) {
  const setPeriod = useFilterStore((s) => s.setPeriod)
  const chartData = useMemo<ChartRow[]>(
    () =>
      vendasMensais.map((item) => ({
        ...item,
        month: monthKeyFromAnoMes(item.ano, item.mes),
      })),
    [vendasMensais],
  )

  const strokeColor = chartVar(0)

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
        <CardTitle className="text-base font-semibold">Vendas mensais</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Clique em um mês para filtrar o período
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {chartData.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sem dados no período
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              onClick={(state) => {
                const payload = chartClickPayload<ChartRow>(state, chartData)
                if (payload) {
                  const { dataInicial, dataFinal } = monthRangeFromAnoMes(
                    payload.ano,
                    payload.mes,
                  )
                  setPeriod(dataInicial, dataFinal)
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <defs>
                <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.45} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...chartCartesianGrid} />
              <XAxis
                dataKey="month"
                tickFormatter={(v) => formatMonthLabel(String(v))}
                tick={chartAxisTick}
              />
              <YAxis
                tickFormatter={(v) => formatCurrency(v)}
                tick={chartAxisTick}
                width={72}
              />
              <Tooltip
                {...chartTooltipProps}
                formatter={(value) => tooltipCurrencyPair(value, 'Vendas')}
                labelFormatter={(label) => formatMonthLabel(String(label))}
              />
              <Area
                type="monotone"
                dataKey="valor"
                stroke={strokeColor}
                fill={`url(#${fillId})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
})
