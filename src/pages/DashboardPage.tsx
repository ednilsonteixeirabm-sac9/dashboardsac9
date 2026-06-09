import { AlertCircle, Inbox, Loader2, SlidersHorizontal } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { GlobalFilters } from '@/components/filters/GlobalFilters'
import { KpiCards } from '@/components/kpi/KpiCards'
import { GoalProgressCard } from '@/components/kpi/GoalProgressCard'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useDashboardData } from '@/hooks/useDashboardData'
import { DailySalesChart } from '@/charts/DailySalesChart'
import { MonthlySalesChart } from '@/charts/MonthlySalesChart'
import { TopSellersChart } from '@/charts/TopSellersChart'
import { TopBrandsChart } from '@/charts/TopBrandsChart'
import { TopBrandProfitChart } from '@/charts/TopBrandProfitChart'
import { SellerProfitRankingChart } from '@/charts/SellerProfitRankingChart'
import { BrandParticipationChart } from '@/charts/BrandParticipationChart'
import { TopSellersDiscountChart } from '@/charts/TopSellersDiscountChart'
import { StoreParticipationChart } from '@/charts/StoreParticipationChart'
import { HourlySalesChart } from '@/charts/HourlySalesChart'
import { ReturnsSummaryCard } from '@/charts/ReturnsSummaryCard'

export function DashboardPage() {
  const {
    resumo,
    devolucoesResumo,
    goalResumo,
    vendasDiarias,
    vendasMensais,
    topVendedores,
    topVendedoresLucro,
    topVendedoresDesconto,
    topMarcas,
    topMarcasLucro,
    participacaoMarcas,
    participacaoLojas,
    vendasHorario,
    loading,
    initialLoading,
    refreshing,
    error,
    devolucoesError,
    lojas,
    vendedores,
    marcas,
    hasEmpresa,
    goalInitialLoading,
    goalRefreshing,
    hasData,
  } = useDashboardData()

  const showLoading = initialLoading && hasEmpresa
  const showRefreshing = refreshing && hasEmpresa
  const showGoalLoading = goalInitialLoading && hasEmpresa
  const showUpdating = showRefreshing || (goalRefreshing && hasEmpresa)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 lg:px-8">
        

        <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-[var(--card-elevated-shadow)]">
          <CardHeader className="border-b border-border px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-primary">
                  <SlidersHorizontal className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Filtros globais
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Refine período, loja, vendedor e marca para atualizar a visão.
                  </CardDescription>
                </div>
              </div>
              {showUpdating && (
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"
                  role="status"
                  aria-live="polite"
                >
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  Atualizando...
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            <GlobalFilters
              lojas={lojas}
              vendedores={vendedores}
              marcas={marcas}
              disabled={!hasEmpresa && !loading}
            />
          </CardContent>
        </Card>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro na API</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!hasEmpresa && !loading && (
          <Alert>
            <Inbox className="h-4 w-4" />
            <AlertTitle>Informe a empresa</AlertTitle>
            <AlertDescription>
              Digite o <strong>Empresa ID</strong> (GUID) para carregar os dados do
              dashboard. A API deve estar em execução em{' '}
              <code className="text-xs">http://localhost:5000</code>.
            </AlertDescription>
          </Alert>
        )}

        <KpiCards resumo={hasEmpresa ? resumo : null} loading={showLoading} />

        <GoalProgressCard
          resumo={hasEmpresa ? goalResumo : null}
          loading={showGoalLoading}
        />

        {hasEmpresa && !showLoading && !hasData && !error && (
          <p className="text-center text-sm text-muted-foreground">
            Nenhum dado encontrado para os filtros selecionados.
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <DailySalesChart vendasDiarias={vendasDiarias} loading={showLoading} />
          <MonthlySalesChart
            vendasMensais={vendasMensais}
            loading={showLoading}
          />
          <TopSellersChart topVendedores={topVendedores} loading={showLoading} />
          <TopBrandsChart topMarcas={topMarcas} loading={showLoading} />
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <TopBrandProfitChart
            topMarcasLucro={topMarcasLucro}
            loading={showLoading}
          />
          <SellerProfitRankingChart
            topVendedoresLucro={topVendedoresLucro}
            loading={showLoading}
          />
          <TopSellersDiscountChart
            topVendedoresDesconto={topVendedoresDesconto}
            loading={showLoading}
          />
          <ReturnsSummaryCard
            devolucoesResumo={devolucoesResumo}
            loading={showLoading}
            error={devolucoesError}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <StoreParticipationChart
            participacaoLojas={participacaoLojas}
            loading={showLoading}
          />
          <BrandParticipationChart
            participacaoMarcas={participacaoMarcas}
            marcas={marcas}
            loading={showLoading}
          />
        </div>

        <div>
          <HourlySalesChart
            vendasHorario={vendasHorario}
            loading={showLoading}
          />
        </div>
      </main>
    </div>
  )
}
