import { Button } from '@/components/ui/button'
import { useFilterStore } from '@/store/filterStore'
import { periodShortcuts } from '@/utils/dates'
import { cn } from '@/lib/utils'

const shortcuts = [
  { id: 'hoje', label: 'Hoje', fn: periodShortcuts.hoje },
  { id: 'ontem', label: 'Ontem', fn: periodShortcuts.ontem },
  { id: 'semana', label: 'Esta Semana', fn: periodShortcuts.estaSemana },
  { id: 'mes', label: 'Este Mês', fn: periodShortcuts.esteMes },
  { id: '30d', label: 'Últimos 30 Dias', fn: periodShortcuts.ultimos30Dias },
  { id: 'ano', label: 'Este Ano', fn: periodShortcuts.esteAno },
  { id: '12m', label: 'Últimos 12 Meses', fn: periodShortcuts.ultimos12Meses },
] as const

export function PeriodShortcuts() {
  const setPeriod = useFilterStore((s) => s.setPeriod)
  const dataInicial = useFilterStore((s) => s.dataInicial)
  const dataFinal = useFilterStore((s) => s.dataFinal)

  return (
    <div className="flex max-w-full flex-wrap gap-2">
      {shortcuts.map((s) => {
        const shortcutPeriod = s.fn()
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
