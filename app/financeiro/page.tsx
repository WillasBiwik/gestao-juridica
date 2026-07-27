import Link from 'next/link'
import prisma from '@/lib/prisma'
import TabelaPagamentos from './TabelaPagamentos'

export default async function Financeiro() {
  const pagamentos = await prisma.pagamento.findMany({
    include: {
      processo: {
        select: {
          numero: true,
          cliente: {
            select: { nome: true }
          }
        },
      },
      parcelasRealizadas: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Calcular totais
  const totalReceber = pagamentos
    .filter(p => p.status !== 'quitado')
    .reduce((acc, p) => acc + p.valorTotal, 0)

  const totalRecebido = pagamentos
    .filter(p => p.status === 'quitado')
    .reduce((acc, p) => acc + p.valorTotal, 0)

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
  <div className="flex items-center space-x-3">
    <h1 className="text-2xl sm:text-3xl font-bold">💰 Financeiro</h1>
    <a href="/" className="text-blue-500 hover:underline text-sm">
      🏠 Início
    </a>
  </div>
  <Link href="/financeiro/novo"
    className="bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 text-sm">
    ➕ Novo Pagamento
  </Link>
</div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Total a Receber</h3>
          <p className="text-3xl font-bold text-yellow-700">
            R$ {totalReceber.toFixed(2)}
          </p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Total Recebido</h3>
          <p className="text-3xl font-bold text-green-700">
            R$ {totalRecebido.toFixed(2)}
          </p>
        </div>
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Total de Pagamentos</h3>
          <p className="text-3xl font-bold text-blue-700">
            {pagamentos.length}
          </p>
        </div>
      </div>

      {/* Lista de pagamentos */}
            {pagamentos.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-xl">Nenhum pagamento cadastrado</p>
          <Link href="/financeiro/novo" className="text-purple-500 hover:underline mt-2 inline-block">
            Cadastrar primeiro pagamento
          </Link>
        </div>
      ) : (
        <TabelaPagamentos pagamentos={pagamentos} />
      )}
    </div>
  )
}