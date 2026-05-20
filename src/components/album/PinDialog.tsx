'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getStats, ApiError } from '@/lib/api'
import { Loader2, Lock } from 'lucide-react'

interface PinDialogProps {
  open: boolean
  onSuccess: (pin: string) => void
}

export function PinDialog({ open, onSuccess }: PinDialogProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!value.trim()) return
    setLoading(true)
    setError('')

    try {
      await getStats(value)
      onSuccess(value)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.status === 401 || err.status === 403
            ? 'PIN incorreto. Tente novamente.'
            : `Erro na API (${err.status}). Tente mais tarde.`
        )
      } else {
        setError('Sem conexão com a API. Verifique sua internet.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
          <DialogTitle className="text-center">Álbum Copa do Mundo</DialogTitle>
          <DialogDescription className="text-center">
            Digite o PIN para acessar o álbum
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2">
          <Input
            type="password"
            placeholder="PIN"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="text-center text-lg tracking-widest"
            maxLength={10}
          />

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <Button onClick={handleSubmit} disabled={loading || !value.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Entrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
