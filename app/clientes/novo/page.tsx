'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NovoCliente() {
  const { register, handleSubmit } = useForm()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        alert('Cliente cadastrado com sucesso!')
        router.push('/clientes')
      } else {
        alert('Erro ao cadastrar cliente')
      }
    } catch (error) {
      alert('Erro ao cadastrar cliente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold">Novo Cliente</h1>
  <a href="/" className="text-blue-500 hover:underline">
    🏠 Início
  </a>
</div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Dados Pessoais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Nome *</label>
              <input {...register('nome')} required
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">CPF</label>
              <input {...register('cpf')}
                className="w-full border rounded p-2"
                placeholder="000.000.000-00" />
            </div>
            
            <div>
              <label className="block mb-1">RG</label>
              <input {...register('rg')}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">CNH</label>
              <input {...register('cnh')}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">Telefone</label>
              <input {...register('telefone')}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">WhatsApp</label>
              <input {...register('whatsapp')}
                className="w-full border rounded p-2" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-1">Email</label>
              <input {...register('email')} type="email"
                className="w-full border rounded p-2" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Endereço</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">CEP</label>
              <input {...register('cep')}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">Logradouro</label>
              <input {...register('logradouro')}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">Número</label>
              <input {...register('numero')}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">Complemento</label>
              <input {...register('complemento')}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">Bairro</label>
              <input {...register('bairro')}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">Cidade</label>
              <input {...register('cidade')}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">Estado</label>
              <input {...register('estado')}
                className="w-full border rounded p-2" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400">
          {loading ? 'Salvando...' : 'Salvar Cliente'}
        </button>
      </form>
    </div>
  )
}