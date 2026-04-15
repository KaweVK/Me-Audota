import axios, { AxiosError, type AxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'
let unauthorizedHandler: (() => void) | null = null

export const registerUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Cliente Axios base.
 * Content-Type NÃO está nos defaults globais para permitir que o axios
 * detecte automaticamente FormData e defina multipart/form-data com boundary.
 * JSON requests definem o header manualmente via campo `json` do helper `request`.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface RequestOptions extends Omit<AxiosRequestConfig, 'url' | 'data'> {
  /** Corpo JSON — define Content-Type: application/json automaticamente */
  json?: unknown
  /** Corpo genérico (FormData, etc.) — Content-Type inferido pelo axios */
  data?: FormData | unknown
}

// ---------------------------------------------------------------------------
// Extração de mensagem de erro
// ---------------------------------------------------------------------------

const STATUS_MESSAGES: Record<number, string> = {
  401: 'A sua sessão expirou. Entre novamente para continuar.',
  403: 'Não tem permissão para concluir esta ação.',
  404: 'Recurso não encontrado.',
}

const extractErrorMessage = (error: AxiosError): string => {
  const status = error.response?.status
  if (status && STATUS_MESSAGES[status]) return STATUS_MESSAGES[status]

  const data = error.response?.data
  if (typeof data === 'string' && data.trim()) return data
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    const message = obj.message ?? obj.error ?? obj.details
    if (typeof message === 'string' && message.trim()) return message
  }

  return 'Não foi possível concluir o pedido agora.'
}

// ---------------------------------------------------------------------------
// Helper principal
// ---------------------------------------------------------------------------

export const request = async <T>(
  path: string,
  { json, data, method = 'GET', headers, ...rest }: RequestOptions = {},
): Promise<T> => {
  const isJson = json !== undefined
  const body = isJson ? json : data

  const response = await apiClient
    .request<T>({
      url: path,
      method,
      data: body,
      // Apenas define Content-Type para JSON; FormData recebe o header do axios
      headers: isJson
        ? { 'Content-Type': 'application/json', ...headers }
        : headers,
      ...rest,
    })
    .catch((error: unknown) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 500
        if (status === 401) {
          unauthorizedHandler?.()
        }
        throw new ApiError(extractErrorMessage(error), status)
      }
      throw new ApiError('Ocorreu um erro inesperado.', 500)
    })

  if (response.status === 204) return undefined as T

  // Suporte legado a respostas `{ value: T }` do Spring (Optional<T> serializado)
  const payload = response.data as Record<string, unknown> | null
  if (payload && typeof payload === 'object' && 'value' in payload) {
    return payload.value as T
  }

  return response.data
}