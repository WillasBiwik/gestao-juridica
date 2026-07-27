'use client'

import { useForm } from 'react-hook-form'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function NovoProcessoForm() {
  const { register, handleSubmit } = useForm()
  const [loading, setLoading] = useState(false)
  const [clientes, setClientes] = useState<any[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const clienteId = searchParams.get('clienteId')

  useEffect(() => {
    fetch('/api/clientes')
      .then(res => res.json())
      .then(data => setClientes(data))
  }, [])

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/processos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        alert('Processo cadastrado com sucesso!')
        router.push('/clientes')
      } else {
        alert('Erro ao cadastrar processo')
      }
    } catch (error) {
      alert('Erro ao cadastrar processo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Novo Processo</h1>
        <Link href="/clientes" className="text-blue-500 hover:underline">
          ← Voltar
        </Link>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Dados do Processo</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Cliente *</label>
              <select {...register('clienteId')} required
                defaultValue={clienteId || ''}
                className="w-full border rounded p-2">
                <option value="">Selecione um cliente...</option>
                {clientes.map((cliente: any) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome} {cliente.cpf ? `- ${cliente.cpf}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Número do Processo *</label>
              <input {...register('numero')} required
                className="w-full border rounded p-2"
                placeholder="0000000-00.0000.0.00.0000" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Tribunal</label>
                <input {...register('tribunal')}
                  className="w-full border rounded p-2"
                  placeholder="TJSP, TRF3, STJ..." />
              </div>
              
              <div>
                <label className="block mb-1">Vara</label>
                <input {...register('vara')}
                  className="w-full border rounded p-2"
                  placeholder="1ª Vara Cível..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Tipo de Ação</label>
                <input {...register('tipoAcao')}
                  className="w-full border rounded p-2"
                  placeholder="Trabalhista, Cível, Criminal..." />
              </div>
              
              <div>
                <label className="block mb-1">Status</label>
                <select {...register('status')} defaultValue="ativo"
                  className="w-full border rounded p-2">
                  <option value="ativo">Ativo</option>
                  <option value="suspenso">Suspenso</option>
                  <option value="encerrado">Encerrado</option>
                  <option value="arquivado">Arquivado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1">Descrição / Observações</label>
              <textarea {...register('descricao')}
                className="w-full border rounded p-2"
                rows={4}
                placeholder="Detalhes sobre o processo..."></textarea>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400">
          {loading ? 'Salvando...' : 'Salvar Processo'}
        </button>
      </form>
    </div>
  )
}

export default function NovoProcesso() {
  return (
    <Suspense fallback={<div className="p-6">Carregando...</div>}>
      <NovoProcessoForm />
    </Suspense>
  )
}