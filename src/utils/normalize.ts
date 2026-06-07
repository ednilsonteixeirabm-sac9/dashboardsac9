import type {
  ComparativoPeriodoDTO,
  DashboardDevolucoesDTO,
  DashboardResumoDTO,
  DevolucaoDTO,
  LucroDiarioDTO,
  LojaDTO,
  MarcaDTO,
  ParticipacaoLojaDTO,
  ParticipacaoMarcaDTO,
  RankingLojaDTO,
  RegistroVendasProdutosDTO,
  TopMarcaDTO,
  TopMarcaLucroDTO,
  TopVendedorDescontoDTO,
  TopVendedorDTO,
  TopVendedorLucroDTO,
  VendaDiariaDTO,
  VendasHorarioDTO,
  VendaMensalDTO,
  VendedorDTO,
} from '@/types/dashboard'

export function num(v: unknown): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

type Raw = Record<string, unknown>

function pick(raw: Raw, ...keys: string[]): unknown {
  for (const key of keys) {
    if (raw[key] != null) return raw[key]
  }
  return undefined
}

function text(value: unknown): string {
  return value == null ? '' : String(value)
}

function optionalText(value: unknown): string | undefined {
  const normalized = text(value).trim()
  return normalized.length > 0 ? normalized : undefined
}

function optionalId(value: unknown): number | undefined {
  if (value == null || value === '') return undefined
  const normalized = num(value)
  return normalized > 0 ? normalized : undefined
}

function apiHour(value: unknown): number {
  if (typeof value === 'string' && value.trim() === '') return -1
  const hour = Number(value)
  return Number.isInteger(hour) ? hour : -1
}

export function normalizeDashboardResumo(raw: unknown): DashboardResumoDTO {
  const item = (raw && typeof raw === 'object' ? raw : {}) as Raw
  return {
    totalVendas: num(pick(item, 'totalVendas', 'TotalVendas')),
    lucroTotal: num(pick(item, 'lucroTotal', 'LucroTotal')),
    ticketMedio: num(pick(item, 'ticketMedio', 'TicketMedio')),
    quantidadeVendida: num(pick(item, 'quantidadeVendida', 'QuantidadeVendida')),
    margemLucro: num(pick(item, 'margemLucro', 'MargemLucro')),
    projecaoMes: num(pick(item, 'projecaoMes', 'ProjecaoMes')),
    totalDesconto: num(pick(item, 'totalDesconto', 'TotalDesconto')),
    valorDevolvido: num(pick(item, 'valorDevolvido', 'ValorDevolvido')),
    percentualDevolucao: num(
      pick(item, 'percentualDevolucao', 'PercentualDevolucao'),
    ),
  }
}

export function normalizeDashboardDevolucoes(
  raw: unknown,
): DashboardDevolucoesDTO {
  const item = (raw && typeof raw === 'object' ? raw : {}) as Raw
  return {
    valorDevolvido: num(pick(item, 'valorDevolvido', 'ValorDevolvido')),
    quantidadeDevolvida: num(
      pick(item, 'quantidadeDevolvida', 'QuantidadeDevolvida'),
    ),
    percentualSobreVendas: num(
      pick(item, 'percentualSobreVendas', 'PercentualSobreVendas'),
    ),
    quantidadeRegistros: num(
      pick(item, 'quantidadeRegistros', 'QuantidadeRegistros'),
    ),
  }
}

export function normalizeVendaDiariaItem(raw: Raw): VendaDiariaDTO {
  const data = text(pick(raw, 'data', 'Data'))
  return {
    data,
    valor: num(pick(raw, 'valor', 'Valor')),
  }
}

export function normalizeVendasDiarias(items: unknown): VendaDiariaDTO[] {
  if (!Array.isArray(items)) return []
  return items
    .map((item) => normalizeVendaDiariaItem(item as Raw))
    .filter((item) => item.data.length > 0)
    .sort((a, b) => a.data.localeCompare(b.data))
}

export function normalizeLucroDiarioItem(raw: Raw): LucroDiarioDTO {
  const data = text(pick(raw, 'data', 'Data'))
  return {
    data,
    lucro: num(pick(raw, 'lucro', 'Lucro')),
  }
}

