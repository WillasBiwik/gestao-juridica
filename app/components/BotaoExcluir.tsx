'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BotaoExcluirProps {
  id: string
  tipo: 'cliente' | 'processo' | 'pagamento'
  nome?: string
}

export default function BotaoExcluir({ id, tipo, nome }: BotaoExcluirProps) {
  const [confirmando, setConfirmando] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleExcluir = async () => {
    setLoading(true)
    try {
      const endpoints: Record<string, string> = {
        cliente: '/api/clientes',
        processo: '/api/processos',
        pagamento: '/api/pagamentos',
      }

      const response = await fetch(endpoints[tipo], {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        alert(`${tipo} excluído com sucesso!`)
        router.refresh()
        if (tipo === 'cliente' || tipo === 'processo') {
          router.push(`/${tipo === 'cliente' ? 'clientes' : 'clientes'}`)
        } else {
          router.push('/financeiro')
        }
      } else {
        alert('Erro ao excluir')
      }
    } catch (error) {
      alert('Erro ao excluir')
    } finally {
      setLoading(false)
    }
  }

  if (!confirmando) {
    return (
      <button
        onClick={() => setConfirmando(true)}
        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm">
        🗑️ Excluir
      </button>
    )
  }

  return (
    <div className="inline-flex items-center space-x-1">
      <span className="text-sm text-red-600">Confirma?</span>
      <button
        onClick={handleExcluir}
        disabled={loading}
        className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 disabled:bg-gray-400">
        Sim
      </button>
      <button
        onClick={() => setConfirmando(false)}
        className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-400">
        Não
      </button>
    </div>
  )
}