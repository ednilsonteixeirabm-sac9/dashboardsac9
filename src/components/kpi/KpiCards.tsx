import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BadgePercent,
  BarChart3,
  Boxes,
  CalendarClock,
  DollarSign,
  Package,
  Percent,
  ReceiptText,
  ShoppingCart,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { kpiColors } from "@/theme/sac9-theme";
import { formatCurrency, formatNumber } from "@/utils/format";
import type { DashboardResumoDTO } from "@/types/dashboard";

type Props = {
  resumo: DashboardResumoDTO | null;
  loading: boolean;
};

type KpiContext = {
  resumo: DashboardResumoDTO;
};

type KpiItem = {
  key: string;
  title: string | ((context: KpiContext) => string);
  icon: LucideIcon;
  color: string;
  format: (v: number) => string;
  pick: (context: KpiContext) => number;
  description?: string | ((context: KpiContext) => string);
  variation?: (context: KpiContext) => number;
  previousPeriod?: {
    pick: (context: KpiContext) => number;
    variation: (context: KpiContext) => number;
  };
};

type KpiSection = {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
  items: KpiItem[];
};

const formatPercent = (value: number) => `${formatNumber(value, 2)}%`;
const formatVariationPercent = (value: number) => `${formatNumber(value, 2)}%`;

function renderText(
  value: string | ((context: KpiContext) => string) | undefined,
  context: KpiContext,
  fallback: string,
): string {
  if (!value) return fallback;
  return typeof value === "function" ? value(context) : value;
}

function VariationBadge({ value }: { value: number }) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const sign = isPositive ? "+" : "";
  const arrow = isPositive ? "▲" : isNegative ? "▼" : "•";
  const colorClass = isPositive
    ? "text-emerald-600"
    : isNegative
      ? "text-red-600"
      : "text-muted-foreground";

  return (
    <span className={`text-xs font-semibold tabular-nums ${colorClass}`}>
      {arrow} {sign}
      {formatNumber(value, 1)}%
    </span>
  );
}

function PreviousPeriodLine({
  previousValue,
  variation,
  format,
}: {
  previousValue: number;
  variation: number;
  format: (value: number) => string;
}) {
  const isPositive = variation > 0;
  const isNegative = variation < 0;
  const ArrowIcon = isPositive ? ArrowUp : isNegative ? ArrowDown : ArrowRight;
  const colorClass = isPositive
    ? "text-emerald-600"
    : isNegative
      ? "text-red-600"
      : "text-muted-foreground";

  return (
    <div className="mt-1.5 flex min-h-5 flex-wrap items-center gap-x-1.5 gap-y-1 text-xs font-medium text-muted-foreground">
      <span>Período Anterior: {format(previousValue)}</span>
      <span
        className={`inline-flex items-center gap-0.5 font-semibold tabular-nums ${colorClass}`}
      >
        <ArrowIcon className="h-3.5 w-3.5" aria-hidden />
        {formatVariationPercent(variation)}
      </span>
    </div>
  );
}

