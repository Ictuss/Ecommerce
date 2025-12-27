// scripts/fix-products-categories.ts
// @ts-nocheck

import payload, { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import dotenv from 'dotenv'

import { Products } from '../src/collections/Products.ts'
import { Media } from '../src/collections/Media.ts'
import { Categories } from '../src/collections/Categories.ts'

dotenv.config()

// Mapeamento de qual categoria os produtos deveriam estar
// Baseado nos slugs originais
const CATEGORY_FIXES = {
  // Produtos que devem ir para INVERNO
  inverno: [
    'lencol',
    'cobertor',
    'manta',
    'aquecedor',
    'termico',
  ],
  
  // Produtos que devem ir para MAMÃE E BEBÊ
  'mae-bebe': [
    'bebe',
    'baby',
    'mamadeira',
    'chupeta',
    'fralda',
    'berco',
    'carrinho',
    'banheira',
    'amamentacao',
  ],
  
  // Produtos que devem ir para MOBILIDADE
  mobilidade: [
    'cadeira de rodas',
    'andador',
    'bengala',
    'muleta',
    'apoio',
    'rampa',
  ],
}

const localConfig = buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  
  collections: [Products, Media, Categories],
  
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.DATABASE_URI || '',
    },
  }),
  
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
})

async function main() {
  await payload.init({
    config: localConfig,
    local: true,
  })

  console.log('✨ Payload iniciado!\n')
  console.log('🔍 Analisando produtos...\n')

  // 1. Buscar todas as categorias
  const categoriesData = await payload.find({
    collection: 'categories',
    limit: 100,
  })

  const categoryMap: Record<string, any> = {}
  categoriesData.docs.forEach((cat: any) => {
    categoryMap[cat.slug] = cat
  })

  console.log(`✅ Categorias carregadas: ${categoriesData.docs.length}\n`)

  // 2. Buscar todos os produtos
  const productsData = await payload.find({
    collection: 'products',
    limit: 1000,
  })

  console.log(`📦 Total de produtos no banco: ${productsData.totalDocs}\n`)

  // 3. Analisar produtos por categoria atual
  const productsByCategory: Record<string, any[]> = {}
  
  productsData.docs.forEach((product: any) => {
    const catSlug = typeof product.category === 'object' 
      ? product.category.slug 
      : 'sem-categoria'
    
    if (!productsByCategory[catSlug]) {
      productsByCategory[catSlug] = []
    }
    productsByCategory[catSlug].push(product)
  })

  console.log('📊 Produtos por categoria ATUAL:')
  console.log('═'.repeat(70))
  Object.entries(productsByCategory)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([slug, products]) => {
      console.log(`  ${slug}: ${products.length} produtos`)
    })
  console.log()

  // 4. Identificar produtos que precisam ser movidos
  console.log('🔄 Identificando produtos para reorganizar...\n')
  
  const toMove: Array<{ product: any; from: string; to: string }> = []

  for (const product of productsData.docs) {
    const currentCat = typeof product.category === 'object' 
      ? product.category.slug 
      : 'unknown'
    
    const productName = product.name.toLowerCase()

    // Verificar se deve ir para alguma categoria específica
    for (const [targetSlug, keywords] of Object.entries(CATEGORY_FIXES)) {
      const shouldMove = keywords.some(keyword => 
        productName.includes(keyword.toLowerCase())
      )

      if (shouldMove && currentCat !== targetSlug) {
        toMove.push({
          product,
          from: currentCat,
          to: targetSlug,
        })
        break
      }
    }
  }

  console.log(`📋 Produtos a serem reorganizados: ${toMove.length}\n`)

  if (toMove.length === 0) {
    console.log('✅ Nenhum produto precisa ser reorganizado!')
    console.log('\n💡 Dica: Se você sabe que há produtos nas categorias erradas,')
    console.log('   ajuste as palavras-chave no array CATEGORY_FIXES do script.\n')
    process.exit(0)
  }

  // Mostrar exemplos
  console.log('📝 Exemplos de movimentações (primeiros 10):')
  console.log('─'.repeat(70))
  toMove.slice(0, 10).forEach(({ product, from, to }) => {
    const name = product.name.substring(0, 50)
    console.log(`  "${name}" → ${from} ➜ ${to}`)
  })
  console.log()

  // 5. Confirmar antes de mover (comentar essa parte se quiser que rode automático)
  console.log('⚠️  ATENÇÃO: Isso vai MOVER os produtos para as categorias corretas!')
  console.log('   Descomente a linha 155 para executar a movimentação.\n')
  
  // DESCOMENTE A LINHA ABAIXO PARA EXECUTAR:
  // await executeMoves(toMove, categoryMap)

  process.exit(0)
}

async function executeMoves(
  toMove: Array<{ product: any; from: string; to: string }>,
  categoryMap: Record<string, any>
) {
  console.log('🚀 Iniciando movimentação...\n')
  
  let moved = 0
  let errors = 0

  for (const { product, from, to } of toMove) {
    try {
      const targetCategory = categoryMap[to]
      
      if (!targetCategory) {
        console.log(`  ⚠️  Categoria "${to}" não encontrada, pulando...`)
        errors++
        continue
      }

      await payload.update({
        collection: 'products',
        id: product.id,
        data: {
          category: targetCategory.id,
        },
      })

      console.log(`  ✅ ${product.name.substring(0, 40)} → ${to}`)
      moved++
    } catch (err) {
      console.error(`  ❌ Erro ao mover ${product.name}:`, err.message)
      errors++
    }
  }

  console.log('\n═'.repeat(70))
  console.log('📊 Resultado:')
  console.log('═'.repeat(70))
  console.log(`  ✅ Movidos: ${moved}`)
  console.log(`  ❌ Erros: ${errors}`)
  console.log('═'.repeat(70))
}

main().catch((err) => {
  console.error('❌ Erro fatal:', err)
  process.exit(1)
})