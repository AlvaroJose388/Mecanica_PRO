"use client"

import { useState, useCallback } from "react"

interface UseFormStateOptions {
  onSuccess?: (data?: any) => void
  onError?: (error: Error) => void
}

export function useFormState(options?: UseFormStateOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | null> => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await fn()
        options?.onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        options?.onError?.(error)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [options]
  )

  const reset = useCallback(() => {
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    isLoading,
    error,
    execute,
    reset,
  }
}
