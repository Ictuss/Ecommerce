// scripts/import-new-categories.ts
// @ts-nocheck

import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import axios from 'axios'
import payload, { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import dotenv from 'dotenv'

// Importa MESMAS collections que o app usa
import { Products } from '../src/collections/Products.ts'
import { Media } from '../src/collections/Media.ts'
import { Categories } from '../src/collections/Categories.ts'

dotenv.config()

// ---------- MAPEAMENTO DE CATEGORIAS ----------

const CATEGORY_MAPPING: Record<string, string> = {
  // Categorias originais (já existiam)
  'INVERNO': 'inverno',
  'MAMÃE E BEBÊ': 'mae-bebe',
  'Mobilidade': 'mobilidade',
  'COVID-19': 'covid-19',
  'ESTÉTICA': 'estetica',
  
  // Novas categorias
  '3M LITTMANN': '3m-littmann',
  'ACADÊMICOS': 'academicos',
  'PRODUTOS ORTOPÉDICOS': 'produtos-ortopedicos',
  'PRODUTOS TERAPÊUTICOS': 'produtos-terapeuticos',
  'FITNESS': 'fitness',
  'EPIs': 'epis',
  'PODOLOGIA': 'podologia',
  'APNEIA RONCO': 'apneia-ronco',
  'Higiene': 'higiene',
  'BANDAGENS': 'bandagens',
  'MOBILIÁRIO': 'mobiliario',
  'DESCARTAVEIS': 'descartaveis',
  'ESTERILIZADORES': 'esterilizadores',
  'CURATIVOS/COLOSTOMIA': 'curativos-colostomia',
  'UMIDIFICADORES': 'umidificadores',
  'PRODUTOS ODONTOLOGICOS': 'produtos-odontologicos',
  'RESGATE': 'resgate',
  'Conforto': 'conforto',
  'Calçados': 'calcados',
  'Acessórios': 'acessorios',
  'Roupas': 'roupas',
  'SUGESTÕES DE PRESENTES': 'sugestoes-presentes',
  'RECENTES': 'recentes',
  'OUTROS': 'outros',
}

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

/**
 * Verifica se o produto pertence às novas categorias
 */
function getProductCategory(csvCategories: string): string | null {
  const cats = csvCategories.split(',').map((c) => c.trim())

  // Prioriza categorias específicas sobre "OUTROS"
  for (const cat of cats) {
    if (CATEGORY_MAPPING[cat] && CATEGORY_MAPPING[cat] !== 'outros') {
      return CATEGORY_MAPPING[cat]
    }
  }

  // Se só tiver "OUTROS", usa ele
  for (const cat of cats) {
    if (CATEGORY_MAPPING[cat]) {
      return CATEGORY_MAPPING[cat]
    }
  }

  return null
}

/**
 * Valida se o produto tem qualidade mínima para ser importado
 */
function isValidProduct(row: CsvRow): { valid: boolean; reason?: string } {
  const name = row['Nome']?.trim() || ''
  const images = row['Imagens']?.trim() || ''

  // 1. Nome deve existir e ter no mínimo 3 caracteres
  if (!name || name.length < 3) {
    return { valid: false, reason: 'Nome muito curto ou vazio' }
  }

  // 2. Não pode ter padrões de teste
  const testPatterns = [
    /^teste/i,
    /^test/i,
    /^aaa+/i,
    /^xxx+/i,
    /^123/,
    /^\d+$/,  // só números
    /^[a-z]$/i,  // só uma letra
    /lorem ipsum/i,
    /asdf/i,
    /qwerty/i,
  ]

  for (const pattern of testPatterns) {
    if (pattern.test(name)) {
      return { valid: false, reason: 'Nome parece ser de teste' }
    }
  }

  // 3. Nome deve ter pelo menos uma palavra com 3+ letras
  const words = name.split(/\s+/)
  const hasValidWord = words.some((w) => /[a-záàâãéèêíïóôõöúçñ]{3,}/i.test(w))
  if (!hasValidWord) {
    return { valid: false, reason: 'Nome não tem palavras válidas' }
  }

  // 4. Deve ter pelo menos uma URL de imagem
  if (!images || images.length < 10) {
    return { valid: false, reason: 'Sem URL de imagem' }
  }

  // 5. Verificar se tem pelo menos uma URL válida
  const imageUrls = images.split(',').map((u) => u.trim()).filter(Boolean)
  const hasValidUrl = imageUrls.some((url) => {
    try {
      new URL(url)
      return url.match(/\.(jpg|jpeg|png|gif|webp)($|\?)/i)
    } catch {
      return false
    }
  })

  if (!hasValidUrl) {
    return { valid: false, reason: 'URLs de imagem inválidas' }
  }

  return { valid: true }
}

function parsePrice(raw: string): number {
  if (!raw) return 0
  const normalized = raw.replace(/\./g, '').replace(',', '.')
  const n = Number(normalized)
  return Number.isFinite(n) ? n : 0
}

/**
 * Limpa a descrição pra ficar com cara de "textarea" do Payload.
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

  // 2) remover &nbsp; ANTES de processar
  text = text.replace(/&nbsp;/gi, ' ')

  // 3) converter listas <li> em bullets
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

  // 8) normalizar espaços em branco
  text = text.replace(/[ \t]+/g, ' ')

  // 9) limpar linhas que só têm espaços
  text = text
    .split('\n')
    .map((line) => line.trim())
    .join('\n')

  // 10) normalizar múltiplas quebras de linha
  text = text.replace(/\n{3,}/g, '\n\n')

  // 11) garantir espaço após bullets
  text = text.replace(/•([^\s])/g, '• $1')

  // 12) remover bullets órfãos
  text = text
    .split('\n')
    .filter((line) => line !== '•')
    .join('\n')

  return text.trim()
}

/**
 * Baixa a primeira imagem válida das URLs do CSV
 */
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
        timeout: 10000, // 10 segundos de timeout
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
      // Ignora erro e tenta próxima imagem
      continue
    }
  }

  return null
}

