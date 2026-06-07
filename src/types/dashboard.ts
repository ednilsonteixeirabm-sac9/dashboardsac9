export type RegistroVendasProdutosDTO = {
  empresaId: string;
  pedidoId: string;
  pedidoItemId: string;
  devolucao: boolean;
  registroId: string;
  data: string;
  lojaId: number;
  lojaNome: string;
  vendedorId?: number;
  vendedorNome?: string;
  produtoId: number;
  produtoNome: string;
  marcaId?: number;
  marcaNome?: string;
  quantidade: number;
  valorVenda: number;
  valorCusto: number;
  lucro: number;
  cancelado: boolean;
};

export type VendaDiariaDTO = {
  data: string;
  valor: number;
};

export type LucroDiarioDTO = {
  data: string;
  lucro: number;
};

export type VendaMensalDTO = {
  ano: number;
  mes: number;
  valor: number;
};

export type DashboardResumoDTO = {
  totalVendas: number;
  lucroTotal: number;
  ticketMedio: number;
  quantidadeVendida: number;
  margemLucro: number;
  projecaoMes: number;
  totalDesconto: number;
  valorDevolvido: number;
  percentualDevolucao: number;
};

export type DashboardDevolucoesDTO = {
  valorDevolvido: number;
  quantidadeDevolvida: number;
  percentualSobreVendas: number;
  quantidadeRegistros: number;
};

export type TopVendedorDTO = {
  vendedorId?: number;
  vendedorNome: string;
  valorVendas: number;
};

export type TopVendedorLucroDTO = {
  vendedorId?: number;
  vendedorNome: string;
  lucro: number;
};

export type TopVendedorDescontoDTO = {
  vendedorId?: number;
  vendedorNome: string;
  desconto: number;
};

export type TopMarcaDTO = {
  marcaId?: number;
  marcaNome?: string;
  valorVendas: number;
};

export type TopMarcaLucroDTO = {
  marcaId?: number;
  marcaNome?: string;
  lucro: number;
};

export type ParticipacaoMarcaDTO = {
  marcaId?: number;
  marcaNome?: string;
  valor: number;
  percentual: number;
};

export type ParticipacaoLojaDTO = {
  lojaId: number;
  lojaNome: string;
  valorVenda: number;
  percentual: number;
};

export type VendasHorarioDTO = {
  hora: number;
  valorVenda: number;
  quantidadeVendida: number;
};

export type RankingLojaDTO = {
  lojaId: number;
  lojaNome: string;
  valorVendas: number;
  lucro: number;
};

export type ComparativoPeriodoDTO = {
  periodoAtual: number;
  periodoAnterior: number;
  variacaoPercentual: number;
};

export type DevolucaoDTO = {
  valorDevolvido: number;
  percentualDevolucao: number;
  quantidadeDevolucoes: number;
};

export type LojaDTO = {
  lojaId: number;
  lojaNome: string;
};

export type VendedorDTO = {
  vendedorId: number;
  vendedorNome: string;
};

export type MarcaDTO = {
  marcaId: number;
  marcaNome: string;
};

export type FilterState = {
  empresaId: string;
  dataInicial: string;
  dataFinal: string;
  vendedorId?: number;
  lojaId?: number;
  marcaId?: number;
};

export type SelectOption = {
  id: number;
  label: string;
};
