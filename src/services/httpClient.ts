import axios from 'axios'
import { API_BASE_URL } from '@/services/apiBaseUrl'
import { useAuthStore } from '@/store/authStore'

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
