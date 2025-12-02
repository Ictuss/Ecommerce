// scripts/import-mobility.ts
// @ts-nocheck

import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import axios from 'axios'
import payload, { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import dotenv from 'dotenv'

// importa só o que precisamos do seu projeto
import { Products } from '../src/collections/Products.ts'
import { Media } from '../src/collections/Media.ts'

dotenv.config()

// ---------- TIPOS E HELPERS DO CSV ----------

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
  return c.includes('MOBILI') // MOBILIÁRIO, MOBILIDADE, etc.
}

function parsePrice(raw: string): number {
  if (!raw) return 0
  const normalized = raw.replace(/\./g, '').replace(',', '.')
  const n = Number(normalized)
  return Number.isFinite(n) ? n : 0
}

async function downloadFirstImageAsBuffer(
  rawImages: string,
): Promise<{ buffer: Buffer; filename: string } | null> {
  if (!rawImages) return null

  const firstUrl = rawImages.split(',')[0]?.trim()
  if (!firstUrl) return null

  console.log('  ↳ Baixando imagem:', firstUrl)

  const res = await axios.get<ArrayBuffer>(firstUrl, {
    responseType: 'arraybuffer',
  })
  const buffer = Buffer.from(res.data)

  const urlParts = firstUrl.split('/')
  const filename = urlParts[urlParts.length - 1] || 'image.jpg'

  return { buffer, filename }
}

// ---------- CONFIG LOCAL DO PAYLOAD SÓ PRA ESSE SCRIPT ----------

const localConfig = buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  collections: [Products, Media],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.DATABASE_URI || '',
    },
  }),
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

  for (const row of sample) {
    console.log('Importando:', row['Nome'])

    const imgInfo = await downloadFirstImageAsBuffer(row['Imagens'])
    if (!imgInfo) {
      console.warn('  ⚠ Sem imagem válida, pulando produto.')
      continue
    }

    // cria media
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

    // cria produto
    const product = await payload.create({
      collection: 'products',
      data: {
        name: row['Nome'],
        description: row['Descrição curta'] || row['Descrição'] || '',
        price: parsePrice(row['Preço']),
        category: 'mobilidade',
        featured: false,
        images: [{ image: mediaDoc.id, alt: row['Nome'] }],
      },
    } as any)

    console.log('  ✔ Produto criado:', product.id)
  }

  console.log('Fim da importação!')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Erro ao importar produtos:', err)
  process.exit(1)
})
