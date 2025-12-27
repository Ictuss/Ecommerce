// scripts/update-categories-order.ts
// @ts-nocheck

import payload, { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import dotenv from 'dotenv'

// Importa as collections do seu projeto
import { Categories } from '../src/collections/Categories.ts'
import { Media } from '../src/collections/Media.ts'

dotenv.config()

/**
 * ORDEM CORRETA DAS CATEGORIAS
 * Respeitando as 3 primeiras que já existiam (Inverno, Mamãe e Bebê, Mobilidade)
 */
const CORRECT_ORDER = [
  // ✅ Categorias principais originais (já existiam)
  { slug: 'inverno', order: 1, showOnHome: true },
  { slug: 'mae-bebe', order: 2, showOnHome: true },
  { slug: 'mobilidade', order: 3, showOnHome: true },
  
  // 🆕 Novas categorias principais (para aparecer na home)
  { slug: '3m-littmann', order: 4, showOnHome: true },
  { slug: 'academicos', order: 5, showOnHome: true },
  { slug: 'produtos-ortopedicos', order: 6, showOnHome: true },
  { slug: 'produtos-terapeuticos', order: 7, showOnHome: true },
  { slug: 'fitness', order: 8, showOnHome: true },
  { slug: 'epis', order: 9, showOnHome: true },
  
  // Categorias secundárias (não aparecem na home)
  { slug: 'covid-19', order: 10, showOnHome: false },
  { slug: 'estetica', order: 11, showOnHome: false },
  { slug: 'podologia', order: 12, showOnHome: false },
  { slug: 'apneia-ronco', order: 13, showOnHome: false },
  { slug: 'higiene', order: 14, showOnHome: false },
  { slug: 'bandagens', order: 15, showOnHome: false },
  { slug: 'mobiliario', order: 16, showOnHome: false },
  { slug: 'descartaveis', order: 17, showOnHome: false },
  { slug: 'esterilizadores', order: 18, showOnHome: false },
  { slug: 'curativos-colostomia', order: 19, showOnHome: false },
  { slug: 'umidificadores', order: 20, showOnHome: false },
  { slug: 'produtos-odontologicos', order: 21, showOnHome: false },
  { slug: 'resgate', order: 22, showOnHome: false },
  { slug: 'conforto', order: 23, showOnHome: false },
  { slug: 'calcados', order: 24, showOnHome: false },
  { slug: 'acessorios', order: 25, showOnHome: false },
  { slug: 'roupas', order: 26, showOnHome: false },
  
  // Categorias especiais (tags/filtros)
  { slug: 'sugestoes-presentes', order: 97, showOnHome: false },
  { slug: 'recentes', order: 98, showOnHome: false },
  { slug: 'outros', order: 99, showOnHome: false },
]

// ---------- CONFIG LOCAL DO PAYLOAD (só pro script) ----------

const localConfig = buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',

  collections: [Categories, Media],

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.DATABASE_URI || '',
    },
  }),

  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
})

// ---------- MAIN ----------

async function main() {
  await payload.init({
    config: localConfig,
    local: true,
  })

  console.log('✨ Payload iniciado!\n')
  console.log('🔄 Reorganizando ordem das categorias...\n')

  let updated = 0
  let notFound = 0
  let errors = 0

  for (const categoryConfig of CORRECT_ORDER) {
    try {
      console.log(`Processando: ${categoryConfig.slug}`)

      // Busca a categoria pelo slug
      const existing = await payload.find({
        collection: 'categories',
        where: {
          slug: {
            equals: categoryConfig.slug,
          },
        },
        limit: 1,
      })

      if (existing.docs.length === 0) {
        console.log(`  ⚠️  Categoria não encontrada no banco, pulando...\n`)
        notFound++
        continue
      }

      const category = existing.docs[0]

      // Atualiza a ordem e showOnHome
      const updatedCategory = await payload.update({
        collection: 'categories',
        id: category.id,
        data: {
          order: categoryConfig.order,
          showOnHome: categoryConfig.showOnHome,
        },
      })

      console.log(`  ✅ Atualizada!`)
      console.log(`     → ID: ${category.id}`)
      console.log(`     → Nome: ${category.name}`)
      console.log(`     → Nova ordem: ${categoryConfig.order}`)
      console.log(`     → Na home: ${categoryConfig.showOnHome ? 'SIM' : 'NÃO'}\n`)

      updated++
    } catch (err) {
      console.error(`  ❌ Erro ao atualizar categoria "${categoryConfig.slug}":`, err)
      errors++
    }
  }

  console.log('═══════════════════════════════════════')
  console.log('📊 Resumo da reorganização:')
  console.log('═══════════════════════════════════════')
  console.log(`  ✅ Atualizadas: ${updated}`)
  console.log(`  ⚠️  Não encontradas: ${notFound}`)
  console.log(`  ❌ Erros: ${errors}`)
  console.log(`  📈 Total processado: ${CORRECT_ORDER.length}`)
  console.log('═══════════════════════════════════════\n')

  if (updated > 0) {
    console.log('🎉 Categorias reorganizadas com sucesso!')
    console.log('\n📋 Ordem atual das categorias na home:')
    
    const homeCategories = CORRECT_ORDER
      .filter(c => c.showOnHome)
      .sort((a, b) => a.order - b.order)
    
    homeCategories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.slug} (ordem ${cat.order})`)
    })
  }

  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Erro fatal ao reorganizar categorias:', err)
  process.exit(1)
})