const selectedPeriodKpiItems: KpiItem[] = [
  {
    key: "total-vendas",
    title: "Total Vendas",
    icon: DollarSign,
    color: kpiColors.totalVendas,
    format: (v) => formatCurrency(v),
    pick: ({ resumo }) => resumo.totalVendas,
    description: "Receita do período",
    previousPeriod: {
      pick: ({ resumo }) => resumo.totalVendasAnterior,
      variation: ({ resumo }) => resumo.variacaoVendas,
    },
  },
  {
    key: "ticket-medio",
    title: "Ticket Médio",
    icon: ReceiptText,
    color: kpiColors.ticketMedio,
    format: (v) => formatCurrency(v),
    pick: ({ resumo }) => resumo.ticketMedio,
    description: "Média por venda",
    previousPeriod: {
      pick: ({ resumo }) => resumo.ticketMedioAnterior,
      variation: ({ resumo }) => resumo.variacaoTicketMedio,
    },
  },
  {
    key: "lucro",
    title: "Lucro",
    icon: TrendingUp,
    color: kpiColors.lucro,
    format: (v) => formatCurrency(v),
    pick: ({ resumo }) => resumo.lucroTotal,
    description: "Resultado do período",
    previousPeriod: {
      pick: ({ resumo }) => resumo.lucroTotalAnterior,
      variation: ({ resumo }) => resumo.variacaoLucro,
    },
  },
  {
    key: "margem-lucro",
    title: "Margem de Lucro",
    icon: Percent,
    color: kpiColors.quantidadeVendida,
    format: (v) => formatPercent(v),
    pick: ({ resumo }) => resumo.margemLucro,
    description: "Lucro sobre vendas",
    previousPeriod: {
      pick: ({ resumo }) => resumo.margemLucroAnterior,
      variation: ({ resumo }) => resumo.variacaoMargemLucro,
    },
  },

  {
    key: "descontos",
    title: "Total de Descontos",
    icon: BadgePercent,
    color: kpiColors.totalDescontos,
    format: (v) => formatCurrency(v),
    pick: ({ resumo }) => resumo.totalDesconto,
    description: "Descontos concedidos",
    previousPeriod: {
      pick: ({ resumo }) => resumo.totalDescontoAnterior,
      variation: ({ resumo }) => resumo.variacaoDesconto,
    },
  },
  {
    key: "quantidade-vendida",
    title: "Quantidade Vendida",
    icon: Package,
    color: kpiColors.quantidadeVendida,
    format: (v) => formatNumber(v, 0),
    pick: ({ resumo }) => resumo.quantidadeVendida,
    description: "Itens vendidos",
    previousPeriod: {
      pick: ({ resumo }) => resumo.quantidadeVendidaAnterior,
      variation: ({ resumo }) => resumo.variacaoQuantidadeVendida,
    },
  },
  {
    key: "quantidade-vendas",
    title: "Quantidade de Vendas",
    icon: ShoppingCart,
    color: kpiColors.quantidadeVendas,
    format: (v) => formatNumber(v, 0),
    pick: ({ resumo }) => resumo.quantidadeVendasPeriodo,
    description: "Vendas no período",
    previousPeriod: {
      pick: ({ resumo }) => resumo.quantidadeVendasPeriodoAnterior,
      variation: ({ resumo }) => resumo.variacaoQuantidadeVendas,
    },
  },
  {
    key: "pecas-por-venda",
    title: "Peças por Venda",
    icon: Boxes,
    color: kpiColors.pecasPorVenda,
    format: (v) => formatNumber(v, 2),
    pick: ({ resumo }) => resumo.pecasPorVenda,
    description: "Média de itens por venda",
    previousPeriod: {
      pick: ({ resumo }) => resumo.pecasPorVendaAnterior,
      variation: ({ resumo }) => resumo.variacaoPecasPorVenda,
    },
  },
];

const currentMonthKpiItems: KpiItem[] = [
  {
    key: "venda-mes-atual",
    title: "Venda Realizada no Mês",
    icon: DollarSign,
    color: kpiColors.totalVendas,
    format: (v) => formatCurrency(v),
    pick: ({ resumo }) => resumo.vendaMesAtual,
    description: ({ resumo }) =>
      `Ano anterior: ${formatCurrency(resumo.vendaMesAnoAnterior)}`,
    variation: ({ resumo }) => resumo.variacaoMesAnoAnterior,
  },
  {
    key: "lucro-mes-atual",
    title: "Lucro Bruto do Mês",
    icon: DollarSign,
    color: kpiColors.quantidadeVendida,
    format: (v) => formatCurrency(v),
    pick: ({ resumo }) => resumo.lucroMesAtual,
    description: ({ resumo }) =>
      `Ano anterior: ${formatCurrency(resumo.lucroMesAnoAnterior)}`,
    variation: ({ resumo }) => resumo.variacaoLucroMesAnoAnterior,
  },

  {
    key: "venda-hoje",
    title: "Venda Realizada Hoje",
    icon: ReceiptText,
    color: kpiColors.ticketMedio,
    format: (v) => formatCurrency(v),
    pick: ({ resumo }) => resumo.vendaHoje,
    description: "Faturamento realizado hoje",
  },

  {
    key: "projecao-mes",
    title: "Projeção do Mês",
    icon: BarChart3,
    color: kpiColors.projecaoMes,
    format: (v) => formatCurrency(v),
    pick: ({ resumo }) => resumo.projecaoMes,
    description: ({ resumo }) =>
      `Ano anterior: ${formatCurrency(resumo.vendaMesAnoAnteriorCompleto)}`,
    variation: ({ resumo }) => resumo.variacaoProjecaoVsAnoAnterior,
  },
];

