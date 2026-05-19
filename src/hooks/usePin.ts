import { useState, useEffect } from 'react'

const PIN_KEY = 'album_pin'

export function usePin() {
  const [pin, setPin] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(PIN_KEY)
    setPin(saved)
    setIsLoading(false)
  }, [])

  function savePin(value: string) {
    localStorage.setItem(PIN_KEY, value)
    setPin(value)
  }

  function clearPin() {
    localStorage.removeItem(PIN_KEY)
    setPin(null)
  }

  return { pin, isLoading, savePin, clearPin }
}
