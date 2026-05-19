import { useState, useEffect, useCallback, useRef } from 'react'
import { getGrupos } from '@/lib/api'

export function useAlbum(pin: string | null) {
  const [grupos, setGrupos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasData = useRef(false)

  const fetch = useCallback(() => {
    if (!pin) return
    if (!hasData.current) setLoading(true)
    getGrupos(pin)
      .then((data) => {
        setGrupos(data)
        hasData.current = true
      })
      .catch(() => setError('Erro ao carregar álbum'))
      .finally(() => setLoading(false))
  }, [pin])

  useEffect(() => { fetch() }, [fetch])

  return { grupos, loading, error, refetch: fetch }
}
