import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const processo = await prisma.processo.create({
      data: {
        numero: data.numero,
        clienteId: data.clienteId,
        tribunal: data.tribunal || null,
        vara: data.vara || null,
        tipoAcao: data.tipoAcao || null,
        status: data.status || 'ativo',
        descricao: data.descricao || null,
      }
    })
    
    return NextResponse.json(processo, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Erro ao criar processo' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const processos = await prisma.processo.findMany({
      include: {
        cliente: {
          select: { nome: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(processos)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar processos' },
      { status: 500 }
    )
  }
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    
    await prisma.parcelaRealizada.deleteMany({
      where: { pagamento: { processoId: id } }
    })
    await prisma.pagamento.deleteMany({
      where: { processoId: id }
    })
    await prisma.arquivo.deleteMany({
      where: { processoId: id }
    })
    await prisma.processo.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao excluir processo' },
      { status: 500 }
    )
  }
}