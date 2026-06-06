import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { format, startOfMonth } from 'date-fns'
import {
  type DashboardCacheEntry,
  dashboardQueryKey,
  deleteDashboardCache,
  getDashboardCache,
  setDashboardCache,
} from '@/cache/dashboardDataCache'
import { useAuthStore } from '@/store/authStore'
import { useFilterStore } from '@/store/filterStore'
import {
  fetchLojas,
  fetchMarcas,
  fetchParticipacaoMarcas,
  fetchResumo,
  fetchTopMarcas,
  fetchTopMarcasLucro,
  fetchTopVendedores,
  fetchTopVendedoresDesconto,
  fetchTopVendedoresLucro,
  fetchVendasDiarias,
  fetchVendasMensais,
  fetchVendedores,
  getApiErrorMessage,
} from '@/services/dashboardApi'
import type { FilterState } from '@/types/dashboard'
import type {
  DashboardResumoDTO,
  LojaDTO,
  MarcaDTO,
  ParticipacaoMarcaDTO,
  SelectOption,
  TopMarcaDTO,
  TopMarcaLucroDTO,
  TopVendedorDescontoDTO,
  TopVendedorDTO,
  TopVendedorLucroDTO,
  VendaDiariaDTO,
  VendaMensalDTO,
  VendedorDTO,
} from '@/types/dashboard'

function lojasToOptions(items: LojaDTO[]): SelectOption[] {
  return items.map((item) => ({ id: item.lojaId, label: item.lojaNome }))
}

function vendedoresToOptions(items: VendedorDTO[]): SelectOption[] {
  return items.map((item) => ({
    id: item.vendedorId,
    label: item.vendedorNome,
  }))
}

function marcasToOptions(items: MarcaDTO[]): SelectOption[] {
  return items.map((item) => ({ id: item.marcaId, label: item.marcaNome }))
}

const emptyResumo: DashboardResumoDTO = {
  totalVendas: 0,
  lucroTotal: 0,
  ticketMedio: 0,
  quantidadeVendida: 0,
  margemLucro: 0,
  projecaoMes: 0,
  totalDesconto: 0,
  valorDevolvido: 0,
  percentualDevolucao: 0,
}

const emptyEntry: DashboardCacheEntry = {
  resumo: emptyResumo,
  vendasDiarias: [],
  vendasMensais: [],
  topVendedores: [],
  topVendedoresLucro: [],
  topVendedoresDesconto: [],
  topMarcas: [],
  topMarcasLucro: [],
  participacaoMarcas: [],
  lojas: [],
  vendedores: [],
  marcas: [],
}

const DASHBOARD_REFETCH_DEBOUNCE_MS = 400

function currentMonthGoalPayload(empresaId: string): FilterState {
  const today = new Date()
  return {
    empresaId,
    dataInicial: format(startOfMonth(today), 'yyyy-MM-dd'),
    dataFinal: format(today, 'yyyy-MM-dd'),
  }
}

