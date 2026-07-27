'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegistrarPagamento({ pagamentoId }: { pagamentoId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      pagamentoId,
      valor: parseFloat(formData.get('valor') as string),
      metodo: formData.get('metodo') as string,
      observacao: formData.get('observacao') as string,
    }

    try {
      const response = await fetch('/api/parcelas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        alert('Pagamento registrado com sucesso!')
        router.refresh()
        e.currentTarget.reset()
      } else {
        alert('Erro ao registrar pagamento')
      }
    } catch (error) {
      alert('Erro ao registrar pagamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm">Valor (R$) *</label>
          <input type="number" name="valor" required step="0.01"
            className="w-full border rounded p-2"
            placeholder="500.00" />
        </div>
        <div>
          <label className="block mb-1 text-sm">Método *</label>
          <select name="metodo" required className="w-full border rounded p-2">
            <option value="">Selecione...</option>
            <option value="pix">PIX</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao">Cartão</option>
            <option value="transferencia">Transferência</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block mb-1 text-sm">Observação</label>
        <input type="text" name="observacao"
          className="w-full border rounded p-2"
          placeholder="Ex: Parcela 3/10" />
      </div>
      <button type="submit" disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400">
        {loading ? 'Registrando...' : '✅ Registrar Pagamento'}
      </button>
    </form>
  )
}