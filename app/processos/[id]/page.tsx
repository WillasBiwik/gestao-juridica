import Link from 'next/link'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import UploadForm from './UploadForm'
import BotaoExcluir from '@/app/components/BotaoExcluir'

export default async function DetalhesProcesso({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const processo = await prisma.processo.findUnique({
    where: { id },
    include: {
      cliente: true,
      arquivos: {
        orderBy: { createdAt: 'desc' }
      },
      pagamentos: true,
    },
  })

  if (!processo) {
    notFound()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Processo</h1>
        <div className="space-x-2">
          <Link href={`/processos/${id}/editar`}
            className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 text-sm">
            ✏️ Editar
          </Link>
          <BotaoExcluir id={id} tipo="processo" />
          <Link href={`/clientes/${processo.clienteId}`} className="text-blue-500 hover:underline text-sm">
            ← Voltar ao cliente
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Dados do Processo</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Número</p>
            <p className="font-semibold text-lg">{processo.numero}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Cliente</p>
            <p className="font-medium">{processo.cliente.nome}</p>
          </div>
          {processo.tribunal && (
            <div>
              <p className="text-gray-500 text-sm">Tribunal</p>
              <p className="font-medium">{processo.tribunal}</p>
            </div>
          )}
          {processo.vara && (
            <div>
              <p className="text-gray-500 text-sm">Vara</p>
              <p className="font-medium">{processo.vara}</p>
            </div>
          )}
          {processo.tipoAcao && (
            <div>
              <p className="text-gray-500 text-sm">Tipo de Ação</p>
              <p className="font-medium">{processo.tipoAcao}</p>
            </div>
          )}
          <div>
            <p className="text-gray-500 text-sm">Status</p>
            <span className={`px-2 py-1 rounded-full text-xs ${
              processo.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {processo.status}
            </span>
          </div>
        </div>

        {processo.descricao && (
          <div className="mt-4">
            <p className="text-gray-500 text-sm">Descrição</p>
            <p className="mt-1">{processo.descricao}</p>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Documentos</h2>
        
        <UploadForm processoId={processo.id} />

        {processo.arquivos.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Arquivos anexados ({processo.arquivos.length})</h3>
            <div className="space-y-2">
              {processo.arquivos.map((arquivo) => (
                <div key={arquivo.id} className="flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="font-medium text-sm">{arquivo.nome}</p>
                      <p className="text-xs text-gray-500">
                        {(arquivo.tamanho / 1024).toFixed(1)} KB • {new Date(arquivo.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <a href={arquivo.url} target="_blank"
                    className="text-blue-500 hover:underline text-sm">
                    Abrir
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}   