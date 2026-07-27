import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const usuario = await prisma.usuario.findUnique({
      where: { email: data.email }
    })

    if (!usuario || usuario.senha !== data.senha) {
      return NextResponse.json(
        { error: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}