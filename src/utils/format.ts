export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function displayVendedor(nome?: string | null): string {
  return nome?.trim() ? nome : 'Sem vendedor'
}

export function displayMarca(nome?: string | null): string {
  return nome?.trim() ? nome : 'Sem marca'
}
