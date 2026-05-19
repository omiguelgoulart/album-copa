'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { SelecaoCard } from './SelecaoCard'

interface GrupoViewProps {
  grupo: any
  pin: string
  onBack: () => void
  onUpdated: () => void
}

export function GrupoView({ grupo, pin, onBack, onUpdated }: GrupoViewProps) {
  const [index, setIndex] = useState(0)
  const selecoes: any[] = grupo.selecoes
  const current = selecoes[index]
  const label = grupo.nome === 'ESP' ? 'Especiais' : `Grupo ${grupo.nome}`

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="flex-1 font-bold text-lg">{label}</h2>
        <span className="text-sm text-muted-foreground">
          {index + 1} / {selecoes.length}
        </span>
      </div>

      {/* Seleção atual */}
      <SelecaoCard selecao={current} pin={pin} onUpdated={onUpdated} />

      {/* Navegação prev/next */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setIndex((i) => i - 1)}
          disabled={index === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setIndex((i) => i + 1)}
          disabled={index === selecoes.length - 1}
        >
          Próxima
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Dots de progresso */}
      <div className="flex justify-center gap-1.5 flex-wrap">
        {selecoes.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === index
                ? 'bg-foreground scale-125'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
