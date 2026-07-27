'use client'

import { useRouter } from 'next/navigation'

interface Pagamento {
  id: string
  valorTotal: number
  formaPagamento: string
  parcelas: number
  status: string
  processo: {
    numero: string
    cliente: {
      nome: string
    }
  }
}

export default function TabelaPagamentos({ pagamentos }: { pagamentos: Pagamento[] }) {
  const router = useRouter()

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4">Processo</th>
            <th className="text-left p-4">Cliente</th>
            <th className="text-left p-4">Valor Total</th>
            <th className="text-left p-4">Forma</th>
            <th className="text-left p-4">Parcelas</th>
            <th className="text-left p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {pagamentos.map((pagamento) => (
            <tr 
              key={pagamento.id} 
              className="border-t hover:bg-gray-50 cursor-pointer"
              onClick={() => router.push(`/financeiro/${pagamento.id}`)}
            >
              <td className="p-4 text-sm">{pagamento.processo.numero}</td>
              <td className="p-4">{pagamento.processo.cliente.nome}</td>
              <td className="p-4">R$ {pagamento.valorTotal.toFixed(2)}</td>
              <td className="p-4">
                <span className="capitalize">
                  {pagamento.formaPagamento.replace('_', ' ')}
                </span>
              </td>
              <td className="p-4">
                {pagamento.formaPagamento === 'a_vista' || pagamento.formaPagamento === 'pix'
                  ? '1x'
                  : `${pagamento.parcelas}x`}
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  pagamento.status === 'quitado' ? 'bg-green-100 text-green-800' :
                  pagamento.status === 'parcial' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {pagamento.status === 'quitado' ? 'Quitado' :
                   pagamento.status === 'parcial' ? 'Parcial' : 'Pendente'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}