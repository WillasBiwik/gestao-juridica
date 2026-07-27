import Link from 'next/link'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import RegistrarPagamento from './RegistrarPagamento'
import BotaoExcluir from '@/app/components/BotaoExcluir'

export default async function DetalhesPagamento({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const pagamento = await prisma.pagamento.findUnique({
    where: { id },
    include: {
      processo: {
        select: {
          numero: true,
          cliente: {
            select: { nome: true }
          }
        }
      },
      parcelasRealizadas: {
        orderBy: { data: 'desc' }
      },
    },
  })

  if (!pagamento) {
    notFound()
  }

  // Calcular totais
  const totalPago = pagamento.parcelasRealizadas.reduce((acc, p) => acc + p.valor, 0)
  const saldoRestante = pagamento.valorTotal - totalPago

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pagamento</h1>
        <Link href="/financeiro" className="text-blue-500 hover:underline">
          ← Voltar
        </Link>
        <BotaoExcluir id={id} tipo="pagamento" />
      </div>

      {/* Dados do Pagamento */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Dados do Pagamento</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-gray-500 text-sm">Processo</p>
            <p className="font-medium">{pagamento.processo.numero}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Cliente</p>
            <p className="font-medium">{pagamento.processo.cliente.nome}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Forma</p>
            <p className="font-medium capitalize">{pagamento.formaPagamento.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Cards financeiros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Valor Total</p>
            <p className="text-2xl font-bold text-blue-700">R$ {pagamento.valorTotal.toFixed(2)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Pago</p>
            <p className="text-2xl font-bold text-green-700">R$ {totalPago.toFixed(2)}</p>
          </div>
          <div className={`p-4 rounded-lg ${saldoRestante > 0 ? 'bg-yellow-50' : 'bg-green-100'}`}>
            <p className="text-sm text-gray-600">Saldo Restante</p>
            <p className={`text-2xl font-bold ${saldoRestante > 0 ? 'text-yellow-700' : 'text-green-700'}`}>
              R$ {saldoRestante.toFixed(2)}
            </p>
          </div>
        </div>

        {pagamento.parcelas > 1 && (
          <div className="text-sm text-gray-500">
            Parcelas: {pagamento.parcelas}x de R$ {pagamento.valorParcela?.toFixed(2)}
          </div>
        )}

        {pagamento.observacoes && (
          <div className="mt-3 text-sm text-gray-600">
            <strong>Obs:</strong> {pagamento.observacoes}
          </div>
        )}
      </div>

      {/* Registrar novo pagamento */}
      {saldoRestante > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Registrar Pagamento</h2>
          <RegistrarPagamento pagamentoId={pagamento.id} />
        </div>
      )}

      {/* Histórico de parcelas */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Histórico ({pagamento.parcelasRealizadas.length})
        </h2>
        
        {pagamento.parcelasRealizadas.length === 0 ? (
          <p className="text-gray-400">Nenhuma parcela registrada</p>
        ) : (
          <div className="space-y-2">
            {pagamento.parcelasRealizadas.map((parcela) => (
              <div key={parcela.id} className="flex justify-between items-center border rounded-lg p-3">
                <div>
                  <p className="font-medium">R$ {parcela.valor.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(parcela.data).toLocaleDateString('pt-BR')} • {parcela.metodo}
                  </p>
                </div>
                {parcela.observacao && (
                  <p className="text-sm text-gray-500">{parcela.observacao}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}