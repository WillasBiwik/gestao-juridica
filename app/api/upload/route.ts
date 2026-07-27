import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const processoId = formData.get('processoId') as string

    if (!file || !processoId) {
      return NextResponse.json(
        { error: 'Arquivo e processoId são obrigatórios' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Criar nome único para o arquivo
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    const filePath = path.join(uploadDir, fileName)

    // Salvar arquivo
    await writeFile(filePath, buffer)

    // Salvar referência no banco
    const arquivo = await prisma.arquivo.create({
      data: {
        nome: file.name,
        url: `/uploads/${fileName}`,
        tipo: file.type,
        tamanho: file.size,
        processoId: processoId,
      },
    })

    return NextResponse.json(arquivo, { status: 201 })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload do arquivo' },
      { status: 500 }
    )
  }
}