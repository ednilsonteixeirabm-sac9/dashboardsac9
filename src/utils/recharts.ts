import { formatCurrency } from '@/utils/format'
import { isoToApiDay } from '@/utils/dates'
import { num } from '@/utils/normalize'

type ChartClickState = {
  activePayload?: Array<{ payload?: unknown }>
  activeTooltipIndex?: number | string
  activeIndex?: number | string
}

type DailyDateRow = {
  data: string
}

function activeIndexFromState(state: ChartClickState): number | undefined {
  const rawIndex = state.activeTooltipIndex ?? state.activeIndex
  const index =
    typeof rawIndex === 'number'
      ? rawIndex
      : typeof rawIndex === 'string' && /^\d+$/.test(rawIndex)
        ? Number(rawIndex)
        : undefined

  if (index == null) return undefined
  return Number.isInteger(index) && index >= 0 ? index : undefined
}

export function chartClickPayload<T>(
  state: unknown,
  rows?: readonly T[],
): T | undefined {
  const s = state as ChartClickState | null | undefined
  if (!s) return undefined

  const payload = s.activePayload?.[0]?.payload as T | undefined
  if (payload) return payload

  const activeIndex = activeIndexFromState(s)
  return activeIndex != null ? rows?.[activeIndex] : undefined
}

export function applyVendaDiariaDayPeriod(
  row: DailyDateRow | undefined,
  setPeriod: (dataInicial: string, dataFinal: string) => void,
): void {
  if (!row?.data) return
  const day = isoToApiDay(row.data)
  setPeriod(day, day)
}

export function handleDailyChartClick(
  state: unknown,
  setPeriod: (dataInicial: string, dataFinal: string) => void,
  rows?: readonly DailyDateRow[],
): void {
  applyVendaDiariaDayPeriod(
    chartClickPayload<DailyDateRow>(state, rows),
    setPeriod,
  )
}

export function tooltipCurrency(value: unknown): string {
  return formatCurrency(num(value))
}

export function tooltipCurrencyPair(
  value: unknown,
  label: string,
): [string, string] {
  return [formatCurrency(num(value)), label]
}
