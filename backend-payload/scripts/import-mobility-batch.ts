// scripts/import-mobility-batch.ts
// Versão em lotes - importa 50 produtos por vez
// @ts-nocheck

import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import axios from 'axios'
import payload, { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import dotenv from 'dotenv'

// importa MESMAS collections que o app usa
import { Products } from '../src/collections/Products.js'
import { Media } from '../src/collections/Media.js'

dotenv.config()

// ---------- CONFIGURAÇÃO ----------
const BATCH_SIZE = 50 // Quantos produtos importar por vez

// ---------- TIPOS / HELPERS DO CSV ----------

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

function isMobilityCategory(cats: string): boolean {
  const c = (cats || '').toUpperCase()
  return c.includes('MOBILI')
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
  // Pegar argumento de linha de comando: npm run mobility:batch -- 2
  const batchNumber = parseInt(process.argv[2] || '1', 10)

  await payload.init({
    config: localConfig,
    local: true,
  })

  console.log('Payload iniciado, começando importação em lote...')

  const csvPath = path.resolve(process.cwd(), 'data/wc-products.csv')
  console.log('Lendo CSV de:', csvPath)

  const csvContent = fs.readFileSync(csvPath, 'utf8')
  const rows = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    relax_quotes: true,
  }) as CsvRow[]

  const mobilityRows = rows.filter((r) => isMobilityCategory(r['Categorias']))

  // Calcular qual lote importar
  const startIndex = (batchNumber - 1) * BATCH_SIZE
  const endIndex = Math.min(startIndex + BATCH_SIZE, mobilityRows.length)
  const batch = mobilityRows.slice(startIndex, endIndex)

  const totalBatches = Math.ceil(mobilityRows.length / BATCH_SIZE)

  console.log(`\n📊 Total de produtos de mobilidade: ${mobilityRows.length}`)
  console.log(`📦 Lote ${batchNumber}/${totalBatches}`)
  console.log(`📍 Importando produtos ${startIndex + 1} a ${endIndex}`)
  console.log(`📈 ${batch.length} produtos neste lote\n`)

  if (batch.length === 0) {
    console.log('❌ Lote vazio ou número de lote inválido!')
    console.log(`💡 Use: npm run mobility:batch -- <número> (1 a ${totalBatches})`)
    process.exit(1)
  }

  let imported = 0
  let skipped = 0
  let failed = 0

  for (let i = 0; i < batch.length; i++) {
    const row = batch[i]
    const globalIndex = startIndex + i + 1
    const progress = `[${globalIndex}/${mobilityRows.length}]`

    console.log(`${progress} Processando: ${row['Nome']}`)

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
      console.log('  ⏭️  Produto já existe (ID:', existingProduct.docs[0].id, '), pulando...\n')
      skipped++
      continue
    }

    const imgInfo = await downloadFirstImageAsBuffer(row['Imagens'])
    if (!imgInfo) {
      console.warn('  ⚠ Sem imagem válida, pulando produto.\n')
      failed++
      continue
    }

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

    const product = await payload.create({
      collection: 'products',
      data: {
        name: row['Nome'],
        description,
        price: parsePrice(row['Preço']),
        category: 'mobilidade',
        featured: false,
        images: [{ image: mediaDoc.id, alt: row['Nome'] }],
      },
    } as any)

    console.log('  ✔ Produto criado:', product.id, '\n')
    imported++
  }

  console.log('─────────────────────────────────')
  console.log(`Resumo do Lote ${batchNumber}/${totalBatches}:`)
  console.log(`  ✅ Importados: ${imported}`)
  console.log(`  ⏭️  Pulados (já existiam): ${skipped}`)
  console.log(`  ❌ Falhados (sem imagem): ${failed}`)
  console.log(`  📊 Total processado neste lote: ${imported + skipped + failed}`)
  console.log('─────────────────────────────────')

  if (endIndex < mobilityRows.length) {
    console.log(`\n💡 Para importar o próximo lote, rode:`)
    console.log(`   npm run mobility:batch -- ${batchNumber + 1}`)
  } else {
    console.log(`\n🎉 Todos os produtos foram processados!`)
  }

  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Erro ao importar produtos:', err)
  process.exit(1)
})
