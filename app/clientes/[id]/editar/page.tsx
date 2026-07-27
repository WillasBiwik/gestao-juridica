import Link from 'next/link'
import prisma from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'

export default async function EditarCliente({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const cliente = await prisma.cliente.findUnique({
    where: { id },
  })

  if (!cliente) {
    notFound()
  }

  async function atualizarCliente(formData: FormData) {
    'use server'
    
    const data = {
      nome: formData.get('nome') as string,
      cpf: formData.get('cpf') as string,
      rg: formData.get('rg') as string,
      cnh: formData.get('cnh') as string,
      telefone: formData.get('telefone') as string,
      whatsapp: formData.get('whatsapp') as string,
      email: formData.get('email') as string,
      cep: formData.get('cep') as string,
      logradouro: formData.get('logradouro') as string,
      numero: formData.get('numero') as string,
      complemento: formData.get('complemento') as string,
      bairro: formData.get('bairro') as string,
      cidade: formData.get('cidade') as string,
      estado: formData.get('estado') as string,
    }

    await prisma.cliente.update({
      where: { id },
      data,
    })

    redirect(`/clientes/${id}`)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editar Cliente</h1>
        <Link href={`/clientes/${id}`} className="text-blue-500 hover:underline">
          ← Voltar
        </Link>
      </div>

      <form action={atualizarCliente} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Dados Pessoais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Nome *</label>
              <input name="nome" required defaultValue={cliente.nome}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">CPF</label>
              <input name="cpf" defaultValue={cliente.cpf || ''}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">RG</label>
              <input name="rg" defaultValue={cliente.rg || ''}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">CNH</label>
              <input name="cnh" defaultValue={cliente.cnh || ''}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">Telefone</label>
              <input name="telefone" defaultValue={cliente.telefone || ''}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">WhatsApp</label>
              <input name="whatsapp" defaultValue={cliente.whatsapp || ''}
                className="w-full border rounded p-2" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-1">Email</label>
              <input name="email" type="email" defaultValue={cliente.email || ''}
                className="w-full border rounded p-2" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Endereço</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">CEP</label>
              <input name="cep" defaultValue={cliente.cep || ''}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">Logradouro</label>
              <input name="logradouro" defaultValue={cliente.logradouro || ''}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">Número</label>
              <input name="numero" defaultValue={cliente.numero || ''}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">Complemento</label>
              <input name="complemento" defaultValue={cliente.complemento || ''}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">Bairro</label>
              <input name="bairro" defaultValue={cliente.bairro || ''}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">Cidade</label>
              <input name="cidade" defaultValue={cliente.cidade || ''}
                className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1">Estado</label>
              <input name="estado" defaultValue={cliente.estado || ''}
                className="w-full border rounded p-2" />
            </div>
          </div>
        </div>

        <button type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
          💾 Salvar Alterações
        </button>
      </form>
    </div>
  )
}