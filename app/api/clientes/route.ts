import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const cliente = await prisma.cliente.create({
      data: {
        nome: data.nome,
        telefone: data.telefone || null,
        email: data.email || null,
        whatsapp: data.whatsapp || null,
        cpf: data.cpf || null,
        rg: data.rg || null,
        cnh: data.cnh || null,
        cep: data.cep || null,
        logradouro: data.logradouro || null,
        numero: data.numero || null,
        complemento: data.complemento || null,
        bairro: data.bairro || null,
        cidade: data.cidade || null,
        estado: data.estado || null,
      }
    })
    
    return NextResponse.json(cliente, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Erro ao criar cliente' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(clientes)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar clientes' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    
    await prisma.parcelaRealizada.deleteMany({
      where: { pagamento: { processo: { clienteId: id } } }
    })
    await prisma.pagamento.deleteMany({
      where: { processo: { clienteId: id } }
    })
    await prisma.arquivo.deleteMany({
      where: { processo: { clienteId: id } }
    })
    await prisma.processo.deleteMany({
      where: { clienteId: id }
    })
    await prisma.cliente.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao excluir cliente' },
      { status: 500 }
    )
  }
}