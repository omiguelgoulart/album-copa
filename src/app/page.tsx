'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePin } from '@/hooks/usePin'
import { useAlbum } from '@/hooks/useAlbum'
import { PinDialog } from '@/components/album/PinDialog'
import { SelecaoCard } from '@/components/album/SelecaoCard'
import { StatsBar } from '@/components/album/StatsBar'
import { Loader2, LogOut, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { pin, isLoading: pinLoading, savePin, clearPin } = usePin()
  const { grupos, loading, error, refetch } = useAlbum(pin)
  const [activeGrupoId, setActiveGrupoId] = useState<string | null>(null)
  const [statsKey, setStatsKey] = useState(0)
  const [copied, setCopied] = useState(false)

  const sortedGrupos = [...grupos].sort((a: any, b: any) => {
    if (a.nome === 'ESP') return -1
    if (b.nome === 'ESP') return 1
    return a.nome.localeCompare(b.nome)
  })

  const activeGrupo = sortedGrupos.find((g) => g.id === activeGrupoId) ?? sortedGrupos[0] ?? null

  // Seleciona o primeiro grupo automaticamente quando carregar
  useEffect(() => {
    if (sortedGrupos.length > 0 && !activeGrupoId) {
      setActiveGrupoId(sortedGrupos[0].id)
    }
  }, [grupos, activeGrupoId])

  const handleUpdated = useCallback(() => {
    setStatsKey((k) => k + 1)
    refetch()
  }, [refetch])

  function handleCopyRepetidas() {
    const repetidas = grupos
      .flatMap((g: any) => g.selecoes)
      .flatMap((s: any) =>
        s.figurinhas
          .filter((f: any) => f.status === 'REPETIDA')
          .map((f: any) => f.codigo)
      )
    navigator.clipboard.writeText(repetidas.join(', '))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (pinLoading) return null

  return (
    <>
      <PinDialog open={!pin} onSuccess={savePin} />

      {pin && (
        <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">⚽ Álbum Copa do Mundo</h1>
              <p className="text-sm text-muted-foreground">Meu Álbum 5150</p>
            </div>
            <Button variant="ghost" size="icon" onClick={clearPin}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Stats */}
          <StatsBar key={statsKey} pin={pin} />

          {/* Legenda + Copiar */}
          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-200 inline-block" />
                Tenho
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-yellow-100 border border-yellow-200 inline-block" />
                Repetida
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-background border border-border inline-block" />
                Falta
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopyRepetidas}>
              {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
              {copied ? 'Copiado!' : 'Copiar repetidas'}
            </Button>
          </div>

          {/* Tabs de grupos */}
          {sortedGrupos.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
              {sortedGrupos.map((g: any) => {
                const label = g.nome === 'ESP' ? 'Especiais' : `Grupo ${g.nome}`
                const isActive = (activeGrupoId ?? grupos[0]?.id) === g.id
                return (
                  <button
                    key={g.id}
                    onClick={() => setActiveGrupoId(g.id)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
                      isActive
                        ? 'bg-foreground text-background border-foreground'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Loading inicial */}
          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <p className="text-center text-destructive text-sm">{error}</p>
          )}

          {/* Seleções do grupo ativo */}
          {!loading && !error && activeGrupo && (
            <div className="flex flex-col gap-5">
              {activeGrupo.selecoes.map((selecao: any) => (
                <SelecaoCard
                  key={selecao.id}
                  selecao={selecao}
                  pin={pin}
                  onUpdated={handleUpdated}
                />
              ))}
            </div>
          )}
        </main>
      )}
    </>
  )
}
