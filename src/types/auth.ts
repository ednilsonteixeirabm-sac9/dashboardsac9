export type LoginRequest = {
  email: string
  senha: string
}

export type UsuarioAuth = {
  nome: string
  email: string
  visualizarDashboard: boolean
  empresaId: string
}

export type LoginResponse = {
  token: string
  usuario: UsuarioAuth
}
