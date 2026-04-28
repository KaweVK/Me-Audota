import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react'

interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

interface UseAsyncReturn<T> extends AsyncState<T> {
  retry: () => void
}

export function useAsync<T>(asyncFn: () => Promise<T>, deps: DependencyList = []): UseAsyncReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, isLoading: true, error: null })
  const [retryCount, setRetryCount] = useState(0)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  useEffect(() => {
    setState({ data: null, isLoading: true, error: null })

    asyncFn().then(
      (data) => { if (mounted.current) setState({ data, isLoading: false, error: null }) },
      (err: unknown) => {
        if (mounted.current) setState({
          data: null,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Erro inesperado.',
        })
      },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, retryCount])

  const retry = useCallback(() => setRetryCount((c) => c + 1), [])

  return { ...state, retry }
}