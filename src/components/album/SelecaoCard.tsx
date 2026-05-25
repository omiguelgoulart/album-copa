'use client'

import { useState } from 'react'
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
      <div className="flex flex-col gap-1.5">
        <span
          className="self-start text-xs font-bold px-2 py-0.5 rounded"
          style={{ backgroundColor: selecao.cor_bg, color: selecao.cor_fg }}
        >
          {selecao.sigla} — {selecao.nome}
        </span>

        <div className="flex flex-wrap gap-1.5">
          {selecao.figurinhas
            .sort((a, b) => a.numero - b.numero)
            .map((fig) => (
              <button
                key={fig.id}
                onClick={() => setSelected({
                  ...fig,
                  selecao: { nome: selecao.nome, cor_bg: selecao.cor_bg, cor_fg: selecao.cor_fg },
                })}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded border transition-colors active:scale-95 touch-manipulation ${chipStyle[fig.status]}`}
              >
                {fig.codigo}
              </button>
            ))}
        </div>
      </div>

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