export function normalizeLucroDiario(items: unknown): LucroDiarioDTO[] {
  if (!Array.isArray(items)) return []
  return items
    .map((item) => normalizeLucroDiarioItem(item as Raw))
    .filter((item) => item.data.length > 0)
    .sort((a, b) => a.data.localeCompare(b.data))
}

export function normalizeVendaMensalItem(raw: Raw): VendaMensalDTO {
  return {
    ano: num(pick(raw, 'ano', 'Ano')),
    mes: num(pick(raw, 'mes', 'Mes')),
    valor: num(pick(raw, 'valor', 'Valor')),
  }
}

export function normalizeVendasMensais(items: unknown): VendaMensalDTO[] {
  if (!Array.isArray(items)) return []
  return items
    .map((item) => normalizeVendaMensalItem(item as Raw))
    .filter((item) => item.ano > 0 && item.mes >= 1 && item.mes <= 12)
    .sort((a, b) => a.ano - b.ano || a.mes - b.mes)
}

export function normalizeTopVendedorItem(raw: Raw): TopVendedorDTO {
  return {
    vendedorId: optionalId(pick(raw, 'vendedorId', 'VendedorId', 'id', 'Id')),
    vendedorNome: text(pick(raw, 'vendedorNome', 'VendedorNome')),
    valorVendas: num(pick(raw, 'valorVendas', 'ValorVendas', 'valor', 'Valor')),
  }
}

export function normalizeTopVendedores(items: unknown): TopVendedorDTO[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeTopVendedorItem(item as Raw))
}

export function normalizeTopVendedorLucroItem(raw: Raw): TopVendedorLucroDTO {
  return {
    vendedorId: optionalId(pick(raw, 'vendedorId', 'VendedorId', 'id', 'Id')),
    vendedorNome: text(pick(raw, 'vendedorNome', 'VendedorNome')),
    lucro: num(pick(raw, 'lucro', 'Lucro')),
  }
}

export function normalizeTopVendedoresLucro(
  items: unknown,
): TopVendedorLucroDTO[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeTopVendedorLucroItem(item as Raw))
}

export function normalizeTopVendedorDescontoItem(
  raw: Raw,
): TopVendedorDescontoDTO {
  return {
    vendedorId: optionalId(pick(raw, 'vendedorId', 'VendedorId', 'id', 'Id')),
    vendedorNome: text(
      pick(raw, 'vendedorNome', 'VendedorNome', 'nome', 'Nome'),
    ),
    desconto: num(pick(raw, 'desconto', 'Desconto')),
  }
}

export function normalizeTopVendedoresDesconto(
  items: unknown,
): TopVendedorDescontoDTO[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeTopVendedorDescontoItem(item as Raw))
}

export function normalizeTopMarcaItem(raw: Raw): TopMarcaDTO {
  return {
    marcaId: optionalId(pick(raw, 'marcaId', 'MarcaId')),
    marcaNome: optionalText(pick(raw, 'marcaNome', 'MarcaNome')),
    valorVendas: num(pick(raw, 'valorVendas', 'ValorVendas', 'valor', 'Valor')),
  }
}

export function normalizeTopMarcas(items: unknown): TopMarcaDTO[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeTopMarcaItem(item as Raw))
}

export function normalizeTopMarcaLucroItem(raw: Raw): TopMarcaLucroDTO {
  return {
    marcaId: optionalId(pick(raw, 'marcaId', 'MarcaId')),
    marcaNome: optionalText(pick(raw, 'marcaNome', 'MarcaNome')),
    lucro: num(pick(raw, 'lucro', 'Lucro')),
  }
}

export function normalizeTopMarcasLucro(items: unknown): TopMarcaLucroDTO[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeTopMarcaLucroItem(item as Raw))
}

