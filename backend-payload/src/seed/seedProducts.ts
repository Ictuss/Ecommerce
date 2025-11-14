import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import dotenv from 'dotenv'
import payload from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// carregar .env da raiz do backend
dotenv.config({
  path: path.resolve(dirname, '../../.env'),
})

type ProductSeed = {
  name: string
  description: string
  price: number
  category: 'mae-bebe' | 'mobilidade' | 'roupas' | 'acessorios' | 'calcados' | 'inverno'
  featured: boolean
}

// lista inicial de produtos (sem imagens, slug vai ser gerado pelo hook)
const products: ProductSeed[] = [
  {
    name: 'Repellik – Repelente adesivo de citronela',
    description:
      'Repelente adesivo de citronela em formato prático, ideal para proteger bebês e crianças contra mosquitos em passeios e ambientes externos.',
    price: 0,
    category: 'mae-bebe',
    featured: false,
  },
  {
    name: 'Toalhas umedecidas Dengo – 20x15cm',
    description:
      'Toalhas umedecidas delicadas, tamanho 20x15cm, ideais para a higiene diária do bebê com suavidade e praticidade.',
    price: 0,
    category: 'mae-bebe',
    featured: false,
  },
  {
    name: 'Aspirar baby – Desentupidor de nariz',
    description:
      'Aspirador nasal para bebês, ajuda a desobstruir o nariz de forma segura e confortável, facilitando a respiração.',
    price: 0,
    category: 'mae-bebe',
    featured: false,
  },
  {
    name: 'Absorvente para seios Mabie',
    description:
      'Absorventes para seios descartáveis, desenvolvidos para dar conforto e segurança às mamães durante o período de amamentação.',
    price: 0,
    category: 'mae-bebe',
    featured: false,
  },
  {
    name: 'Aquecedor portátil para mamadeira',
    description:
      'Aquecedor portátil para mamadeiras, ideal para passeios e uso noturno, aquece o leite na temperatura ideal em poucos minutos.',
    price: 0,
    category: 'mae-bebe',
    featured: false,
  },
  {
    name: 'Conchas (Antes do parto) Savemilk',
    description:
      'Conchas protetoras para uso antes do parto, ajudam a preparar a região mamilar de forma confortável e discreta.',
    price: 0,
    category: 'mae-bebe',
    featured: false,
  },
  {
    name: 'Mordedor alimentador',
    description:
      'Mordedor alimentador que permite oferecer frutas e alimentos macios ao bebê com segurança, aliviando o desconforto da gengiva.',
    price: 0,
    category: 'mae-bebe',
    featured: false,
  },
  {
    name: 'Nosewash – Lavagem nasal',
    description:
      'Kit de lavagem nasal desenvolvido para ajudar na higiene das vias respiratórias, trazendo mais conforto para o bebê.',
    price: 0,
    category: 'mae-bebe',
    featured: false,
  },
  {
    name: 'Cadeira motorizada Praxis',
    description:
      'Cadeira motorizada projetada para oferecer mobilidade, conforto e segurança ao usuário em diferentes ambientes.',
    price: 0,
    category: 'mobilidade',
    featured: false,
  },
]

async function seed() {
const configPath = path.resolve(dirname, '../payload.config.js')
const config = (await import(pathToFileURL(configPath).href)).default



  await payload.init({
    config,
  })

for (const product of products) {
  console.log('Criando produto:', product.name)

await payload.create({
  collection: 'products',
  data: product as any, // 👈 força o tipo de dados, evita conflito com o tipo gerado do Payload
  draft: false,
})


}


  console.log('✅ Seed de produtos finalizado!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Erro no seed:', err)
  process.exit(1)
})
