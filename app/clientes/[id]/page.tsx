import Link from 'next/link'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import BotaoExcluir from '@/app/components/BotaoExcluir'

export default async function DetalhesCliente({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const cliente = await prisma.cliente.findUnique({
    where: { id },
    include: {
      processos: true,
    },
  })

  if (!cliente) {
    notFound()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{cliente.nome}</h1>
        <div className="space-x-2">
          <Link href={`/clientes/${id}/editar`}
            className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 text-sm">
            ✏️ Editar
          </Link>
          <BotaoExcluir id={id} tipo="cliente" nome={cliente.nome} />
          <Link href="/clientes" className="text-blue-500 hover:underline text-sm">
            ← Voltar
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Dados Pessoais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cliente.cpf && (
            <div>
              <p className="text-gray-500 text-sm">CPF</p>
              <p className="font-medium">{cliente.cpf}</p>
            </div>
          )}
          {cliente.rg && (
            <div>
              <p className="text-gray-500 text-sm">RG</p>
              <p className="font-medium">{cliente.rg}</p>
            </div>
          )}
          {cliente.cnh && (
            <div>
              <p className="text-gray-500 text-sm">CNH</p>
              <p className="font-medium">{cliente.cnh}</p>
            </div>
          )}
          {cliente.telefone && (
            <div>
              <p className="text-gray-500 text-sm">Telefone</p>
              <p className="font-medium">{cliente.telefone}</p>
            </div>
          )}
          {cliente.whatsapp && (
            <div>
              <p className="text-gray-500 text-sm">WhatsApp</p>
              <p className="font-medium">{cliente.whatsapp}</p>
            </div>
          )}
          {cliente.email && (
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium">{cliente.email}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Endereço</h2>
        {(cliente.cep || cliente.logradouro) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cliente.cep && (
              <div>
                <p className="text-gray-500 text-sm">CEP</p>
                <p className="font-medium">{cliente.cep}</p>
              </div>
            )}
            {cliente.logradouro && (
              <div>
                <p className="text-gray-500 text-sm">Logradouro</p>
                <p className="font-medium">{cliente.logradouro}</p>
              </div>
            )}
            {cliente.numero && (
              <div>
                <p className="text-gray-500 text-sm">Número</p>
                <p className="font-medium">{cliente.numero}</p>
              </div>
            )}
            {cliente.complemento && (
              <div>
                <p className="text-gray-500 text-sm">Complemento</p>
                <p className="font-medium">{cliente.complemento}</p>
              </div>
            )}
            {cliente.bairro && (
              <div>
                <p className="text-gray-500 text-sm">Bairro</p>
                <p className="font-medium">{cliente.bairro}</p>
              </div>
            )}
            {cliente.cidade && (
              <div>
                <p className="text-gray-500 text-sm">Cidade</p>
                <p className="font-medium">{cliente.cidade}</p>
              </div>
            )}
            {cliente.estado && (
              <div>
                <p className="text-gray-500 text-sm">Estado</p>
                <p className="font-medium">{cliente.estado}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400">Nenhum endereço cadastrado</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-semibold">Processos</h2>
          <div className="flex items-center space-x-3">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {cliente.processos.length} processo(s)
            </span>
            <Link href={`/processos/novo?clienteId=${cliente.id}`}
              className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 text-sm">
              ➕ Novo
            </Link>
          </div>
        </div>
        {cliente.processos.length === 0 ? (
          <p className="text-gray-400">Nenhum processo vinculado</p>
        ) : (
          <div className="space-y-3">
            {cliente.processos.map((processo) => (
              <div key={processo.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/processos/${processo.id}`} className="font-semibold text-blue-600 hover:underline">
                      {processo.numero}
                    </Link>
                    {processo.tribunal && (
                      <p className="text-sm text-gray-600">{processo.tribunal}</p>
                    )}
                    {processo.tipoAcao && (
                      <p className="text-sm text-gray-500">{processo.tipoAcao}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    processo.status === 'ativo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {processo.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}