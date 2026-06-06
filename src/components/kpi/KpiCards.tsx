import {
  TrendingUp,
  Package,
  Receipt,
  Wallet,
  Percent,
  BadgePercent,
  Target,
  type LucideIcon,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { kpiColors } from '@/theme/sac9-theme'
import { formatCurrency, formatNumber } from '@/utils/format'
import type { DashboardResumoDTO } from '@/types/dashboard'

type Props = {
  resumo: DashboardResumoDTO | null
  loading: boolean
}

type KpiContext = {
  resumo: DashboardResumoDTO
}

type KpiItem = {
  key: string
  title: string
  icon: LucideIcon
  color: string
  format: (v: number) => string
  pick: (context: KpiContext) => number
}

const formatPercent = (value: number) => `${formatNumber(value, 2)}%`

const primaryItems: KpiItem[] = [
  {
    key: 'vendas',
    title: 'Total Vendas',
    icon: TrendingUp,
    color: kpiColors.totalVendas,
    format: (v) => formatCurrency(v),
    pick: ({ resumo }) => resumo.totalVendas,
  },
  {
    key: 'ticket',
    title: 'Ticket Médio',
    icon: Receipt,
    color: kpiColors.ticketMedio,
    format: (v) => formatCurrency(v),
    pick: ({ resumo }) => resumo.ticketMedio,
  },
  {
    key: 'lucro',
    title: 'Lucro',
    icon: Wallet,
    color: kpiColors.lucro,
    format: (v) => formatCurrency(v),
    pick: ({ resumo }) => resumo.lucroTotal,
  },
  {
    key: 'margem',
    title: 'Margem de Lucro',
    icon: Percent,
    color: kpiColors.margemLucro,
    format: formatPercent,
    pick: ({ resumo }) => resumo.margemLucro,
  },
]

const secondaryItems: KpiItem[] = [
  {
    key: 'descontos',
    title: 'Total de Descontos',
    icon: BadgePercent,
    color: kpiColors.totalDescontos,
    format: (v) => formatCurrency(v),
    pick: ({ resumo }) => resumo.totalDesconto,
  },
  {
    key: 'qtd',
    title: 'Quantidade Vendida',
    icon: Package,
    color: kpiColors.quantidadeVendida,
    format: (v) => formatNumber(v, 0),
    pick: ({ resumo }) => resumo.quantidadeVendida,
  },
  {
    key: 'projecao',
    title: 'Projeção do Mês',
    icon: Target,
    color: kpiColors.projecaoMes,
    format: (v) => formatCurrency(v),
    pick: ({ resumo }) => resumo.projecaoMes,
  },
]

const itemRows = [
  { items: primaryItems, className: 'sm:grid-cols-2 xl:grid-cols-4' },
  { items: secondaryItems, className: 'sm:grid-cols-2 xl:grid-cols-3' },
]

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

export function KpiCards({ resumo, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-4">
        {itemRows.map((row, index) => (
          <div key={index} className={`grid gap-4 ${row.className}`}>
            {row.items.map((item) => (
              <Card
                key={item.key}
                className="h-full min-h-[132px] overflow-hidden rounded-2xl shadow-[var(--card-elevated-shadow)]"
              >
                <CardHeader className="px-5 pb-3 pt-5">
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <Skeleton className="h-8 w-28" />
                  <Skeleton className="mt-2 h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    )
  }

  const values: KpiContext = {
    resumo: resumo ?? emptyResumo,
  }

  return (
    <div className="space-y-4">
      {itemRows.map((row, index) => (
        <div key={index} className={`grid gap-4 ${row.className}`}>
          {row.items.map((item) => {
            const Icon = item.icon
            const value = item.pick(values)
            const accentColor = item.color

            return (
              <Card
                key={item.key}
                className="h-full min-h-[132px] overflow-hidden rounded-2xl border-border bg-card shadow-[var(--card-elevated-shadow)] transition-shadow hover:shadow-md"
                style={{ borderTopWidth: 3, borderTopColor: accentColor }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pb-2 pt-4">
                  <CardTitle className="pr-3 text-sm font-medium leading-snug text-muted-foreground">
                    {item.title}
                  </CardTitle>
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
                      color: accentColor,
                    }}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="truncate whitespace-nowrap text-xl font-semibold tabular-nums tracking-tight text-foreground sm:text-2xl">
                    {item.format(value)}
                  </div>
                  <CardDescription className="mt-1.5 text-xs font-medium">
                    Período filtrado
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ))}
    </div>
  )
}
