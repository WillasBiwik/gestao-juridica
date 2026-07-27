'use client'

import { useForm } from 'react-hook-form'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function NovoPagamentoForm() {
  const { register, handleSubmit, watch } = useForm()
  const [loading, setLoading] = useState(false)
  const [processos, setProcessos] = useState<any[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const processoId = searchParams.get('processoId')

  const formaPagamento = watch('formaPagamento')
  const parcelas = watch('parcelas')
  const valorTotal = watch('valorTotal')

  useEffect(() => {
    fetch('/api/processos')
      .then(res => res.json())
      .then(data => setProcessos(data))
  }, [])

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/pagamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        alert('Pagamento cadastrado com sucesso!')
        router.push('/financeiro')
      } else {
        alert('Erro ao cadastrar pagamento')
      }
    } catch (error) {
      alert('Erro ao cadastrar pagamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Novo Pagamento</h1>
        <Link href="/financeiro" className="text-blue-500 hover:underline">
          ← Voltar
        </Link>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Dados do Pagamento</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Processo *</label>
              <select {...register('processoId')} required
                defaultValue={processoId || ''}
                className="w-full border rounded p-2">
                <option value="">Selecione um processo...</option>
                {processos.map((processo: any) => (
                  <option key={processo.id} value={processo.id}>
                    {processo.numero} - {processo.cliente?.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Valor Total (R$) *</label>
              <input {...register('valorTotal')} required type="number" step="0.01"
                className="w-full border rounded p-2"
                placeholder="5000.00" />
            </div>

            <div>
              <label className="block mb-1">Forma de Pagamento *</label>
              <select {...register('formaPagamento')} required
                className="w-full border rounded p-2">
                <option value="">Selecione...</option>
                <option value="a_vista">À Vista</option>
                <option value="entrada">Entrada + Parcelas</option>
                <option value="cartao">Cartão</option>
                <option value="pix">PIX</option>
              </select>
            </div>

            {(formaPagamento === 'entrada' || formaPagamento === 'cartao') && (
              <>
                <div>
                  <label className="block mb-1">Número de Parcelas</label>
                  <input {...register('parcelas')} type="number" min="1"
                    className="w-full border rounded p-2"
                    placeholder="12" />
                </div>

                {valorTotal && parcelas && (
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm text-blue-800">
                      Valor da parcela: R$ {(Number(valorTotal) / Number(parcelas)).toFixed(2)}
                    </p>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block mb-1">Observações</label>
              <textarea {...register('observacoes')}
                className="w-full border rounded p-2"
                rows={3}
                placeholder="Observações sobre o pagamento..."></textarea>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400">
          {loading ? 'Salvando...' : 'Salvar Pagamento'}
        </button>
      </form>
    </div>
  )
}

export default function NovoPagamento() {
  return (
    <Suspense fallback={<div className="p-6">Carregando...</div>}>
      <NovoPagamentoForm />
    </Suspense>
  )
}