export function normalizeParticipacaoMarcaItem(raw: Raw): ParticipacaoMarcaDTO {
  return {
    marcaId: optionalId(pick(raw, 'marcaId', 'MarcaId')),
    marcaNome: optionalText(pick(raw, 'marcaNome', 'MarcaNome')),
    valor: num(pick(raw, 'valor', 'Valor')),
    percentual: num(pick(raw, 'percentual', 'Percentual')),
  }
}

export function normalizeParticipacaoMarcas(
  items: unknown,
): ParticipacaoMarcaDTO[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeParticipacaoMarcaItem(item as Raw))
}

export function normalizeParticipacaoLojaItem(raw: Raw): ParticipacaoLojaDTO {
  return {
    lojaId: num(pick(raw, 'lojaId', 'LojaId')),
    lojaNome: text(pick(raw, 'lojaNome', 'LojaNome')),
    valorVenda: num(
      pick(raw, 'valorVenda', 'ValorVenda', 'valor', 'Valor'),
    ),
    percentual: num(pick(raw, 'percentual', 'Percentual')),
  }
}

export function normalizeParticipacaoLojas(
  items: unknown,
): ParticipacaoLojaDTO[] {
  if (!Array.isArray(items)) return []
  return items
    .map((item) => normalizeParticipacaoLojaItem(item as Raw))
    .filter((item) => item.lojaId > 0 || item.lojaNome.trim().length > 0)
    .sort((a, b) => b.valorVenda - a.valorVenda)
}

export function normalizeVendasHorarioItem(raw: Raw): VendasHorarioDTO {
  return {
    hora: apiHour(pick(raw, 'hora', 'Hora')),
    valorVenda: num(
      pick(raw, 'valorVenda', 'ValorVenda', 'valor', 'Valor'),
    ),
    quantidadeVendida: num(
      pick(raw, 'quantidadeVendida', 'QuantidadeVendida', 'quantidade', 'Quantidade'),
    ),
  }
}

export function normalizeVendasHorario(items: unknown): VendasHorarioDTO[] {
  const rowsByHour = new Map<number, VendasHorarioDTO>()

  if (Array.isArray(items)) {
    items.forEach((item) => {
      const row = normalizeVendasHorarioItem(item as Raw)
      if (Number.isInteger(row.hora) && row.hora >= 0 && row.hora <= 23) {
        rowsByHour.set(row.hora, row)
      }
    })
  }

  return Array.from({ length: 24 }, (_, hora) => ({
    hora,
    valorVenda: rowsByHour.get(hora)?.valorVenda ?? 0,
    quantidadeVendida: rowsByHour.get(hora)?.quantidadeVendida ?? 0,
  }))
}

export function normalizeRankingLojaItem(raw: Raw): RankingLojaDTO {
  return {
    lojaId: num(pick(raw, 'lojaId', 'LojaId')),
    lojaNome: text(pick(raw, 'lojaNome', 'LojaNome')),
    valorVendas: num(pick(raw, 'valorVendas', 'ValorVendas')),
    lucro: num(pick(raw, 'lucro', 'Lucro')),
  }
}

export function normalizeRankingLojas(items: unknown): RankingLojaDTO[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeRankingLojaItem(item as Raw))
}

export function normalizeComparativoPeriodo(
  raw: unknown,
): ComparativoPeriodoDTO {
  const item = (raw && typeof raw === 'object' ? raw : {}) as Raw
  return {
    periodoAtual: num(pick(item, 'periodoAtual', 'PeriodoAtual')),
    periodoAnterior: num(pick(item, 'periodoAnterior', 'PeriodoAnterior')),
    variacaoPercentual: num(
      pick(item, 'variacaoPercentual', 'VariacaoPercentual'),
    ),
  }
}

export function normalizeDevolucao(raw: unknown): DevolucaoDTO {
  const item = (raw && typeof raw === 'object' ? raw : {}) as Raw
  return {
    valorDevolvido: num(pick(item, 'valorDevolvido', 'ValorDevolvido')),
    percentualDevolucao: num(
      pick(item, 'percentualDevolucao', 'PercentualDevolucao'),
    ),
    quantidadeDevolucoes: num(
      pick(item, 'quantidadeDevolucoes', 'QuantidadeDevolucoes'),
    ),
  }
}

