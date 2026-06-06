import axios, { type AxiosError } from 'axios'
import type {
  DashboardResumoDTO,
  FilterState,
  LojaDTO,
  MarcaDTO,
  ParticipacaoMarcaDTO,
  TopMarcaDTO,
  TopMarcaLucroDTO,
  TopVendedorDescontoDTO,
  TopVendedorDTO,
  TopVendedorLucroDTO,
  VendaDiariaDTO,
  VendaMensalDTO,
  VendedorDTO,
} from '@/types/dashboard'
import {
  normalizeDashboardResumo,
  normalizeLojas,
  normalizeMarcas,
  normalizeParticipacaoMarcas,
  normalizeTopMarcas,
  normalizeTopMarcasLucro,
  normalizeTopVendedoresDesconto,
  normalizeTopVendedores,
  normalizeTopVendedoresLucro,
  normalizeVendasDiarias,
  normalizeVendasMensais,
  normalizeVendedores,
} from '@/utils/normalize'
import { httpClient } from '@/services/httpClient'

const DASHBOARD_ANALYTICS_BASE = '/api/DashboardAnalytics'
const DASHBOARD_PRODUTOS_BASE = '/api/DashboardProdutos'

export function buildQueryParams(filters: FilterState): Record<string, string> {
  const params: Record<string, string> = {
    empresaId: filters.empresaId,
    dataInicial: filters.dataInicial,
    dataFinal: filters.dataFinal,
  }
  if (filters.vendedorId != null) params.vendedorId = String(filters.vendedorId)
  if (filters.lojaId != null) params.lojaId = String(filters.lojaId)
  if (filters.marcaId != null) params.marcaId = String(filters.marcaId)
  return params
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError<{ message?: string; title?: string }>
    const data = ax.response?.data
    if (data?.message) return data.message
    if (data?.title) return data.title
    if (ax.response?.status === 404) return 'Endpoint não encontrado.'
    if (ax.code === 'ERR_NETWORK') {
      return 'Não foi possível conectar à API. Verifique se o backend está em execução.'
    }
    return ax.message
  }
  if (error instanceof Error) return error.message
  return 'Erro desconhecido ao buscar dados.'
}

async function fetchDashboard<T>(
  baseUrl: string,
  endpoint: string,
  filters: FilterState,
  normalize: (data: unknown) => T,
  label: string,
): Promise<T> {
  try {
    const { data } = await httpClient.get<unknown>(
      `${baseUrl}/${endpoint}`,
      { params: buildQueryParams(filters) },
    )
    return normalize(data)
  } catch (error) {
    throw new Error(
      `${label}: ${getApiErrorMessage(error)}`,
      { cause: error },
    )
  }
}

export async function fetchResumo(
  filters: FilterState,
): Promise<DashboardResumoDTO> {
  return fetchDashboard(
    DASHBOARD_ANALYTICS_BASE,
    'resumo',
    filters,
    normalizeDashboardResumo,
    'Não foi possível carregar resumo',
  )
}

export async function fetchVendasDiarias(
  filters: FilterState,
): Promise<VendaDiariaDTO[]> {
  return fetchDashboard(
    DASHBOARD_PRODUTOS_BASE,
    'vendas-diarias',
    filters,
    normalizeVendasDiarias,
    'Não foi possível carregar vendas diárias',
  )
}

export async function fetchVendasMensais(
  filters: FilterState,
): Promise<VendaMensalDTO[]> {
  return fetchDashboard(
    DASHBOARD_PRODUTOS_BASE,
    'vendas-mensais',
    filters,
    normalizeVendasMensais,
    'Não foi possível carregar vendas mensais',
  )
}

export async function fetchTopVendedores(
  filters: FilterState,
): Promise<TopVendedorDTO[]> {
  return fetchDashboard(
    DASHBOARD_PRODUTOS_BASE,
    'top-vendedores',
    filters,
    normalizeTopVendedores,
    'Não foi possível carregar top vendedores',
  )
}

export async function fetchTopVendedoresLucro(
  filters: FilterState,
): Promise<TopVendedorLucroDTO[]> {
  return fetchDashboard(
    DASHBOARD_ANALYTICS_BASE,
    'top-vendedores-lucro',
    filters,
    normalizeTopVendedoresLucro,
    'Não foi possível carregar lucro por vendedor',
  )
}

export async function fetchTopVendedoresDesconto(
  filters: FilterState,
): Promise<TopVendedorDescontoDTO[]> {
  return fetchDashboard(
    DASHBOARD_ANALYTICS_BASE,
    'top-vendedores-desconto',
    filters,
    normalizeTopVendedoresDesconto,
    'Não foi possível carregar descontos por vendedor',
  )
}

export async function fetchTopMarcas(
  filters: FilterState,
): Promise<TopMarcaDTO[]> {
  return fetchDashboard(
    DASHBOARD_PRODUTOS_BASE,
    'top-marcas',
    filters,
    normalizeTopMarcas,
    'Não foi possível carregar top marcas',
  )
}

export async function fetchTopMarcasLucro(
  filters: FilterState,
): Promise<TopMarcaLucroDTO[]> {
  return fetchDashboard(
    DASHBOARD_ANALYTICS_BASE,
    'top-marcas-lucro',
    filters,
    normalizeTopMarcasLucro,
    'Não foi possível carregar lucro por marca',
  )
}

export async function fetchParticipacaoMarcas(
  filters: FilterState,
): Promise<ParticipacaoMarcaDTO[]> {
  return fetchDashboard(
    DASHBOARD_ANALYTICS_BASE,
    'participacao-marcas',
    filters,
    normalizeParticipacaoMarcas,
    'Não foi possível carregar participação das marcas',
  )
}

export async function fetchLojas(filters: FilterState): Promise<LojaDTO[]> {
  return fetchDashboard(
    DASHBOARD_PRODUTOS_BASE,
    'lojas',
    filters,
    normalizeLojas,
    'Não foi possível carregar lojas',
  )
}

export async function fetchVendedores(
  filters: FilterState,
): Promise<VendedorDTO[]> {
  return fetchDashboard(
    DASHBOARD_PRODUTOS_BASE,
    'vendedores',
    filters,
    normalizeVendedores,
    'Não foi possível carregar vendedores',
  )
}

export async function fetchMarcas(filters: FilterState): Promise<MarcaDTO[]> {
  return fetchDashboard(
    DASHBOARD_PRODUTOS_BASE,
    'marcas',
    filters,
    normalizeMarcas,
    'Não foi possível carregar marcas',
  )
}
