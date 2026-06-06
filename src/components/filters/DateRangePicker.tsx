import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useFilterStore } from '@/store/filterStore'
import { cn } from '@/lib/utils'

export function DateRangePicker() {
  const dataInicial = useFilterStore((s) => s.dataInicial)
  const dataFinal = useFilterStore((s) => s.dataFinal)
  const setPeriod = useFilterStore((s) => s.setPeriod)
  const [open, setOpen] = useState(false)

  const range: DateRange | undefined = {
    from: dataInicial ? parseISO(dataInicial) : undefined,
    to: dataFinal ? parseISO(dataFinal) : undefined,
  }

  const label =
    range.from && range.to
      ? `${format(range.from, 'dd/MM/yyyy', { locale: ptBR })} – ${format(range.to, 'dd/MM/yyyy', { locale: ptBR })}`
      : 'Selecionar período'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start bg-background text-left font-medium shadow-sm hover:border-primary/30 hover:bg-primary/5 hover:text-primary sm:w-[280px]',
            !range.from && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          key={`${dataInicial}-${dataFinal}`}
          mode="range"
          selected={range}
          onSelect={(selected) => {
            if (selected?.from && selected?.to) {
              setPeriod(
                format(selected.from, 'yyyy-MM-dd'),
                format(selected.to, 'yyyy-MM-dd'),
              )
              setOpen(false)
            }
          }}
          numberOfMonths={2}
          defaultMonth={range.from}
        />
      </PopoverContent>
    </Popover>
  )
}
