import {
  format,
  isValid,
  parse,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  subDays,
  subMonths,
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

export const periodShortcuts = {
  hoje: () => {
    const d = new Date()
    const s = toApiDate(d)
    return { dataInicial: s, dataFinal: s }
  },
  ontem: () => {
    const d = subDays(new Date(), 1)
    const s = toApiDate(d)
    return { dataInicial: s, dataFinal: s }
  },
  estaSemana: () => {
    const now = new Date()
    return {
      dataInicial: toApiDate(startOfWeek(now, { weekStartsOn: 1 })),
      dataFinal: toApiDate(endOfWeek(now, { weekStartsOn: 1 })),
    }
  },
  esteMes: () => {
    const now = new Date()
    return {
      dataInicial: toApiDate(startOfMonth(now)),
      dataFinal: toApiDate(endOfMonth(now)),
    }
  },
  ultimos30Dias: () => {
    const end = new Date()
    const start = subDays(end, 29)
    return { dataInicial: toApiDate(start), dataFinal: toApiDate(end) }
  },
  esteAno: () => {
    const end = new Date()
    return {
      dataInicial: toApiDate(startOfYear(end)),
      dataFinal: toApiDate(end),
    }
  },
  ultimos12Meses: () => {
    const end = new Date()
    const start = subMonths(end, 12)
    return { dataInicial: toApiDate(start), dataFinal: toApiDate(end) }
  },
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
