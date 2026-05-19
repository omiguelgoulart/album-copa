'use client'

import { useEffect, useState } from 'react'
import { getStats } from '@/lib/api'

interface Stats {
  total: number
  tenho: number
  repetida: number
  falta: number
}

export function StatsBar({ pin }: { pin: string }) {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    getStats(pin).then(setStats)
  }, [pin])

  if (!stats) return null

  const pct = Math.round((stats.tenho / stats.total) * 100)

  return (
    <div className="w-full flex flex-col gap-2 px-4 py-3 bg-card rounded-xl border">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Progresso do álbum</span>
        <span className="font-medium text-foreground">{pct}%</span>
      </div>

      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>🟢 {stats.tenho} tenho</span>
        <span>🟡 {stats.repetida} repetidas</span>
        <span>⬜ {stats.falta} faltando</span>
      </div>
    </div>
  )
}
