// scripts/import-mobility.ts
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
import { Products } from '../src/collections/Products.ts'
import { Media } from '../src/collections/Media.ts'

dotenv.config()

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
  return c.includes('MOBILI') // MOBILIÁRIO, MOBILIDADE etc.
}

function parsePrice(raw: string): number {
  if (!raw) return 0
  const normalized = raw.replace(/\./g, '').replace(',', '.')
  const n = Number(normalized)
  return Number.isFinite(n) ? n : 0
}

/**
 * Escolhe e limpa a descrição pra ficar com cara de "textarea" do Payload.
 * - Prioriza "Descrição curta"
 * - Cai pra "Descrição" se a curta estiver vazia
 * - Remove HTML, converte tags de quebra em \n, normaliza espaços
 * - Formata bullets (•) em linhas separadas
 */
function getCleanDescription(row: CsvRow): string {
  const raw =
    (row['Descrição curta'] && row['Descrição curta'].trim()) ||
    (row['Descrição'] && row['Descrição'].trim()) ||
    ''

  if (!raw) return ''

  let text = raw

  // 1) normalizar quebras escapadas do WP/CSV
  text = text
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '')

  // 2) remover &nbsp; ANTES de processar (importante!)
  text = text.replace(/&nbsp;/gi, ' ')

  // 3) converter listas <li> em bullets
  // Primeiro, garantir que cada <li> comece em nova linha
  text = text.replace(/<li>/gi, '\n• ')
  text = text.replace(/<\/li>/gi, '')

  // 4) fechar listas
  text = text.replace(/<\/?ul>/gi, '\n')
  text = text.replace(/<\/?ol>/gi, '\n')

  // 5) transformar outras tags de quebra
  text = text.replace(/<br\s*\/?>/gi, '\n')
  text = text.replace(/<\/p>/gi, '\n\n')
  text = text.replace(/<p>/gi, '')
  text = text.replace(/<\/h[1-6]>/gi, '\n\n')
  text = text.replace(/<h[1-6][^>]*>/gi, '\n')

  // 6) remover TODAS as outras tags HTML restantes
  text = text.replace(/<[^>]+>/g, '')

  // 7) tratar entidades HTML
  text = text
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')

  // 8) normalizar espaços em branco (mas manter quebras de linha)
  text = text.replace(/[ \t]+/g, ' ')

  // 9) limpar linhas que só têm espaços
  text = text
    .split('\n')
    .map((line) => line.trim())
    .join('\n')

  // 10) normalizar múltiplas quebras de linha (máximo 2)
  text = text.replace(/\n{3,}/g, '\n\n')

  // 11) garantir espaço após bullets
  text = text.replace(/•([^\s])/g, '• $1')

  // 12) remover bullets órfãos (linhas que só têm •)
  text = text
    .split('\n')
    .filter((line) => line !== '•')
    .join('\n')

  return text.trim()
}

// Checa se tem uma imagem realmente válida entre as URLs do CSV
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
      console.log('  ↳ Testando imagem:', url)

      const res = await axios.get<ArrayBuffer>(url, {
        responseType: 'arraybuffer',
        validateStatus: (status) => status < 400, // não explode em 404/500
      })

      const contentType = (res.headers['content-type'] || '').toLowerCase()
      const byteLength = (res.data as any).byteLength ?? (res.data as any).length ?? 0

      if (!contentType.startsWith('image/')) {
        console.warn('    ⚠ Resposta não é imagem (content-type =', contentType, '), ignorando.')
        continue
      }

      if (!byteLength || byteLength === 0) {
        console.warn('    ⚠ Resposta vazia, ignorando.')
        continue
      }

      const buffer = Buffer.from(res.data)
      const urlParts = url.split('/')
      const filename = urlParts[urlParts.length - 1] || 'image.jpg'

      console.log('    ✅ Imagem válida encontrada:', filename)
      return { buffer, filename }
    } catch (err) {
      console.warn('    ⚠ Erro ao baixar imagem, tentando próxima URL:', url)
    }
  }

  return null
}

// ---------- CONFIG LOCAL DO PAYLOAD (só pro script) ----------

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

  console.log('Payload iniciado, começando importação...')

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
  const sample = mobilityRows.slice(0, 3)

  console.log(`Encontrados ${mobilityRows.length} produtos de mobilidade.`)
  console.log(`Vamos importar apenas ${sample.length} para teste.\n`)

  let imported = 0
  let skipped = 0

  for (const row of sample) {
    console.log('Processando:', row['Nome'])

    // ✅ VERIFICAÇÃO DE DUPLICATA
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
      skipped++
      continue
    }

    // cria media com MESMO esquema do projeto (Vercel Blob)
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

    // descrição já limpa como TEXTAREA normal
    const description = getCleanDescription(row)

    // cria produto
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
  console.log('Resumo da importação:')
  console.log(`  ✅ Importados: ${imported}`)
  console.log(`  ⏭️  Pulados: ${skipped}`)
  console.log(`  📊 Total processado: ${imported + skipped}`)
  console.log('─────────────────────────────────')

  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Erro ao importar produtos:', err)
  process.exit(1)
})
