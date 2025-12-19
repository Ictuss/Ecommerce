import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
             {
            // Previne clickjacking - impede que seu site seja carregado em iframes
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            // Previne MIME type sniffing
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Ativa proteção XSS do navegador
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            // Controla informações enviadas no header Referer
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // Força HTTPS
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            // Controla quais recursos podem ser carregados
            // Ajuste conforme necessário para seu projeto
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe necessário pro Next.js
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https:",
              "media-src 'self' https: blob:",
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com", // para vídeos embeddados
            ].join('; '),
          },
          {
            // Controla quais features do navegador podem ser usadas
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
    ]
  },
}

export default nextConfig
