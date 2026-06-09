import { Button } from '@/components/ui/button'
import { useFilterStore } from '@/store/filterStore'
import {
  getPeriodShortcutRange,
  type PeriodShortcutId,
} from '@/utils/dates'
import { cn } from '@/lib/utils'

const shortcuts = [
  { id: 'hoje', label: 'Hoje' },
  { id: 'ontem', label: 'Ontem' },
  { id: 'ultimos7Dias', label: 'Últimos 7 Dias' },
  { id: 'estaSemana', label: 'Esta Semana' },
  { id: 'esteMes', label: 'Este Mês' },
  { id: 'mesAnterior', label: 'Mês Anterior' },
  { id: 'ultimos30Dias', label: 'Últimos 30 Dias' },
  { id: 'esteAno', label: 'Este Ano' },
  { id: 'anoAnterior', label: 'Ano Anterior' },
  { id: 'ultimos12Meses', label: 'Últimos 12 Meses' },
] as const satisfies ReadonlyArray<{
  id: PeriodShortcutId
  label: string
}>

export function PeriodShortcuts() {
  const setPeriod = useFilterStore((s) => s.setPeriod)
  const dataInicial = useFilterStore((s) => s.dataInicial)
  const dataFinal = useFilterStore((s) => s.dataFinal)

  return (
    <div className="flex max-w-full flex-wrap gap-2">
      {shortcuts.map((s) => {
        const shortcutPeriod = getPeriodShortcutRange(s.id)
        const isSelected =
          shortcutPeriod.dataInicial === dataInicial &&
          shortcutPeriod.dataFinal === dataFinal

        return (
          <Button
            key={s.id}
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              'shrink-0 bg-card text-xs font-medium shadow-sm hover:border-primary/30 hover:bg-primary/5 hover:text-primary sm:text-sm',
              isSelected &&
                'border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
            )}
            onClick={() => {
              setPeriod(shortcutPeriod.dataInicial, shortcutPeriod.dataFinal)
            }}
          >
            {s.label}
          </Button>
        )
      })}
    </div>
  )
}
