import { memo } from 'react'
import {
  LineChart,
  Line,
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
import {
  applyVendaDiariaDayPeriod,
  handleDailyChartClick,
  tooltipCurrencyPair,
} from '@/utils/recharts'
import { formatDisplayDate } from '@/utils/dates'
import { useFilterStore } from '@/store/filterStore'
import type { VendaDiariaDTO } from '@/types/dashboard'

type Props = {
  vendasDiarias: VendaDiariaDTO[]
  loading: boolean
}

export const DailySalesChart = memo(function DailySalesChart({
  vendasDiarias,
  loading,
}: Props) {
  const setPeriod = useFilterStore((s) => s.setPeriod)

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
        <CardTitle className="text-base font-semibold">Vendas diárias</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Clique em um dia para filtrar o período
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {vendasDiarias.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sem dados no período
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={vendasDiarias}
              onClick={(state) =>
                handleDailyChartClick(state, setPeriod, vendasDiarias)
              }
              style={{ cursor: 'pointer' }}
            >
              <CartesianGrid {...chartCartesianGrid} />
              <XAxis
                dataKey="data"
                tickFormatter={(v) => formatDisplayDate(String(v))}
                tick={chartAxisTick}
              />
              <YAxis
                tickFormatter={(v) =>
                  formatCurrency(v).replace(/\s/g, '\u00a0')
                }
                tick={chartAxisTick}
                width={72}
              />
              <Tooltip
                {...chartTooltipProps}
                formatter={(value) => tooltipCurrencyPair(value, 'Vendas')}
                labelFormatter={(label) => formatDisplayDate(String(label))}
              />
              <Line
                type="monotone"
                dataKey="valor"
                stroke={chartVar(0)}
                strokeWidth={2}
                dot={{ r: 3, fill: chartVar(0), cursor: 'pointer' }}
                activeDot={{ r: 5, fill: chartVar(0), cursor: 'pointer' }}
                onClick={(point) => {
                  applyVendaDiariaDayPeriod(
                    (point as { payload?: VendaDiariaDTO }).payload,
                    setPeriod,
                  )
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
})
