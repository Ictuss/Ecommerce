// scripts/enable-all-categories.ts
// @ts-nocheck

import payload, { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import dotenv from 'dotenv'

import { Products } from '../src/collections/Products.ts'
import { Media } from '../src/collections/Media.ts'
import { Categories } from '../src/collections/Categories.ts'

dotenv.config()

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
  console.log('🔄 Habilitando categorias na home...\n')

  // 1. Buscar todas as categorias
  const categoriesData = await payload.find({
    collection: 'categories',
    limit: 100,
  })

  console.log(`📦 Total de categorias: ${categoriesData.totalDocs}\n`)

  // 2. Buscar todos os produtos para contar por categoria
  const productsData = await payload.find({
    collection: 'products',
    limit: 1000,
  })

  console.log(`📦 Total de produtos: ${productsData.totalDocs}\n`)

  // 3. Contar produtos por categoria
  const productCountByCategory: Record<number, number> = {}

  productsData.docs.forEach((product: any) => {
    const categoryId = typeof product.category === 'object' 
      ? product.category.id 
      : product.category

    if (categoryId) {
      productCountByCategory[categoryId] = (productCountByCategory[categoryId] || 0) + 1
    }
  })

  // 4. Atualizar categorias
  let updated = 0
  let skipped = 0
  let empty = 0

  console.log('📊 Analisando categorias:\n')

  for (const category of categoriesData.docs) {
    const productCount = productCountByCategory[category.id] || 0
    const hasProducts = productCount > 0

    console.log(`  ${category.name} (${category.slug}): ${productCount} produtos`)

    // Se não tem produtos, pula
    if (!hasProducts) {
      console.log(`    ⏭️  Pulando (sem produtos)\n`)
      empty++
      continue
    }

    // Se já está com showOnHome: true, pula
    if (category.showOnHome === true) {
      console.log(`    ✅ Já está habilitada\n`)
      skipped++
      continue
    }

    // Atualiza para showOnHome: true
    try {
      await payload.update({
        collection: 'categories',
        id: category.id,
        data: {
          showOnHome: true,
        },
      })

      console.log(`    ✅ Habilitada na home!\n`)
      updated++
    } catch (err) {
      console.error(`    ❌ Erro ao atualizar:`, err.message)
    }
  }

  console.log('\n═'.repeat(70))
  console.log('📊 Resultado Final:')
  console.log('═'.repeat(70))
  console.log(`  ✅ Categorias habilitadas: ${updated}`)
  console.log(`  ⏭️  Já estavam habilitadas: ${skipped}`)
  console.log(`  🚫 Categorias vazias (sem produtos): ${empty}`)
  console.log(`  📦 Total com produtos visíveis: ${updated + skipped}`)
  console.log('═'.repeat(70))

  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Erro fatal:', err)
  process.exit(1)
})