const kpiSections: KpiSection[] = [
  {
    key: "mes-atual",
    title: "Mês Atual",
    description: "Acompanhamento do desempenho do mês corrente.",
    icon: CalendarClock,
    items: currentMonthKpiItems,
  },
  {
    key: "periodo-selecionado",
    title: "Período Selecionado",
    description: "Indicadores calculados considerando os filtros aplicados.",
    icon: BarChart3,
    items: selectedPeriodKpiItems,
  },
];

const emptyResumo: DashboardResumoDTO = {
  totalVendas: 0,
  totalVendasAnterior: 0,
  variacaoVendas: 0,
  ticketMedio: 0,
  ticketMedioAnterior: 0,
  variacaoTicketMedio: 0,
  lucroTotal: 0,
  lucroMesAtual: 0,
  lucroMesAnoAnterior: 0,
  variacaoLucroMesAnoAnterior: 0,
  lucroTotalAnterior: 0,
  variacaoLucro: 0,
  margemLucro: 0,
  margemLucroAnterior: 0,
  variacaoMesAnoAnterior: 0,
  vendaMesAnoAnteriorCompleto: 0,
  variacaoMargemLucro: 0,
  totalDesconto: 0,
  totalDescontoAnterior: 0,
  variacaoDesconto: 0,
  quantidadeVendida: 0,
  quantidadeVendidaAnterior: 0,
  variacaoQuantidadeVendida: 0,
  projecaoMes: 0,
  quantidadeVendasPeriodo: 0,
  quantidadeVendasPeriodoAnterior: 0,
  variacaoQuantidadeVendas: 0,
  pecasPorVenda: 0,
  pecasPorVendaAnterior: 0,
  variacaoPecasPorVenda: 0,
  vendaMesmoPeriodoAnoAnterior: 0,
  variacaoMesmoPeriodoAnoAnterior: 0,
  vendaMesAnoAnterior: 0,
  variacaoProjecaoVsAnoAnterior: 0,
  vendaMesAtual: 0,
  vendaHoje: 0,
};

function KpiCard({ item, values }: { item: KpiItem; values: KpiContext }) {
  const Icon = item.icon;
  const value = item.pick(values);
  const accentColor = item.color;
  const description = renderText(item.description, values, "Período filtrado");
  const title = renderText(item.title, values, "");
  const variation = item.variation != null ? item.variation(values) : null;
  const previousPeriod =
    item.previousPeriod != null
      ? {
          value: item.previousPeriod.pick(values),
          variation: item.previousPeriod.variation(values),
        }
      : null;

  return (
    <Card
      className="h-full min-h-[132px] overflow-hidden rounded-2xl border-border bg-card shadow-[var(--card-elevated-shadow)] transition-shadow hover:shadow-md"
      style={{ borderTopWidth: 3, borderTopColor: accentColor }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pb-2 pt-4">
        <CardTitle className="pr-3 text-sm font-medium leading-snug text-muted-foreground">
          {title}
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
        {previousPeriod != null ? (
          <PreviousPeriodLine
            previousValue={previousPeriod.value}
            variation={previousPeriod.variation}
            format={item.format}
          />
        ) : (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <CardDescription className="text-xs font-medium">
              {description}
            </CardDescription>
            {variation != null && <VariationBadge value={variation} />}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function KpiCardSkeleton() {
  return (
    <Card className="h-full min-h-[132px] overflow-hidden rounded-2xl shadow-[var(--card-elevated-shadow)]">
      <CardHeader className="px-5 pb-3 pt-5">
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="mt-2 h-4 w-24" />
      </CardContent>
    </Card>
  );
}

function KpiSectionCard({
  section,
  values,
  loading,
}: {
  section: KpiSection;
  values: KpiContext;
  loading: boolean;
}) {
  const SectionIcon = section.icon;

  return (
    <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-[var(--card-elevated-shadow)]">
      <CardHeader className="border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-primary">
            <SectionIcon className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <CardTitle className="text-sm font-semibold">
              {section.title}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {section.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {section.items.map((item) =>
            loading ? (
              <KpiCardSkeleton key={item.key} />
            ) : (
              <KpiCard key={item.key} item={item} values={values} />
            ),
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function KpiCards({ resumo, loading }: Props) {
  const values: KpiContext = {
    resumo: resumo ?? emptyResumo,
  };

  return (
    <div className="space-y-6">
      {kpiSections.map((section) => (
        <KpiSectionCard
          key={section.key}
          section={section}
          values={values}
          loading={loading}
        />
      ))}
    </div>
  );
}
