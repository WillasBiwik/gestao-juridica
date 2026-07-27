'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErro('')

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email') as string,
      senha: formData.get('senha') as string,
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const usuario = await response.json()
        localStorage.setItem('usuario', JSON.stringify(usuario))
        router.push('/')
      } else {
        setErro('Email ou senha incorretos')
      }
    } catch (error) {
      setErro('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#0a1a33]">⚖️ Entrar</h1>
          <p className="text-gray-500 mt-2">Gestão Jurídica</p>
        </div>

        {erro && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#d4a853] focus:border-[#d4a853]"
              placeholder="seu@email.com" />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Senha</label>
            <input name="senha" type="password" required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#d4a853] focus:border-[#d4a853]"
              placeholder="Sua senha" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#d4a853] text-[#0a1a33] p-3 rounded-lg hover:bg-[#c49a3c] disabled:bg-gray-400 font-medium">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Não tem conta?{' '}
          <Link href="/cadastro" className="text-[#0a1a33] hover:underline font-medium">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}