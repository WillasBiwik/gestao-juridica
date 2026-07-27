import Link from 'next/link'
import prisma from '@/lib/prisma'
import TabelaPagamentos from './TabelaPagamentos'

export default async function Financeiro() {
  const pagamentos = await prisma.pagamento.findMany({
    include: {
      processo: {
        select: {
          numero: true,
          cliente: { select: { nome: true } }
        },
      },
      parcelasRealizadas: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalReceber = pagamentos
    .filter(p => p.status !== 'quitado')
    .reduce((acc, p) => acc + p.valorTotal, 0)

  const totalRecebido = pagamentos
    .filter(p => p.status === 'quitado')
    .reduce((acc, p) => acc + p.valorTotal, 0)

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Financeiro</h1>
          <a href="/" className="text-blue-600 hover:underline text-sm font-medium">
            Início
          </a>
        </div>
        <Link href="/financeiro/novo"
          className="bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 text-sm font-medium text-center w-full sm:w-auto">
          Novo Pagamento
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-700">Total a Receber</h3>
          <p className="text-2xl font-bold text-yellow-800 mt-1">R$ {totalReceber.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 p-5 rounded-xl border border-green-200">
          <h3 className="text-sm font-medium text-green-700">Total Recebido</h3>
          <p className="text-2xl font-bold text-green-800 mt-1">R$ {totalRecebido.toFixed(2)}</p>
        </div>
        <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
          <h3 className="text-sm font-medium text-blue-700">Total de Pagamentos</h3>
          <p className="text-2xl font-bold text-blue-800 mt-1">{pagamentos.length}</p>
        </div>
      </div>

      {pagamentos.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg">Nenhum pagamento cadastrado</p>
          <Link href="/financeiro/novo" className="text-purple-600 hover:underline mt-2 inline-block font-medium">
            Cadastrar primeiro pagamento
          </Link>
        </div>
      ) : (
        <TabelaPagamentos pagamentos={pagamentos} />
      )}
    </div>
  )
}