// middleware.ts (na raiz do projeto, junto com package.json)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 🔐 RATE LIMITING SIMPLES
// Armazena IPs e timestamps (em produção, use Redis)
const rateLimit = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minuto
const MAX_REQUESTS = 100 // máximo de requisições por minuto

function getRateLimitInfo(ip: string) {
  const now = Date.now()
  const record = rateLimit.get(ip)

  if (!record || now > record.resetTime) {
    // Novo registro ou expirou
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true, remaining: MAX_REQUESTS - 1 }
  }

  if (record.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: MAX_REQUESTS - record.count }
}

export function middleware(request: NextRequest) {
  // Pega o IP do cliente
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ??
    request.headers.get('x-real-ip') ??
    'unknown'

  // Aplica rate limiting apenas em rotas de API
  if (request.nextUrl.pathname.startsWith('/api')) {
    const { allowed, remaining } = getRateLimitInfo(ip)

    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
            'Retry-After': '60',
          },
        },
      )
    }

    // Adiciona headers de rate limit na resposta
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', MAX_REQUESTS.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    return response
  }

  return NextResponse.next()
}

// Configura em quais rotas o middleware vai rodar
export const config = {
  matcher: [
    '/api/:path*',
    // Não aplicar em arquivos estáticos
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
