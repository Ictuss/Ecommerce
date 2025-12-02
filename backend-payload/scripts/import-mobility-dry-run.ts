import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

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

function runDryRun() {
  const csvPath = path.resolve(process.cwd(), 'data/wc-products.csv')
  console.log('Lendo CSV de:', csvPath)

  const csvContent = fs.readFileSync(csvPath, 'utf8')

  const rows = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true, // 👈 importante
    relax_quotes: true, // 👈 ajuda em textos grandes
  }) as CsvRow[]

  const mobilityRows = rows.filter((row) => isMobilityCategory(row['Categorias']))

  const sample = mobilityRows.slice(0, 3)

  console.log(`Achei ${mobilityRows.length} produtos de mobilidade.`)
  console.log('Os 3 primeiros que vamos importar seriam:\n')

  for (const row of sample) {
    const price = parsePrice(row['Preço'])

    const payloadProductShape = {
      name: row['Nome'],
      slug: '(gerado pelo hook do Payload)',
      description: row['Descrição curta'] || row['Descrição'] || '',
      price,
      category: 'mobilidade',
      featured: false,
      images: '*** AINDA VAMOS TRATAR ***',
    }

    console.log('---')
    console.log('Categorias CSV:', row['Categorias'])
    console.log(JSON.stringify(payloadProductShape, null, 2))
  }
}

runDryRun()
