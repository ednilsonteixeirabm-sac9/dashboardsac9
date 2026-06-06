import { create } from 'zustand'
import { subDays, format } from 'date-fns'
import { clearDashboardCache } from '@/cache/dashboardDataCache'

function defaultDates() {
  const end = new Date()
  const start = subDays(end, 29)
  return {
    dataInicial: format(start, 'yyyy-MM-dd'),
    dataFinal: format(end, 'yyyy-MM-dd'),
  }
}

export type DateFilterState = {
  dataInicial: string
  dataFinal: string
  /** Bumped on every setPeriod so refetch runs even when dates are unchanged. */
  periodTick: number
  vendedorId?: number
  lojaId?: number
  marcaId?: number
}

type FilterStore = DateFilterState & {
  setDataInicial: (dataInicial: string) => void
  setDataFinal: (dataFinal: string) => void
  setPeriod: (dataInicial: string, dataFinal: string) => void
  setVendedorId: (vendedorId?: number) => void
  setLojaId: (lojaId?: number) => void
  setMarcaId: (marcaId?: number) => void
  resetFilters: () => void
}

const defaults = defaultDates()

export const useFilterStore = create<FilterStore>((set) => ({
  dataInicial: defaults.dataInicial,
  dataFinal: defaults.dataFinal,
  periodTick: 0,
  vendedorId: undefined,
  lojaId: undefined,
  marcaId: undefined,
  setDataInicial: (dataInicial) => set({ dataInicial }),
  setDataFinal: (dataFinal) => set({ dataFinal }),
  setPeriod: (dataInicial, dataFinal) => {
    clearDashboardCache()
    set((state) => ({
      dataInicial,
      dataFinal,
      periodTick: state.periodTick + 1,
    }))
  },
  setVendedorId: (vendedorId) => set({ vendedorId }),
  setLojaId: (lojaId) => set({ lojaId }),
  setMarcaId: (marcaId) => set({ marcaId }),
  resetFilters: () => {
    clearDashboardCache()
    set((state) => ({
      ...defaultDates(),
      periodTick: state.periodTick + 1,
      vendedorId: undefined,
      lojaId: undefined,
      marcaId: undefined,
    }))
  },
}))
