/** Dev: empty string (Vite proxies `/api`). Prod: env or http://localhost:5000. */
export const API_BASE_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_BASE_URL ?? 'https://api.sac9.com.br')
