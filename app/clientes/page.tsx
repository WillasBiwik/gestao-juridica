import Link from 'next/link'
import prisma from '@/lib/prisma'

export default async function ListaClientes({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string }>
}) {
  const { busca } = await searchParams

  let clientes
  if (busca) {
    clientes = await prisma.cliente.findMany({
      where: {
        OR: [
          { nome: { contains: busca } },
          { cpf: { contains: busca } },
          { email: { contains: busca } },
          { telefone: { contains: busca } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    })
  } else {
    clientes = await prisma.cliente.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Clientes</h1>
          <a href="/" className="text-blue-600 hover:underline text-sm font-medium">
            Início
          </a>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link href="/processos/novo"
            className="bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 text-sm font-medium text-center">
            Novo Processo
          </Link>
          <Link href="/clientes/novo"
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium text-center">
            Novo Cliente
          </Link>
        </div>
      </div>

      <form className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            name="busca"
            defaultValue={busca || ''}
            placeholder="Buscar por nome, CPF, email ou telefone..."
            className="flex-1 border border-gray-300 rounded-lg p-3 text-gray-900"
          />
          <button type="submit"
            className="bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-900 text-sm font-medium">
            Buscar
          </button>
          {busca && (
            <Link href="/clientes"
              className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
              Limpar
            </Link>
          )}
        </div>
      </form>

      {busca && (
        <p className="mb-4 text-gray-600">
          Resultados para: <strong>{busca}</strong> ({clientes.length} encontrados)
        </p>
      )}

      {clientes.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg">
            {busca ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
          </p>
          {!busca && (
            <Link href="/clientes/novo" className="text-blue-600 hover:underline mt-2 inline-block font-medium">
              Cadastrar primeiro cliente
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientes.map((cliente) => (
            <div key={cliente.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{cliente.nome}</h3>
              {cliente.cpf && <p className="text-gray-600 text-sm mb-1">CPF: {cliente.cpf}</p>}
              {cliente.telefone && <p className="text-gray-600 text-sm mb-1">📞 {cliente.telefone}</p>}
              {cliente.email && <p className="text-gray-600 text-sm mb-3">✉️ {cliente.email}</p>}
              <div className="flex gap-3">
                <Link href={`/clientes/${cliente.id}`} className="text-blue-600 hover:underline text-sm font-medium">
                  Ver detalhes →
                </Link>
                <Link href={`/processos/novo?clienteId=${cliente.id}`} className="text-green-600 hover:underline text-sm font-medium">
                  + Processo
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}