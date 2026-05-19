import { useState } from 'react'
import { updateFigurinha } from '@/lib/api'

export function useFigurinha(pin: string | null) {
  const [loading, setLoading] = useState(false)

  async function update(
    id: string,
    status: 'TENHO' | 'REPETIDA' | 'FALTA',
    onSuccess?: () => void
  ) {
    if (!pin) return
    setLoading(true)
    try {
      await updateFigurinha(pin, id, status)
      onSuccess?.()
    } finally {
      setLoading(false)
    }
  }

  return { update, loading }
}