// ---------- CONFIG LOCAL DO PAYLOAD ----------

const localConfig = buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',

  collections: [Products, Media, Categories],

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

  console.log('✨ Payload iniciado!\n')

  // Buscar todas as categorias para mapear slugs -> IDs
  console.log('📂 Carregando categorias...')
  const categoriesData = await payload.find({
    collection: 'categories',
    limit: 100,
  })

  const categorySlugToId: Record<string, string> = {}
  categoriesData.docs.forEach((cat: any) => {
    categorySlugToId[cat.slug] = cat.id
  })

  console.log(`✅ ${categoriesData.docs.length} categorias carregadas\n`)

  // Ler CSV
  const csvPath = path.resolve(process.cwd(), 'data/wc-products.csv')
  console.log('📄 Lendo CSV de:', csvPath)

  const csvContent = fs.readFileSync(csvPath, 'utf8')
  const rows = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    relax_quotes: true,
  }) as CsvRow[]

  // Filtrar produtos das novas categorias
  const productsToImport = rows.filter((r) => {
    const categorySlug = getProductCategory(r['Categorias'])
    return categorySlug !== null
  })

  console.log(`📦 Encontrados ${productsToImport.length} produtos nas novas categorias`)
  
  // Validar qualidade dos produtos
  const validProducts: CsvRow[] = []
  const invalidProducts: Array<{ name: string; reason: string }> = []

  for (const row of productsToImport) {
    const validation = isValidProduct(row)
    if (validation.valid) {
      validProducts.push(row)
    } else {
      invalidProducts.push({
        name: row['Nome'] || 'Sem nome',
        reason: validation.reason || 'Motivo desconhecido',
      })
    }
  }

  console.log(`✅ Produtos válidos: ${validProducts.length}`)
  console.log(`❌ Produtos inválidos (ignorados): ${invalidProducts.length}`)
  
  if (invalidProducts.length > 0) {
    console.log(`\n⚠️  Exemplos de produtos inválidos (primeiros 5):`)
    invalidProducts.slice(0, 5).forEach((p) => {
      console.log(`   - "${p.name}" → ${p.reason}`)
    })
  }
  
  console.log(`\n🎯 Vamos importar ${validProducts.length} produtos válidos\n`)

  let imported = 0
  let skipped = 0
  let errors = 0

  const stats: Record<string, number> = {}

  for (const row of validProducts) {
    const productName = row['Nome']
    const categorySlug = getProductCategory(row['Categorias'])

    if (!categorySlug) {
      continue
    }

    const categoryId = categorySlugToId[categorySlug]
    if (!categoryId) {
      console.log(`⚠️  Categoria "${categorySlug}" não encontrada no banco, pulando: ${productName}`)
      skipped++
      continue
    }

    console.log(`[${categorySlug}] ${productName}`)

    try {
      // ✅ Verificar duplicata
      const existingProduct = await payload.find({
        collection: 'products',
        where: {
          name: {
            equals: productName,
          },
        },
        limit: 1,
      })

      if (existingProduct.docs.length > 0) {
        console.log('  ⏭️  Já existe, pulando...\n')
        skipped++
        continue
      }

      // Baixar imagem (se não tiver, pula o produto)
      const imgInfo = await downloadFirstImageAsBuffer(row['Imagens'])
      if (!imgInfo) {
        console.log('  ⚠️  Sem imagem válida, pulando...\n')
        skipped++
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
        data: { alt: productName },
      } as any)

      // Descrição limpa
      const description = getCleanDescription(row)

      // Criar produto
      const product = await payload.create({
        collection: 'products',
        data: {
          name: productName,
          description,
          price: parsePrice(row['Preço']),
          category: categoryId,
          featured: false,
          images: [{ image: mediaDoc.id, alt: productName }],
        },
      } as any)

      console.log(`  ✅ Criado! ID: ${product.id}\n`)
      imported++

      // Atualizar estatísticas
      stats[categorySlug] = (stats[categorySlug] || 0) + 1
    } catch (err) {
      console.error(`  ❌ Erro ao criar produto:`, err.message)
      errors++
    }
  }

  console.log('═══════════════════════════════════════')
  console.log('📊 Resumo da importação:')
  console.log('═══════════════════════════════════════')
  console.log(`  ✅ Importados: ${imported}`)
  console.log(`  ⏭️  Pulados (duplicados): ${skipped}`)
  console.log(`  ❌ Erros: ${errors}`)
  console.log(`  🚫 Produtos inválidos (ignorados): ${invalidProducts.length}`)
  console.log(`  📈 Total no CSV: ${productsToImport.length}`)
  console.log(`  📈 Válidos processados: ${validProducts.length}`)
  console.log('═══════════════════════════════════════\n')

  console.log('📊 Produtos importados por categoria:')
  console.log('─────────────────────────────────────')
  Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([slug, count]) => {
      console.log(`  ${slug}: ${count} produtos`)
    })

  process.exit(0)
}   

main().catch((err) => {
  console.error('❌ Erro fatal ao importar produtos:', err)
  process.exit(1)
})