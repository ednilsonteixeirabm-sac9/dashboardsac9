import {
  CalendarDays,
  Filter,
  RotateCcw,
  Store,
  Tags,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useFilterStore } from '@/store/filterStore'
import { PeriodShortcuts } from '@/components/filters/PeriodShortcuts'
import { DateRangePicker } from '@/components/filters/DateRangePicker'
import { cn } from '@/lib/utils'
import type { SelectOption } from '@/types/dashboard'

type Props = {
  lojas: SelectOption[]
  vendedores: SelectOption[]
  marcas: SelectOption[]
  disabled?: boolean
}

function EntitySelect({
  label,
  value,
  options,
  onChange,
  disabled,
  icon: Icon,
}: {
  label: string
  value?: number
  options: SelectOption[]
  onChange: (id?: number) => void
  disabled?: boolean
  icon: LucideIcon
}) {
  const selectValue = value != null ? String(value) : 'all'
  const isActive = value != null

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" aria-hidden />
        {label}
      </Label>
      <Select
        value={selectValue}
        onValueChange={(v) => onChange(v === 'all' ? undefined : Number(v))}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            'bg-background shadow-sm transition-colors',
            isActive && 'border-primary/40 bg-primary/5 text-primary',
          )}
        >
          <SelectValue placeholder="Todos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.id} value={String(o.id)}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function GlobalFilters({ lojas, vendedores, marcas, disabled }: Props) {
  const vendedorId = useFilterStore((s) => s.vendedorId)
  const lojaId = useFilterStore((s) => s.lojaId)
  const marcaId = useFilterStore((s) => s.marcaId)
  const dataInicial = useFilterStore((s) => s.dataInicial)
  const dataFinal = useFilterStore((s) => s.dataFinal)
  const setVendedorId = useFilterStore((s) => s.setVendedorId)
  const setLojaId = useFilterStore((s) => s.setLojaId)
  const setMarcaId = useFilterStore((s) => s.setMarcaId)
  const resetFilters = useFilterStore((s) => s.resetFilters)
  const activeEntityFilters = [
    lojaId != null && 'Loja',
    vendedorId != null && 'Vendedor',
    marcaId != null && 'Marca',
  ].filter((value): value is string => Boolean(value))

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(260px,280px)_1fr_auto] xl:items-end">
        <div className="flex w-full min-w-0 flex-col gap-2">
          <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-primary" aria-hidden />
            Período manual
          </Label>
          <DateRangePicker />
        </div>
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Filter className="h-4 w-4 text-primary" aria-hidden />
            Atalhos de período
          </p>
          <PeriodShortcuts />
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full shrink-0 bg-background font-medium hover:border-primary/30 hover:bg-primary/5 hover:text-primary xl:w-auto"
          onClick={() => resetFilters()}
          disabled={disabled}
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Limpar filtros
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <EntitySelect
          label="Loja"
          value={lojaId}
          options={lojas}
          onChange={setLojaId}
          disabled={disabled}
          icon={Store}
        />
        <EntitySelect
          label="Vendedor"
          value={vendedorId}
          options={vendedores}
          onChange={setVendedorId}
          disabled={disabled}
          icon={UserRound}
        />
        <EntitySelect
          label="Marca"
          value={marcaId}
          options={marcas}
          onChange={setMarcaId}
          disabled={disabled}
          icon={Tags}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Filtros ativos:
        </span>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {dataInicial} até {dataFinal}
        </span>
        {activeEntityFilters.length > 0 ? (
          activeEntityFilters.map((filter) => (
            <span
              key={String(filter)}
              className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-foreground"
            >
              {filter}
            </span>
          ))
        ) : (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            Todas as entidades
          </span>
        )}
      </div>
    </div>
  )
}
