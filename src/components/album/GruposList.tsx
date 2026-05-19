'use client'

import { ChevronRight } from 'lucide-react'

interface Figurinha {
  status: 'TENHO' | 'REPETIDA' | 'FALTA'
}

interface Selecao {
  figurinhas: Figurinha[]
}

interface Grupo {
  id: string
  nome: string
  selecoes: Selecao[]
}

interface GruposListProps {
  grupos: Grupo[]
  onSelect: (grupo: Grupo) => void
}

function grupoProgress(grupo: Grupo) {
  const all = grupo.selecoes.flatMap((s) => s.figurinhas)
  const tenho = all.filter((f) => f.status === 'TENHO').length
  return { tenho, total: all.length }
}

export function GruposList({ grupos, onSelect }: GruposListProps) {
  return (
    <div className="flex flex-col gap-2">
      {grupos.map((grupo) => {
        const { tenho, total } = grupoProgress(grupo)
        const pct = total > 0 ? Math.round((tenho / total) * 100) : 0
        const label = grupo.nome === 'ESP' ? 'Especiais' : `Grupo ${grupo.nome}`

        return (
          <button
            key={grupo.id}
            onClick={() => onSelect(grupo)}
            className="flex items-center gap-4 rounded-xl border bg-card px-4 py-3 text-left transition-colors hover:bg-accent active:scale-[0.99]"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{label}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {tenho}/{total}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
          </button>
        )
      })}
    </div>
  )
}
