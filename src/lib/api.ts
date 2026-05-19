const BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL não definida no .env.local')
}

function getHeaders(pin: string) {
  return {
    'Content-Type': 'application/json',
    'x-pin': pin,
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export async function getStats(pin: string) {
  const res = await fetch(`${BASE_URL}/stats`, {
    headers: getHeaders(pin),
  })
  if (!res.ok) throw new ApiError(res.status, 'Erro ao buscar stats')
  return res.json()
}

export async function getGrupos(pin: string) {
  const res = await fetch(`${BASE_URL}/grupos`, {
    headers: getHeaders(pin),
  })
  if (!res.ok) throw new Error('Erro ao buscar grupos')
  return res.json()
}

export async function getFigurinhas(pin: string, grupoId?: string) {
  const url = grupoId
    ? `${BASE_URL}/figurinhas?grupo=${grupoId}`
    : `${BASE_URL}/figurinhas`
  const res = await fetch(url, { headers: getHeaders(pin) })
  if (!res.ok) throw new Error('Erro ao buscar figurinhas')
  return res.json()
}

export async function updateFigurinha(
  pin: string,
  id: string,
  status: 'TENHO' | 'REPETIDA' | 'FALTA'
) {
  const res = await fetch(`${BASE_URL}/figurinhas/${id}`, {
    method: 'PATCH',
    headers: getHeaders(pin),
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Erro ao atualizar figurinha')
  return res.json()
}
