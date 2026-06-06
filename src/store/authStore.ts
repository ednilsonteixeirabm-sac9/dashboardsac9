import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UsuarioAuth } from '@/types/auth'

type AuthStore = {
  token: string | null
  usuario: UsuarioAuth | null
  empresaId: string
  isAuthenticated: boolean
  login: (token: string, usuario: UsuarioAuth) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      empresaId: '',
      isAuthenticated: false,

      login: (token, usuario) =>
        set({
          token,
          usuario,
          empresaId: usuario.empresaId,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          usuario: null,
          empresaId: '',
          isAuthenticated: false,
        }),
    }),
    {
      name: 'sac9-auth',
      partialize: (state) => ({
        token: state.token,
        usuario: state.usuario,
        empresaId: state.empresaId,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
