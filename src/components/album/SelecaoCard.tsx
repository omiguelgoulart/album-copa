'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { FigurinhaDialog } from './FigurinhaDialog'

type Status = 'TENHO' | 'REPETIDA' | 'FALTA'

interface Figurinha {
  id: string
  codigo: string
  numero: number
  status: Status
  selecao: { nome: string; cor_bg: string; cor_fg: string }
}

interface Selecao {
  id: string
  nome: string
  sigla: string
  cor_bg: string
  cor_fg: string
  figurinhas: Figurinha[]
}

interface SelecaoCardProps {
  selecao: Selecao
  pin: string
  onUpdated: () => void
}

const chipStyle: Record<Status, string> = {
  TENHO:    'bg-green-100 text-green-800 border-green-200',
  REPETIDA: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  FALTA:    'bg-background text-muted-foreground border-border',
}

export function SelecaoCard({ selecao, pin, onUpdated }: SelecaoCardProps) {
  const [selected, setSelected] = useState<Figurinha | null>(null)

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader
          className="px-3 py-2"
          style={{ backgroundColor: selecao.cor_bg, color: selecao.cor_fg }}
        >
          <span className="text-xs font-bold tracking-wide">
            {selecao.sigla} — {selecao.nome}
          </span>
        </CardHeader>

        <CardContent className="grid grid-cols-5 gap-1.5 p-3">
          {selecao.figurinhas
            .sort((a, b) => a.numero - b.numero)
            .map((fig) => (
              <button
                key={fig.id}
                onClick={() => setSelected({
                  ...fig,
                  selecao: { nome: selecao.nome, cor_bg: selecao.cor_bg, cor_fg: selecao.cor_fg },
                })}
                className={`text-xs font-semibold py-1.5 rounded border text-center transition-colors active:scale-95 touch-manipulation ${chipStyle[fig.status]}`}
              >
                {fig.codigo}
              </button>
            ))}
        </CardContent>
      </Card>

      <FigurinhaDialog
        figurinha={selected}
        pin={pin}
        open={!!selected}
        onClose={() => setSelected(null)}
        onUpdated={onUpdated}
      />
    </>
  )
}