export function useDashboardData() {
  const empresaId = useAuthStore((s) => s.empresaId)
  const filters = useFilterStore()
  const periodTick = useFilterStore((s) => s.periodTick)
  const [state, setState] = useState<DashboardCacheEntry>(emptyEntry)
  const [goalResumo, setGoalResumo] = useState<DashboardResumoDTO>(emptyResumo)
  const [loading, setLoading] = useState(false)
  const [goalLoading, setGoalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [goalError, setGoalError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const goalAbortRef = useRef<AbortController | null>(null)
  const hasLoadedRef = useRef(false)
  const hasLoadedGoalRef = useRef(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [hasLoadedGoal, setHasLoadedGoal] = useState(false)

  const load = useCallback(async () => {
    if (!empresaId.trim()) {
      setState(emptyEntry)
      setError(null)
      setLoading(false)
      hasLoadedRef.current = false
      setHasLoaded(false)
      return
    }

    void periodTick

    const filterPayload: FilterState = {
      empresaId,
      dataInicial: filters.dataInicial,
      dataFinal: filters.dataFinal,
      vendedorId: filters.vendedorId,
      lojaId: filters.lojaId,
      marcaId: filters.marcaId,
    }

    const key = dashboardQueryKey(filterPayload)
    const cached = getDashboardCache(key)
    if (cached) {
      setState(cached)
      setError(null)
      setLoading(false)
      hasLoadedRef.current = true
      setHasLoaded(true)
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    try {
      const results = await Promise.allSettled([
        fetchResumo(filterPayload),
        fetchVendasDiarias(filterPayload),
        fetchVendasMensais(filterPayload),
        fetchTopVendedores(filterPayload),
        fetchTopVendedoresLucro(filterPayload),
        fetchTopVendedoresDesconto(filterPayload),
        fetchTopMarcas(filterPayload),
        fetchTopMarcasLucro(filterPayload),
        fetchParticipacaoMarcas(filterPayload),
        fetchLojas(filterPayload),
        fetchVendedores(filterPayload),
        fetchMarcas(filterPayload),
      ])

      if (controller.signal.aborted) return

      const failures = results
        .map((result, index) => ({ result, index }))
        .filter(
          (entry): entry is { result: PromiseRejectedResult; index: number } =>
            entry.result.status === 'rejected',
        )

      if (failures.length > 0) {
        const labels = [
          'resumo',
          'vendas diárias',
          'vendas mensais',
          'top vendedores',
          'lucro por vendedor',
          'descontos por vendedor',
          'top marcas',
          'lucro por marca',
          'participação das marcas',
          'lojas',
          'vendedores',
          'marcas',
        ]
        const messages = failures.map(({ result, index }) => {
          const reason = result.reason
          const detail =
            reason instanceof Error ? reason.message : getApiErrorMessage(reason)
          return `${labels[index]} (${detail})`
        })
        if (!hasLoadedRef.current) setState(emptyEntry)
        setError(messages.join(' · '))
        return
      }

      const [
        resumo,
        vendasDiarias,
        vendasMensais,
        topVendedores,
        topVendedoresLucro,
        topVendedoresDesconto,
        topMarcas,
        topMarcasLucro,
        participacaoMarcas,
        lojasRaw,
        vendedoresRaw,
        marcasRaw,
      ] = results.map((r) => (r as PromiseFulfilledResult<unknown>).value)

      const entry: DashboardCacheEntry = {
        resumo: resumo as DashboardResumoDTO,
        vendasDiarias: vendasDiarias as VendaDiariaDTO[],
        vendasMensais: vendasMensais as VendaMensalDTO[],
        topVendedores: topVendedores as TopVendedorDTO[],
        topVendedoresLucro: topVendedoresLucro as TopVendedorLucroDTO[],
        topVendedoresDesconto:
          topVendedoresDesconto as TopVendedorDescontoDTO[],
        topMarcas: topMarcas as TopMarcaDTO[],
        topMarcasLucro: topMarcasLucro as TopMarcaLucroDTO[],
        participacaoMarcas: participacaoMarcas as ParticipacaoMarcaDTO[],
        lojas: lojasToOptions(lojasRaw as LojaDTO[]),
        vendedores: vendedoresToOptions(vendedoresRaw as VendedorDTO[]),
        marcas: marcasToOptions(marcasRaw as MarcaDTO[]),
      }

      setDashboardCache(key, entry)
      setState(entry)
      hasLoadedRef.current = true
      setHasLoaded(true)
    } catch (err) {
      if (controller.signal.aborted) return
      if (!hasLoadedRef.current) setState(emptyEntry)
      setError(getApiErrorMessage(err))
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [
    empresaId,
    filters.dataInicial,
    filters.dataFinal,
    filters.vendedorId,
    filters.lojaId,
    filters.marcaId,
    periodTick,
  ])

  const loadGoalResumo = useCallback(async () => {
    if (!empresaId.trim()) {
      setGoalResumo(emptyResumo)
      setGoalError(null)
      setGoalLoading(false)
      hasLoadedGoalRef.current = false
      setHasLoadedGoal(false)
      return
    }

    goalAbortRef.current?.abort()
    const controller = new AbortController()
    goalAbortRef.current = controller

    setGoalLoading(true)
    setGoalError(null)

    try {
      const resumoMensal = await fetchResumo(currentMonthGoalPayload(empresaId))
      if (controller.signal.aborted) return
      setGoalResumo(resumoMensal)
      hasLoadedGoalRef.current = true
      setHasLoadedGoal(true)
    } catch (err) {
      if (controller.signal.aborted) return
      if (!hasLoadedGoalRef.current) setGoalResumo(emptyResumo)
      setGoalError(getApiErrorMessage(err))
    } finally {
      if (!controller.signal.aborted) setGoalLoading(false)
    }
  }, [empresaId])

  useEffect(() => {
    const delay = hasLoadedRef.current ? DASHBOARD_REFETCH_DEBOUNCE_MS : 0
    const timeoutId = window.setTimeout(() => {
      void load()
    }, delay)
    return () => {
      window.clearTimeout(timeoutId)
      abortRef.current?.abort()
    }
  }, [load])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadGoalResumo()
    }, 0)
    return () => {
      window.clearTimeout(timeoutId)
      goalAbortRef.current?.abort()
    }
  }, [loadGoalResumo])

  const refetch = useCallback(() => {
    const currentFilters = useFilterStore.getState()
    const filterPayload: FilterState = {
      empresaId: useAuthStore.getState().empresaId,
      dataInicial: currentFilters.dataInicial,
      dataFinal: currentFilters.dataFinal,
      vendedorId: currentFilters.vendedorId,
      lojaId: currentFilters.lojaId,
      marcaId: currentFilters.marcaId,
    }
    deleteDashboardCache(dashboardQueryKey(filterPayload))
    void load()
    void loadGoalResumo()
  }, [load, loadGoalResumo])

  const combinedError = useMemo(
    () => [error, goalError].filter(Boolean).join(' · ') || null,
    [error, goalError],
  )

  const hasData = useMemo(
    () =>
      state.vendasDiarias.length > 0 ||
      state.vendasMensais.length > 0 ||
      state.resumo.totalVendas > 0 ||
      state.resumo.totalDesconto > 0 ||
      state.resumo.quantidadeVendida > 0,
    [state],
  )

  return {
    resumo: state.resumo,
    goalResumo,
    vendasDiarias: state.vendasDiarias,
    vendasMensais: state.vendasMensais,
    topVendedores: state.topVendedores,
    topVendedoresLucro: state.topVendedoresLucro,
    topVendedoresDesconto: state.topVendedoresDesconto,
    topMarcas: state.topMarcas,
    topMarcasLucro: state.topMarcasLucro,
    participacaoMarcas: state.participacaoMarcas,
    lojas: state.lojas,
    vendedores: state.vendedores,
    marcas: state.marcas,
    loading,
    initialLoading: loading && !hasLoaded,
    refreshing: loading && hasLoaded,
    goalLoading,
    goalInitialLoading: goalLoading && !hasLoadedGoal,
    goalRefreshing: goalLoading && hasLoadedGoal,
    error: combinedError,
    refetch,
    hasEmpresa: Boolean(empresaId.trim()),
    hasData,
  }
}
