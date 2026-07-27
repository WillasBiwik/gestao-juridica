import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Criar a parcela realizada
    const parcela = await prisma.parcelaRealizada.create({
      data: {
        pagamentoId: data.pagamentoId,
        valor: data.valor,
        metodo: data.metodo,
        observacao: data.observacao || null,
      },
    })

    // Atualizar o status do pagamento
    const pagamento = await prisma.pagamento.findUnique({
      where: { id: data.pagamentoId },
      include: {
        parcelasRealizadas: true,
      },
    })

    if (pagamento) {
      const totalPago = pagamento.parcelasRealizadas.reduce(
        (acc, p) => acc + p.valor, 0
      )

      let novoStatus = 'parcial'
      if (totalPago >= pagamento.valorTotal) {
        novoStatus = 'quitado'
      } else if (totalPago === 0) {
        novoStatus = 'pendente'
      }

      await prisma.pagamento.update({
        where: { id: data.pagamentoId },
        data: { status: novoStatus },
      })
    }

    return NextResponse.json(parcela, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Erro ao registrar parcela' },
      { status: 500 }
    )
  }
}