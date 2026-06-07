import { memo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
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
  chartTooltipProps,
  chartVar,
} from '@/theme/chartTheme'
import { formatCurrency, formatNumber } from '@/utils/format'
import { formatDashboardHour } from '@/utils/dashboardHour'
import { num } from '@/utils/normalize'
import type { VendasHorarioDTO } from '@/types/dashboard'

type Props = {
  vendasHorario: VendasHorarioDTO[]
  loading: boolean
}

type HourlyTooltipProps = {
  active?: boolean
  label?: string | number
  payload?: Array<{ payload?: VendasHorarioDTO }>
}

function HourlyTooltip({ active, label, payload }: HourlyTooltipProps) {
  if (!active) return null

  const row = payload?.[0]?.payload
  const hora = row?.hora ?? num(label)
  const valorVenda = row?.valorVenda ?? 0
  const quantidadeVendida = row?.quantidadeVendida ?? 0

  return (
    <div
      style={chartTooltipProps.contentStyle}
      className="space-y-1 text-sm shadow-[var(--chart-tooltip-shadow)]"
    >
      <p style={chartTooltipProps.labelStyle}>{formatDashboardHour(hora)}</p>
      <p style={chartTooltipProps.itemStyle}>
        Vendas: {formatCurrency(valorVenda)}
      </p>
      <p style={chartTooltipProps.itemStyle}>
        Itens vendidos: {formatNumber(quantidadeVendida, 0)}
      </p>
    </div>
  )
}

export const HourlySalesChart = memo(function HourlySalesChart({
  vendasHorario,
  loading,
}: Props) {
  if (loading) {
    return (
      <Card className="rounded-2xl shadow-[var(--card-elevated-shadow)]">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl border-border bg-card shadow-[var(--card-elevated-shadow)]">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Resumo de Vendas por Horário
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Distribuição de vendas das 00h às 23h
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[340px]">
        {vendasHorario.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sem dados no período
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={vendasHorario}
              margin={{ left: 8, right: 16, bottom: 8 }}
            >
              <CartesianGrid {...chartCartesianGrid} />
              <XAxis
                dataKey="hora"
                tickFormatter={(value) => formatDashboardHour(num(value))}
                tick={chartAxisTick}
                interval={0}
                minTickGap={4}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(num(value))}
                tick={chartAxisTick}
                width={76}
              />
              <Tooltip
                {...chartTooltipProps}
                content={<HourlyTooltip />}
              />
              <Bar
                dataKey="valorVenda"
                fill={chartVar(0)}
                name="Vendas"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
})
