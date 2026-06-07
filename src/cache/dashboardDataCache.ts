import type { FilterState } from '@/types/dashboard'
import { buildQueryParams } from '@/services/dashboardApi'
import type {
  DashboardDevolucoesDTO,
  DashboardResumoDTO,
  ParticipacaoLojaDTO,
  ParticipacaoMarcaDTO,
  SelectOption,
  TopMarcaDTO,
  TopMarcaLucroDTO,
  TopVendedorDescontoDTO,
  TopVendedorDTO,
  TopVendedorLucroDTO,
  VendaDiariaDTO,
  VendasHorarioDTO,
  VendaMensalDTO,
} from '@/types/dashboard'

export type DashboardCacheEntry = {
  resumo: DashboardResumoDTO
  devolucoesResumo: DashboardDevolucoesDTO
  vendasDiarias: VendaDiariaDTO[]
  vendasMensais: VendaMensalDTO[]
  topVendedores: TopVendedorDTO[]
  topVendedoresLucro: TopVendedorLucroDTO[]
  topVendedoresDesconto: TopVendedorDescontoDTO[]
  topMarcas: TopMarcaDTO[]
  topMarcasLucro: TopMarcaLucroDTO[]
  participacaoMarcas: ParticipacaoMarcaDTO[]
  participacaoLojas: ParticipacaoLojaDTO[]
  vendasHorario: VendasHorarioDTO[]
  lojas: SelectOption[]
  vendedores: SelectOption[]
  marcas: SelectOption[]
}

const cache = new Map<string, DashboardCacheEntry>()

export function dashboardQueryKey(filters: FilterState): string {
  return JSON.stringify(buildQueryParams(filters))
}

export function getDashboardCache(
  key: string,
): DashboardCacheEntry | undefined {
  return cache.get(key)
}

export function setDashboardCache(
  key: string,
  entry: DashboardCacheEntry,
): void {
  cache.set(key, entry)
}

export function deleteDashboardCache(key: string): void {
  cache.delete(key)
}

export function clearDashboardCache(): void {
  cache.clear()
}
