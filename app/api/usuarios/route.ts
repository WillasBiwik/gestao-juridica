import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Verificar se email já existe
    const existente = await prisma.usuario.findUnique({
      where: { email: data.email }
    })

    if (existente) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    const usuario = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: data.senha, // Em produção, usar hash (bcrypt)
      }
    })

    return NextResponse.json(
      { id: usuario.id, nome: usuario.nome, email: usuario.email },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    )
  }
}