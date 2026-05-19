'use client'

import { SelecaoCard } from './SelecaoCard'

interface GrupoSectionProps {
  grupo: {
    id: string
    nome: string
    selecoes: any[]
  }
  pin: string
  onUpdated: () => void
}

export function GrupoSection({ grupo, pin, onUpdated }: GrupoSectionProps) {
  const label = grupo.nome === 'ESP' ? 'Especiais' : `Grupo ${grupo.nome}`

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-bold text-foreground px-1">{label}</h2>
      {grupo.selecoes.map((selecao) => (
        <SelecaoCard
          key={selecao.id}
          selecao={selecao}
          pin={pin}
          onUpdated={onUpdated}
        />
      ))}
    </div>
  )
}
