import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Páginas públicas (não precisam de login)
  const publicPages = ['/login', '/cadastro']
  if (publicPages.includes(pathname)) {
    return NextResponse.next()
  }

  // Verificar se tem cookie de usuário logado
  // (Usando verificação simplificada via header)
  const authHeader = request.headers.get('x-usuario-logado')
  
  if (!authHeader) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|icones|uploads|favicon.ico).*)'],
}