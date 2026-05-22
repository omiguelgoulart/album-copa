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
        <div className="w-full max-w-2xl mx-auto flex flex-col min-h-full">

          {/* Header */}
          <header className="flex items-center justify-between px-4 pt-5 pb-3">
            <div>
              <h1 className="text-lg font-bold leading-tight">⚽ Álbum Copa do Mundo</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Meu Álbum 5150</p>
            </div>
            <Button variant="ghost" size="icon" onClick={clearPin} className="shrink-0">
              <LogOut className="w-4 h-4" />
            </Button>
          </header>

          {/* Stats */}
          <div className="px-4">
            <StatsBar key={statsKey} pin={pin} />
          </div>

          {/* Legenda + Copiar */}
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-200 shrink-0" />
                Tenho
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-yellow-100 border border-yellow-200 shrink-0" />
                Repetida
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-background border border-border shrink-0" />
                Falta
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopyRepetidas} className="h-8 text-xs px-2.5">
              {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? 'Copiado!' : 'Repetidas'}
            </Button>
          </div>

          {/* Tabs de grupos — sticky */}
          {sortedGrupos.length > 0 && (
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/40 mt-1">
              <div className="flex gap-1.5 overflow-x-auto scrollbar-none px-4 py-2.5">
                {sortedGrupos.map((g: any) => {
                  const label = g.nome === 'ESP' ? 'Especiais' : `Grupo ${g.nome}`
                  const isActive = (activeGrupoId ?? sortedGrupos[0]?.id) === g.id
                  return (
                    <button
                      key={g.id}
                      onClick={() => setActiveGrupoId(g.id)}
                      className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold border transition-colors touch-manipulation ${
                        isActive
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Loading inicial */}
          {loading && (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <p className="text-center text-destructive text-sm px-4 py-8">{error}</p>
          )}

          {/* Seleções do grupo ativo */}
          {!loading && !error && activeGrupo && (
            <div className="flex flex-col gap-5 px-4 py-4">
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

        </div>
      )}
    </>
  )
}
