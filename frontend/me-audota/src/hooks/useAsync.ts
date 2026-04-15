import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react'

interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

interface UseAsyncReturn<T> extends AsyncState<T> {
  retry: () => void
}

/**
 * Gerencia o ciclo de vida de uma chamada assíncrona:
 * loading → sucesso | erro, com suporte a retry e cancelamento.
 *
 * @param asyncFn  Função que retorna uma Promise. Deve ser estável (useCallback) ou
 *                 definida fora do componente para evitar loops.
 *
 * @example
 * const { data, isLoading, error, retry } = useAsync(() => getPetById(id), [id])
 */
export function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: DependencyList = [],
): UseAsyncReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: true,
    error: null,
  })
  const [retryCount, setRetryCount] = useState(0)
  // Evita setState em componentes desmontados
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    setState({ data: null, isLoading: true, error: null })

    asyncFn().then(
      (data) => {
        if (mountedRef.current) {
          setState({ data, isLoading: false, error: null })
        }
      },
      (err: unknown) => {
        if (mountedRef.current) {
          setState({
            data: null,
            isLoading: false,
            error: err instanceof Error ? err.message : 'Erro inesperado.',
          })
        }
      },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, retryCount])

  const retry = useCallback(() => setRetryCount((c) => c + 1), [])

  return { ...state, retry }
}