// scripts/import-mobility-smart.ts
// Importa produtos CERTEIROS de mobilidade baseado em keywords fortes
// @ts-nocheck

import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import axios from 'axios'
import payload, { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import dotenv from 'dotenv'

import { Products } from '../src/collections/Products.js'
import { Media } from '../src/collections/Media.js'

dotenv.config()

// ---------- KEYWORDS FORTES (alta confiança) ----------

const MOBILITY_KEYWORDS = [
  'cadeira de rodas',
  'cadeira motorizada',
  'andador',
  'muleta',
  'bengala',
  'bastão ortopédico',
  'apoio para locomoção',
  'banco para banho',
  'banco ortopédico',
  'cadeira de transferência',
  'elevador de assento',
  'rampa terapêutica',
]

// ---------- TIPOS / HELPERS ----------

type CsvRow = {
  ID: string
  SKU: string
  Nome: string
  'Descrição curta': string
  Descrição: string
  Preço: string
  Categorias: string
  Imagens: string
}

function isMobilityProduct(row: CsvRow): boolean {
  const nome = (row['Nome'] || '').toLowerCase()
  const desc = (row['Descrição curta'] || '').toLowerCase()

  // Verificar se tem alguma keyword forte
  return MOBILITY_KEYWORDS.some((keyword) => nome.includes(keyword) || desc.includes(keyword))
}

function parsePrice(raw: string): number {
  if (!raw) return 0
  const normalized = raw.replace(/\./g, '').replace(',', '.')
  const n = Number(normalized)
  return Number.isFinite(n) ? n : 0
}

function getCleanDescription(row: CsvRow): string {
  const raw =
    (row['Descrição curta'] && row['Descrição curta'].trim()) ||
    (row['Descrição'] && row['Descrição'].trim()) ||
    ''

  if (!raw) return ''

  let text = raw

  text = text
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '')
  text = text.replace(/&nbsp;/gi, ' ')
  text = text.replace(/<li>/gi, '\n• ')
  text = text.replace(/<\/li>/gi, '')
  text = text.replace(/<\/?ul>/gi, '\n')
  text = text.replace(/<\/?ol>/gi, '\n')
  text = text.replace(/<br\s*\/?>/gi, '\n')
  text = text.replace(/<\/p>/gi, '\n\n')
  text = text.replace(/<p>/gi, '')
  text = text.replace(/<\/h[1-6]>/gi, '\n\n')
  text = text.replace(/<h[1-6][^>]*>/gi, '\n')
  text = text.replace(/<[^>]+>/g, '')
  text = text
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
  text = text.replace(/[ \t]+/g, ' ')
  text = text
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
  text = text.replace(/\n{3,}/g, '\n\n')
  text = text.replace(/•([^\s])/g, '• $1')
  text = text
    .split('\n')
    .filter((line) => line !== '•')
    .join('\n')

  return text.trim()
}

async function downloadFirstImageAsBuffer(
  rawImages: string,
): Promise<{ buffer: Buffer; filename: string } | null> {
  if (!rawImages) return null

  const candidates = rawImages
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean)

  if (candidates.length === 0) return null

  for (const url of candidates) {
    try {
      const res = await axios.get<ArrayBuffer>(url, {
        responseType: 'arraybuffer',
        validateStatus: (status) => status < 400,
        timeout: 10000,
      })

      const contentType = (res.headers['content-type'] || '').toLowerCase()
      const byteLength = (res.data as any).byteLength ?? (res.data as any).length ?? 0

      if (!contentType.startsWith('image/')) {
        continue
      }

      if (!byteLength || byteLength === 0) {
        continue
      }

      const buffer = Buffer.from(res.data)
      const urlParts = url.split('/')
      const filename = urlParts[urlParts.length - 1] || 'image.jpg'

      return { buffer, filename }
    } catch (err) {
      continue
    }
  }

  return null
}

// ---------- CONFIG LOCAL DO PAYLOAD ----------

const localConfig = buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  collections: [Products, Media],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.DATABASE_URI || '',
    },
  }),
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: {
          disablePayloadAccessControl: true,
        },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
})

// ---------- MAIN ----------

async function main() {
  await payload.init({
    config: localConfig,
    local: true,
  })

  console.log('🎯 Payload iniciado - Importação INTELIGENTE de Mobilidade')
  console.log('📋 Usando keywords fortes para filtrar produtos certeiros\n')

  const csvPath = path.resolve(process.cwd(), 'data/wc-products.csv')
  console.log('Lendo CSV de:', csvPath)

  const csvContent = fs.readFileSync(csvPath, 'utf8')
  const rows = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    relax_quotes: true,
  }) as CsvRow[]

  // Filtrar produtos de mobilidade com keywords fortes
  const mobilityRows = rows.filter(isMobilityProduct)

  console.log(`\n📊 Encontrados ${mobilityRows.length} produtos certeiros de MOBILIDADE`)
  console.log(`🚀 Importando todos...\n`)

  let imported = 0
  let skipped = 0
  let failed = 0

  for (let i = 0; i < mobilityRows.length; i++) {
    const row = mobilityRows[i]
    const progress = `[${i + 1}/${mobilityRows.length}]`

    console.log(`${progress} ${row['Nome'].substring(0, 70)}`)

    // Verificar duplicata
    const existingProduct = await payload.find({
      collection: 'products',
      where: {
        name: {
          equals: row['Nome'],
        },
      },
      limit: 1,
    })

    if (existingProduct.docs.length > 0) {
      console.log('  ⏭️  Já existe, pulando...\n')
      skipped++
      continue
    }

    const imgInfo = await downloadFirstImageAsBuffer(row['Imagens'])
    if (!imgInfo) {
      console.warn('  ⚠️  Sem imagem, pulando...\n')
      failed++
      continue
    }

    try {
      // Criar media
      const mediaDoc = await payload.create({
        collection: 'media',
        file: {
          data: imgInfo.buffer,
          name: imgInfo.filename,
          size: imgInfo.buffer.length,
          mimetype: 'image/jpeg',
        } as any,
        data: { alt: row['Nome'] },
      } as any)

      const description = getCleanDescription(row)

      // Criar produto com categoria MOBILIDADE
      const product = await payload.create({
        collection: 'products',
        data: {
          name: row['Nome'],
          description,
          price: parsePrice(row['Preço']),
          category: 'mobilidade', // ✅ Forçar categoria mobilidade
          featured: false,
          images: [{ image: mediaDoc.id, alt: row['Nome'] }],
        },
      } as any)

      console.log(`  ✅ Criado: ${product.id}\n`)
      imported++
    } catch (err) {
      console.error(`  ❌ Erro ao criar: ${err.message}\n`)
      failed++
    }
  }

  console.log('═══════════════════════════════════════')
  console.log('🎯 Resumo - Mobilidade (Smart Import):')
  console.log(`  ✅ Importados: ${imported}`)
  console.log(`  ⏭️  Pulados: ${skipped}`)
  console.log(`  ❌ Falhados: ${failed}`)
  console.log(`  📊 Total: ${imported + skipped + failed}`)
  console.log('═══════════════════════════════════════')

  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Erro fatal:', err)
  process.exit(1)
})
