import type { RegistroVendasProdutosDTO } from '@/types/dashboard'

/** Usado apenas quando registros RAW forem carregados (ex.: tabela/auditoria). */
export function filterActiveRecords(
  records: RegistroVendasProdutosDTO[],
): RegistroVendasProdutosDTO[] {
  return records.filter((r) => !r.cancelado)
}
