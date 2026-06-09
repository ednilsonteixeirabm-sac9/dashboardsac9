import {
  format,
  isValid,
  parse,
  startOfDay,
  endOfDay,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  subMonths,
  subYears,
  parseISO,
  startOfMonth as monthStart,
  endOfMonth as monthEnd,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function toApiDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/** API/chart date → yyyy-MM-dd for period filters. */
export function isoToApiDay(value: string): string {
  const normalized = value.trim()
  const apiDayMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (apiDayMatch) {
    return `${apiDayMatch[1]}-${apiDayMatch[2]}-${apiDayMatch[3]}`
  }

  const brDayMatch = normalized.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (brDayMatch) {
    return `${brDayMatch[3]}-${brDayMatch[2]}-${brDayMatch[1]}`
  }

  try {
    const parsed = parseISO(normalized)
    if (isValid(parsed)) return toApiDate(parsed)
  } catch {
    // Try known manual display formats below.
  }

  const parsedDisplayDate = parse(normalized, 'dd/MM/yyyy', new Date())
  if (isValid(parsedDisplayDate)) return toApiDate(parsedDisplayDate)

  return normalized
}

export function formatDisplayDate(iso: string): string {
  try {
    return format(parseISO(iso), 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return iso
  }
}

export function formatMonthLabel(yearMonth: string): string {
  try {
    const [y, m] = yearMonth.split('-').map(Number)
    return format(new Date(y, m - 1, 1), 'MMM yyyy', { locale: ptBR })
  } catch {
    return yearMonth
  }
}

export type PeriodRange = {
  dataInicial: string
  dataFinal: string
}

export type PeriodShortcutId =
  | 'hoje'
  | 'ontem'
  | 'ultimos7Dias'
  | 'estaSemana'
  | 'esteMes'
  | 'mesAnterior'
  | 'ultimos30Dias'
  | 'esteAno'
  | 'anoAnterior'
  | 'ultimos12Meses'

export function getPeriodShortcutRange(
  shortcut: PeriodShortcutId,
  today = new Date(),
): PeriodRange {
  const end = today

  switch (shortcut) {
    case 'hoje': {
      const s = toApiDate(end)
      return { dataInicial: s, dataFinal: s }
    }
    case 'ontem': {
      const d = subDays(end, 1)
      const s = toApiDate(d)
      return { dataInicial: s, dataFinal: s }
    }
    case 'ultimos7Dias':
      return {
        dataInicial: toApiDate(subDays(end, 6)),
        dataFinal: toApiDate(end),
      }
    case 'estaSemana':
      return {
        dataInicial: toApiDate(startOfWeek(end, { weekStartsOn: 1 })),
        dataFinal: toApiDate(end),
      }
    case 'esteMes':
      return {
        dataInicial: toApiDate(startOfMonth(end)),
        dataFinal: toApiDate(end),
      }
    case 'mesAnterior': {
      const previousMonth = subMonths(end, 1)
      return {
        dataInicial: toApiDate(startOfMonth(previousMonth)),
        dataFinal: toApiDate(endOfMonth(previousMonth)),
      }
    }
    case 'ultimos30Dias':
      return {
        dataInicial: toApiDate(subDays(end, 29)),
        dataFinal: toApiDate(end),
      }
    case 'esteAno':
      return {
        dataInicial: toApiDate(startOfYear(end)),
        dataFinal: toApiDate(end),
      }
    case 'anoAnterior': {
      const previousYear = subYears(end, 1)
      return {
        dataInicial: toApiDate(startOfYear(previousYear)),
        dataFinal: toApiDate(endOfYear(previousYear)),
      }
    }
    case 'ultimos12Meses':
      return {
        dataInicial: toApiDate(subMonths(end, 12)),
        dataFinal: toApiDate(end),
      }
  }
}

export const periodShortcuts = {
  hoje: () => getPeriodShortcutRange('hoje'),
  ontem: () => getPeriodShortcutRange('ontem'),
  ultimos7Dias: () => getPeriodShortcutRange('ultimos7Dias'),
  estaSemana: () => getPeriodShortcutRange('estaSemana'),
  esteMes: () => getPeriodShortcutRange('esteMes'),
  mesAnterior: () => getPeriodShortcutRange('mesAnterior'),
  ultimos30Dias: () => getPeriodShortcutRange('ultimos30Dias'),
  esteAno: () => getPeriodShortcutRange('esteAno'),
  anoAnterior: () => getPeriodShortcutRange('anoAnterior'),
  ultimos12Meses: () => getPeriodShortcutRange('ultimos12Meses'),
} as const

export function monthKeyFromAnoMes(ano: number, mes: number): string {
  return `${ano}-${String(mes).padStart(2, '0')}`
}

export function monthRangeFromKey(yearMonth: string): {
  dataInicial: string
  dataFinal: string
} {
  const [y, m] = yearMonth.split('-').map(Number)
  const date = new Date(y, m - 1, 1)
  return {
    dataInicial: toApiDate(monthStart(date)),
    dataFinal: toApiDate(monthEnd(date)),
  }
}

export function monthRangeFromAnoMes(
  ano: number,
  mes: number,
): { dataInicial: string; dataFinal: string } {
  return monthRangeFromKey(monthKeyFromAnoMes(ano, mes))
}

export function dayBounds(isoDate: string) {
  const d = parseISO(isoDate)
  return {
    dataInicial: toApiDate(startOfDay(d)),
    dataFinal: toApiDate(endOfDay(d)),
  }
}
