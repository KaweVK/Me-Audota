import axios, { AxiosError, type AxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

const extractErrorMessage = (error: AxiosError): string => {
  const status = error.response?.status
  const data = error.response?.data as Record<string, unknown> | undefined | string

  if (status === 401) {
    return 'A sua sessão expirou. Entre novamente para continuar.'
  }

  if (status === 403) {
    return 'Não tem permissão para concluir esta ação.'
  }

  if (status === 404) {
    return 'Recurso não encontrado.'
  }

  if (data) {
    if (typeof data === 'string' && data.trim().length > 0) return data
    if (typeof data === 'object') {
      const message = data.message || data.error || data.details
      if (typeof message === 'string' && message.trim().length > 0) {
        return message
      }
    }
  }

  return 'Não foi possível concluir o pedido agora.'
}

interface RequestOptions extends Omit<AxiosRequestConfig, 'url' | 'data'> {
  json?: unknown
}

export const request = async <T>(
  path: string,
  { json, method = 'GET', ...rest }: RequestOptions = {},
): Promise<T> => {
  try {
    const response = await apiClient.request<T>({
      url: path,
      method,
      data: json,
      ...rest,
    })

    if (response.status === 204) {
      return undefined as T
    }

    const payload = response.data as any
    if (payload && typeof payload === 'object' && 'value' in payload) {
      return payload.value as T
    }

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500
      const message = extractErrorMessage(error)
      throw new ApiError(message, status)
    }
    
    throw new ApiError('Ocorreu um erro inesperado.', 500)
  }
}