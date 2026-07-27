import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const valorTotal = parseFloat(data.valorTotal)
    const parcelas = parseInt(data.parcelas) || 1
    const valorParcela = valorTotal / parcelas

    const pagamento = await prisma.pagamento.create({
      data: {
        processoId: data.processoId,
        valorTotal: valorTotal,
        formaPagamento: data.formaPagamento,
        parcelas: parcelas,
        valorParcela: valorParcela,
        observacoes: data.observacoes || null,
        status: data.formaPagamento === 'a_vista' ? 'pendente' : 'parcial',
      }
    })
    
    return NextResponse.json(pagamento, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar pagamento' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const pagamentos = await prisma.pagamento.findMany({
      include: {
        processo: {
          select: {
            numero: true,
            cliente: { select: { nome: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(pagamentos)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar pagamentos' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    
    await prisma.parcelaRealizada.deleteMany({
      where: { pagamentoId: id }
    })
    await prisma.pagamento.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao excluir pagamento' },
      { status: 500 }
    )
  }
}