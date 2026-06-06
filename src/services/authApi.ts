import axios, { type AxiosError } from 'axios'
import type { LoginRequest, LoginResponse, UsuarioAuth } from '@/types/auth'
import { API_BASE_URL } from '@/services/apiBaseUrl'

const authHttpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

type UsuarioRaw = {
  nome?: string
  Nome?: string
  email?: string
  Email?: string
  visualizarDashboard?: boolean
  VisualizarDashboard?: boolean
  empresaId?: string
  EmpresaId?: string
}

type LoginRaw = {
  token?: string
  Token?: string
  usuario?: UsuarioRaw
  Usuario?: UsuarioRaw
}

function normalizeUsuario(raw: unknown): UsuarioAuth {
  const r = (raw ?? {}) as UsuarioRaw
  return {
    nome: String(r.nome ?? r.Nome ?? ''),
    email: String(r.email ?? r.Email ?? ''),
    visualizarDashboard: Boolean(
      r.visualizarDashboard ?? r.VisualizarDashboard ?? false,
    ),
    empresaId: String(r.empresaId ?? r.EmpresaId ?? ''),
  }
}

function normalizeLoginResponse(raw: unknown): LoginResponse {
  const r = (raw ?? {}) as LoginRaw
  const token = String(r.token ?? r.Token ?? '')
  const usuario = normalizeUsuario(r.usuario ?? r.Usuario)
  return { token, usuario }
}

export function getAuthErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError<{ message?: string; title?: string }>
    const status = ax.response?.status
    const data = ax.response?.data
    if (status === 401 || status === 403) {
      return 'E-mail ou senha inválidos.'
    }
    if (data?.message) return data.message
    if (data?.title) return data.title
    if (ax.code === 'ERR_NETWORK') {
      return 'Não foi possível conectar à API. Verifique se o backend está em execução.'
    }
    return ax.message
  }
  if (error instanceof Error) return error.message
  return 'Não foi possível realizar o login.'
}

export async function login(email: string, senha: string): Promise<LoginResponse> {
  const payload: LoginRequest = { email, senha }
  try {
    const { data } = await authHttpClient.post<unknown>(
      '/api/DashboardUsuarios/login',
      payload,
    )
    const response = normalizeLoginResponse(data)
    if (!response.token || !response.usuario?.email) {
      throw new Error('Resposta de login inválida.')
    }
    return response
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(getAuthErrorMessage(error), { cause: error })
    }
    throw new Error(getAuthErrorMessage(error), { cause: error })
  }
}
