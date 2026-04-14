import { getStoredToken } from '../auth/authStorage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  auth?: boolean
  body?: BodyInit | null
  json?: unknown
  token?: string | null
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const defaultErrorMessage = (status: number) => {
  if (status === 401) {
    return 'Sua sessao expirou. Entre novamente para continuar.'
  }

  if (status === 403) {
    return 'Voce nao tem permissao para concluir esta acao.'
  }

  if (status === 404) {
    return 'Recurso nao encontrado.'
  }

  return 'Nao foi possivel concluir a requisicao agora.'
}

const extractErrorMessage = (raw: string, status: number) => {
  if (raw.trim().length === 0) {
    return defaultErrorMessage(status)
  }

  try {
    const parsed = JSON.parse(raw) as unknown

    if (isRecord(parsed)) {
      const candidates = [parsed.message, parsed.error, parsed.details]
      const message = candidates.find(
        (value): value is string =>
          typeof value === 'string' && value.trim().length > 0,
      )

      if (message) {
        return message
      }
    }
  } catch {
    return raw
  }

  return raw
}

const unwrapOptionalLike = (payload: unknown) => {
  if (isRecord(payload) && 'value' in payload) {
    return payload.value
  }

  return payload
}

const parseJsonSafely = (raw: string) => {
  if (raw.trim().length === 0) {
    return undefined
  }

  try {
    return JSON.parse(raw) as unknown
  } catch {
    return raw
  }
}

const createHeaders = (
  auth: boolean,
  token: string | null | undefined,
  hasJsonBody: boolean,
  incomingHeaders?: HeadersInit,
) => {
  const headers = new Headers(incomingHeaders)
  headers.set('Accept', 'application/json')

  if (hasJsonBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (auth) {
    const resolvedToken = token ?? getStoredToken()
    if (resolvedToken) {
      headers.set('Authorization', `Bearer ${resolvedToken}`)
    }
  }

  return headers
}

export const request = async <T>(
  path: string,
  {
    auth = true,
    body,
    headers,
    json,
    method = 'GET',
    token,
    ...rest
  }: RequestOptions = {},
): Promise<T> => {
  const hasJsonBody = json !== undefined
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    method,
    body: hasJsonBody ? JSON.stringify(json) : body,
    headers: createHeaders(auth, token, hasJsonBody, headers),
  })

  if (!response.ok) {
    const rawError = await response.text()
    throw new ApiError(extractErrorMessage(rawError, response.status), response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const rawResponse = await response.text()
  const parsedResponse = parseJsonSafely(rawResponse)

  return unwrapOptionalLike(parsedResponse) as T
}
