'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const menuItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: '/icones/dashboard.png',
  },
  {
    href: '/clientes',
    label: 'Clientes',
    icon: '/icones/clientes.png',
  },
  {
    href: '/processos/novo',
    label: 'Novo Processo',
    icon: '/icones/processo.png',
  },
  {
    href: '/financeiro',
    label: 'Financeiro',
    icon: '/icones/financeiro.png',
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-[#0a1a33] text-white min-h-screen fixed left-0 top-0">
      {/* Cabeçalho */}
      <div className="p-6 border-b border-[#1a2f4a]">
        <h1 className="text-xl font-bold text-[#d4a853]">⚖️ Gestão Jurídica</h1>
        <p className="text-sm text-gray-400 mt-1">Sistema de Processos</p>
      </div>

      {/* Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-[#d4a853] text-[#0a1a33] font-semibold'
                      : 'text-gray-300 hover:bg-[#1a2f4a] hover:text-white'
                  }`}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        <li>
  <button
    onClick={() => {
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }}
    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900/50 hover:text-red-400 w-full text-left transition"
  >
    <span className="text-xl">🚪</span>
    <span>Sair</span>
  </button>
</li>
</ul>
      </nav>

      {/* Rodapé */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#1a2f4a]">
        <div className="text-xs text-gray-500 text-center">
          © 2026 Gestão Jurídica
        </div>
      </div>
    </div>
  )
}