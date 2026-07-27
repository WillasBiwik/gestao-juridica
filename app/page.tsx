import Link from 'next/link'
import prisma from '@/lib/prisma'

export default async function Dashboard() {
  const totalClientes = await prisma.cliente.count()
  const processosAtivos = await prisma.processo.count({
    where: { status: 'ativo' }
  })
  const pagamentosPendentes = await prisma.pagamento.count({
    where: { status: { in: ['pendente', 'parcial'] } }
  })

  const ultimosClientes = await prisma.cliente.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const pagamentosEmAberto = await prisma.pagamento.findMany({
    where: { status: { in: ['pendente', 'parcial'] } },
    include: {
      processo: {
        select: {
          numero: true,
          cliente: { select: { nome: true } }
        }
      },
      parcelasRealizadas: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const ultimosProcessos = await prisma.processo.findMany({
    include: {
      cliente: { select: { nome: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return (
    <div className="p-8">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/clientes" 
          className="bg-gradient-to-br from-[#0a1a33] to-[#1a2f4a] p-6 rounded-xl hover:shadow-lg transition">
          <p className="text-gray-400 text-sm">Total Clientes</p>
          <p className="text-4xl font-bold text-white mt-2">{totalClientes}</p>
        </Link>
        <Link href="/clientes"
          className="bg-gradient-to-br from-[#d4a853] to-[#c49a3c] p-6 rounded-xl hover:shadow-lg transition">
          <p className="text-[#0a1a33] text-sm font-medium">Processos Ativos</p>
          <p className="text-4xl font-bold text-[#0a1a33] mt-2">{processosAtivos}</p>
        </Link>
        <Link href="/financeiro"
          className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Pagamentos Pendentes</p>
          <p className="text-4xl font-bold text-[#0a1a33] mt-2">{pagamentosPendentes}</p>
        </Link>
      </div>

      {/* Links rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/clientes/novo"
          className="bg-[#0a1a33] text-white p-4 rounded-xl hover:bg-[#1a2f4a] text-center font-medium">
          ➕ Novo Cliente
        </Link>
        <Link href="/processos/novo"
          className="bg-[#d4a853] text-[#0a1a33] p-4 rounded-xl hover:bg-[#c49a3c] text-center font-medium">
          📄 Novo Processo
        </Link>
        <Link href="/financeiro/novo"
          className="bg-white border border-gray-200 text-[#0a1a33] p-4 rounded-xl hover:bg-gray-50 text-center font-medium">
          💰 Novo Pagamento
        </Link>
      </div>

      {/* Grade de informações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimos Clientes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#0a1a33]">🆕 Últimos Clientes</h2>
            <Link href="/clientes" className="text-[#d4a853] text-sm font-medium hover:underline">Ver todos</Link>
          </div>
          {ultimosClientes.length === 0 ? (
            <p className="text-gray-400">Nenhum cliente cadastrado</p>
          ) : (
            <div className="space-y-2">
              {ultimosClientes.map((cliente) => (
                <Link key={cliente.id} href={`/clientes/${cliente.id}`}
                  className="flex justify-between items-center border border-gray-100 rounded-lg p-3 hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-[#0a1a33]">{cliente.nome}</p>
                    {cliente.cpf && <p className="text-xs text-gray-500">{cliente.cpf}</p>}
                  </div>
                  <span className="text-[#d4a853]">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Pagamentos em Aberto */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#0a1a33]">⚠️ Pagamentos em Aberto</h2>
            <Link href="/financeiro" className="text-[#d4a853] text-sm font-medium hover:underline">Ver todos</Link>
          </div>
          {pagamentosEmAberto.length === 0 ? (
            <p className="text-gray-400">Nenhum pagamento pendente</p>
          ) : (
            <div className="space-y-2">
              {pagamentosEmAberto.map((pagamento) => {
                const totalPago = pagamento.parcelasRealizadas.reduce((acc, p) => acc + p.valor, 0)
                const saldo = pagamento.valorTotal - totalPago
                return (
                  <Link key={pagamento.id} href={`/financeiro/${pagamento.id}`}
                    className="flex justify-between items-center border border-gray-100 rounded-lg p-3 hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-sm text-[#0a1a33]">{pagamento.processo.cliente.nome}</p>
                      <p className="text-xs text-gray-500">{pagamento.processo.numero}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">R$ {saldo.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">restante</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Últimos Processos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#0a1a33]">📄 Últimos Processos</h2>
            <Link href="/clientes" className="text-[#d4a853] text-sm font-medium hover:underline">Ver clientes</Link>
          </div>
          {ultimosProcessos.length === 0 ? (
            <p className="text-gray-400">Nenhum processo cadastrado</p>
          ) : (
            <div className="space-y-2">
              {ultimosProcessos.map((processo) => (
                <Link key={processo.id} href={`/processos/${processo.id}`}
                  className="flex justify-between items-center border border-gray-100 rounded-lg p-3 hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-sm text-[#0a1a33]">{processo.numero}</p>
                    <p className="text-xs text-gray-500">{processo.cliente.nome}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    processo.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {processo.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Resumo Financeiro */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-[#0a1a33] mb-4">💵 Resumo Financeiro</h2>
          {pagamentosEmAberto.length === 0 ? (
            <p className="text-gray-400">Tudo quitado!</p>
          ) : (
            <div className="space-y-3">
              {pagamentosEmAberto.map((pagamento) => {
                const totalPago = pagamento.parcelasRealizadas.reduce((acc, p) => acc + p.valor, 0)
                const percentual = Math.round((totalPago / pagamento.valorTotal) * 100)
                return (
                  <div key={pagamento.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#0a1a33] font-medium">{pagamento.processo.cliente.nome}</span>
                      <span className="text-gray-500">{percentual}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          percentual > 50 ? 'bg-green-500' : percentual > 20 ? 'bg-[#d4a853]' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentual}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}