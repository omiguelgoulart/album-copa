'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useFigurinha } from '@/hooks/useFigurinha'
import { Loader2 } from 'lucide-react'

type Status = 'TENHO' | 'REPETIDA' | 'FALTA'

interface Figurinha {
  id: string
  codigo: string
  status: Status
  selecao: { nome: string; cor_bg: string; cor_fg: string }
}

interface FigurinhaDialogProps {
  figurinha: Figurinha | null
  pin: string
  open: boolean
  onClose: () => void
  onUpdated: () => void
}

const opcoes: { status: Status; label: string; className: string }[] = [
  { status: 'TENHO',    label: '🟢 Tenho',    className: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-300' },
  { status: 'REPETIDA', label: '🟡 Repetida', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300' },
  { status: 'FALTA',    label: '⬜ Falta',    className: 'bg-muted text-muted-foreground hover:bg-muted/80 border-border' },
]

export function FigurinhaDialog({
  figurinha,
  pin,
  open,
  onClose,
  onUpdated,
}: FigurinhaDialogProps) {
  const { update, loading } = useFigurinha(pin)

  if (!figurinha) return null

  async function handleSelect(status: Status) {
    await update(figurinha!.id, status, () => {
      onUpdated()
      onClose()
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <div
            className="w-full py-3 rounded-lg text-center font-bold text-lg mb-1"
            style={{
              backgroundColor: figurinha.selecao.cor_bg,
              color: figurinha.selecao.cor_fg,
            }}
          >
            {figurinha.codigo}
          </div>
          <DialogTitle className="text-center text-base">
            {figurinha.selecao.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-2">
          {opcoes.map((op) => (
            <Button
              key={op.status}
              variant="outline"
              className={`w-full border ${op.className} ${
                figurinha.status === op.status ? 'ring-2 ring-offset-1 ring-current' : ''
              }`}
              disabled={loading}
              onClick={() => handleSelect(op.status)}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {op.label}
              {figurinha.status === op.status && (
                <span className="ml-auto text-xs opacity-60">atual</span>
              )}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
