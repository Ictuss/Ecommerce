// scripts/import-category.ts
// Script genérico para importar produtos de qualquer categoria
// Uso: npm run import:category -- "MAMÃE E BEBÊ"
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

// Mapeamento de categorias CSV → categorias do Payload
const CATEGORY_SLUGS: Record<string, string> = {
  'MAMÃE E BEBÊ': 'mae-bebe',
  MOBILIÁRIO: 'mobilidade',
  Mobilidade: 'mobilidade',
  INVERNO: 'inverno',
  // Mapear todas as outras para categorias genéricas ou criar novas
  'PRODUTOS ORTOPÉDICOS': 'acessorios',
  'PRODUTOS TERAPÊUTICOS': 'acessorios',
  ACADÊMICOS: 'acessorios',
  'COVID-19': 'acessorios',
  ESTÉTICA: 'acessorios',
  FITNESS: 'roupas',
  OUTROS: 'acessorios',
  RECENTES: 'acessorios',
  'SUGESTÕES DE PRESENTES': 'acessorios',
  PODOLOGIA: 'calcados',
  EPIs: 'acessorios',
  BANDAGENS: 'acessorios',
  DESCARTAVEIS: 'acessorios',
  UMIDIFICADORES: 'acessorios',
  RESGATE: 'acessorios',
  'PRODUTOS ODONTOLOGICOS': 'acessorios',
  'CURATIVOS/COLOSTOMIA': 'acessorios',
  'APNEIA RONCO': 'acessorios',
  ESTERILIZADORES: 'acessorios',
  '3M LITTMANN': 'acessorios',
}

function matchesCategory(rowCategories: string, targetCategory: string): boolean {
  const cats = (rowCategories || '').toUpperCase()
  const target = targetCategory.toUpperCase()

  // Divide as categorias por vírgula e checa se alguma bate
  const categoryList = cats.split(',').map((c) => c.trim())
  return categoryList.some((cat) => cat === target)
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
  // Pegar categoria como argumento: npm run import:category -- "MAMÃE E BEBÊ"
  const targetCategory = process.argv[2]

  if (!targetCategory) {
    console.log('❌ Você precisa especificar uma categoria!')
    console.log('\n📋 Categorias disponíveis:')
    Object.keys(CATEGORY_SLUGS).forEach((cat) => {
      console.log(`  • ${cat}`)
    })
    console.log('\n💡 Uso: npm run import:category -- "MAMÃE E BEBÊ"')
    process.exit(1)
  }

  await payload.init({
    config: localConfig,
    local: true,
  })

  console.log(`Payload iniciado, importando categoria: ${targetCategory}`)

  const csvPath = path.resolve(process.cwd(), 'data/wc-products.csv')
  console.log('Lendo CSV de:', csvPath)

  const csvContent = fs.readFileSync(csvPath, 'utf8')
  const rows = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    relax_quotes: true,
  }) as CsvRow[]

  const categoryRows = rows.filter((r) => matchesCategory(r['Categorias'], targetCategory))

  console.log(`\n📊 Encontrados ${categoryRows.length} produtos da categoria "${targetCategory}"`)
  console.log(`🚀 Vamos importar TODOS.\n`)

  if (categoryRows.length === 0) {
    console.log('⚠️  Nenhum produto encontrado para esta categoria.')
    console.log('💡 Verifique se o nome está correto (case-sensitive)')
    process.exit(0)
  }

  let imported = 0
  let skipped = 0
  let failed = 0

  // Pegar o slug da categoria
  const categorySlug = CATEGORY_SLUGS[targetCategory]

  if (!categorySlug) {
    console.log(`⚠️  Categoria "${targetCategory}" não tem mapeamento definido.`)
    console.log('💡 Será usado "acessorios" como padrão.\n')
  }

  const finalCategory = categorySlug || 'acessorios'

  // Validar se a categoria existe no Payload
  const validCategories = ['roupas', 'acessorios', 'calcados', 'inverno', 'mae-bebe', 'mobilidade']
  if (!validCategories.includes(finalCategory)) {
    console.log(`❌ Categoria "${finalCategory}" não existe no Payload!`)
    console.log('📋 Categorias válidas:', validCategories.join(', '))
    process.exit(1)
  }

  console.log(`✅ Usando categoria no Payload: "${finalCategory}"\n`)

  for (let i = 0; i < categoryRows.length; i++) {
    const row = categoryRows[i]
    const progress = `[${i + 1}/${categoryRows.length}]`

    console.log(`${progress} Processando: ${row['Nome']}`)

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

    // Criar produto
    const product = await payload.create({
      collection: 'products',
      data: {
        name: row['Nome'],
        description,
        price: parsePrice(row['Preço']),
        category: finalCategory,
        featured: false,
        images: [{ image: mediaDoc.id, alt: row['Nome'] }],
      },
    } as any)

    console.log('  ✔ Produto criado:', product.id, '\n')
    imported++
  }

  console.log('─────────────────────────────────')
  console.log(`Resumo da importação - ${targetCategory}:`)
  console.log(`  ✅ Importados: ${imported}`)
  console.log(`  ⏭️  Pulados (já existiam): ${skipped}`)
  console.log(`  ❌ Falhados (sem imagem): ${failed}`)
  console.log(`  📊 Total processado: ${imported + skipped + failed}`)
  console.log('─────────────────────────────────')

  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Erro ao importar produtos:', err)
  process.exit(1)
})