export function normalizeLojaItem(raw: Raw): LojaDTO {
  return {
    lojaId: num(pick(raw, 'lojaId', 'LojaId', 'id', 'Id')),
    lojaNome: text(pick(raw, 'lojaNome', 'LojaNome', 'nome', 'Nome')),
  }
}

export function normalizeLojas(items: unknown): LojaDTO[] {
  if (!Array.isArray(items)) return []
  return items
    .map((item) => normalizeLojaItem(item as Raw))
    .filter((item) => item.lojaId > 0)
    .sort((a, b) => a.lojaNome.localeCompare(b.lojaNome, 'pt-BR'))
}

export function normalizeVendedorItem(raw: Raw): VendedorDTO {
  return {
    vendedorId: num(pick(raw, 'vendedorId', 'VendedorId', 'id', 'Id')),
    vendedorNome: text(pick(raw, 'vendedorNome', 'VendedorNome', 'nome', 'Nome')),
  }
}

export function normalizeVendedores(items: unknown): VendedorDTO[] {
  if (!Array.isArray(items)) return []
  return items
    .map((item) => normalizeVendedorItem(item as Raw))
    .filter((item) => item.vendedorId > 0)
    .sort((a, b) => a.vendedorNome.localeCompare(b.vendedorNome, 'pt-BR'))
}

export function normalizeMarcaItem(raw: Raw): MarcaDTO {
  return {
    marcaId: num(pick(raw, 'marcaId', 'MarcaId', 'id', 'Id')),
    marcaNome: text(pick(raw, 'marcaNome', 'MarcaNome', 'nome', 'Nome')),
  }
}

export function normalizeMarcas(items: unknown): MarcaDTO[] {
  if (!Array.isArray(items)) return []
  return items
    .map((item) => normalizeMarcaItem(item as Raw))
    .filter((item) => item.marcaId > 0)
    .sort((a, b) => a.marcaNome.localeCompare(b.marcaNome, 'pt-BR'))
}

export function normalizeRegistro(raw: Raw): RegistroVendasProdutosDTO {
  return {
    empresaId: text(pick(raw, 'empresaId', 'EmpresaId')),
    pedidoId: text(pick(raw, 'pedidoId', 'PedidoId')),
    pedidoItemId: text(pick(raw, 'pedidoItemId', 'PedidoItemId')),
    devolucao: Boolean(pick(raw, 'devolucao', 'Devolucao')),
    registroId: text(pick(raw, 'registroId', 'RegistroId')),
    data: text(pick(raw, 'data', 'Data')),
    lojaId: num(pick(raw, 'lojaId', 'LojaId')),
    lojaNome: text(pick(raw, 'lojaNome', 'LojaNome')),
    vendedorId:
      raw.vendedorId != null || raw.VendedorId != null
        ? num(pick(raw, 'vendedorId', 'VendedorId'))
        : undefined,
    vendedorNome:
      raw.vendedorNome != null || raw.VendedorNome != null
        ? text(pick(raw, 'vendedorNome', 'VendedorNome'))
        : undefined,
    produtoId: num(pick(raw, 'produtoId', 'ProdutoId')),
    produtoNome: text(pick(raw, 'produtoNome', 'ProdutoNome')),
    marcaId:
      raw.marcaId != null || raw.MarcaId != null
        ? num(pick(raw, 'marcaId', 'MarcaId'))
        : undefined,
    marcaNome:
      raw.marcaNome != null || raw.MarcaNome != null
        ? text(pick(raw, 'marcaNome', 'MarcaNome'))
        : undefined,
    quantidade: num(pick(raw, 'quantidade', 'Quantidade')),
    valorVenda: num(pick(raw, 'valorVenda', 'ValorVenda')),
    valorCusto: num(pick(raw, 'valorCusto', 'ValorCusto')),
    lucro: num(pick(raw, 'lucro', 'Lucro')),
    cancelado: Boolean(pick(raw, 'cancelado', 'Cancelado')),
  }
}

export function normalizeRegistros(items: unknown): RegistroVendasProdutosDTO[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeRegistro(item as Raw))
}
