import type { CSSProperties } from 'react'
import { chartCssVars, chartVar } from '@/theme/colors'

/** Cores dos gráficos Recharts (variáveis CSS do tema). */
export const CHART_COLORS = chartCssVars.map((v) => `var(${v})`)

export { chartVar }

export const chartAxisTick = {
  fill: 'var(--muted-foreground)',
  fontSize: 11,
  fontWeight: 500,
}

export const chartTooltipProps = {
  contentStyle: {
    backgroundColor: 'var(--card)',
    border: '1px solid color-mix(in srgb, var(--border) 82%, transparent)',
    borderRadius: 'calc(var(--radius) + 6px)',
    boxShadow: 'var(--chart-tooltip-shadow)',
    color: 'var(--foreground)',
    padding: '10px 12px',
  } satisfies CSSProperties,
  labelStyle: {
    color: 'var(--foreground)',
    fontWeight: 700,
    marginBottom: 4,
  } satisfies CSSProperties,
  itemStyle: {
    color: 'var(--foreground)',
    fontWeight: 500,
  } satisfies CSSProperties,
  cursor: { fill: 'var(--accent)', opacity: 0.42 },
}

export const chartCartesianGrid = {
  strokeDasharray: '3 3',
  stroke: 'var(--chart-grid)',
}

export const chartLegendStyle: CSSProperties = {
  color: 'var(--muted-foreground)',
  fontSize: 12,
  fontWeight: 500,
}

export const chartPieStroke = 'var(--card)'
