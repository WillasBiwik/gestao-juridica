import Link from 'next/link'
import prisma from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'

export default async function EditarProcesso({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const processo = await prisma.processo.findUnique({
    where: { id },
    include: {
      cliente: true,
    },
  })

  if (!processo) {
    notFound()
  }

  async function atualizarProcesso(formData: FormData) {
    'use server'

    const data = {
      numero: formData.get('numero') as string,
      tribunal: formData.get('tribunal') as string,
      vara: formData.get('vara') as string,
      tipoAcao: formData.get('tipoAcao') as string,
      status: formData.get('status') as string,
      descricao: formData.get('descricao') as string,
    }

    await prisma.processo.update({
      where: { id },
      data,
    })

    redirect(`/processos/${id}`)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editar Processo</h1>
        <Link href={`/processos/${id}`} className="text-blue-500 hover:underline">
          ← Voltar
        </Link>
      </div>

      <form action={atualizarProcesso} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Dados do Processo</h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-1">Cliente</label>
              <input value={processo.cliente.nome} disabled
                className="w-full border rounded p-2 bg-gray-100" />
            </div>

            <div>
              <label className="block mb-1">Número do Processo *</label>
              <input name="numero" required defaultValue={processo.numero}
                className="w-full border rounded p-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Tribunal</label>
                <input name="tribunal" defaultValue={processo.tribunal || ''}
                  className="w-full border rounded p-2" />
              </div>

              <div>
                <label className="block mb-1">Vara</label>
                <input name="vara" defaultValue={processo.vara || ''}
                  className="w-full border rounded p-2" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Tipo de Ação</label>
                <input name="tipoAcao" defaultValue={processo.tipoAcao || ''}
                  className="w-full border rounded p-2" />
              </div>

              <div>
                <label className="block mb-1">Status</label>
                <select name="status" defaultValue={processo.status}
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
              <textarea name="descricao"
                className="w-full border rounded p-2"
                rows={4}
                defaultValue={processo.descricao || ''}
                placeholder="Detalhes sobre o processo..."></textarea>
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