import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { Users } from './collections/Users'
import { BlogPosts } from './collections/BlogPosts'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Videos } from './collections/Videos'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Categories } from './collections/Categories'
import { fileURLToPath } from 'url'
import { NewsletterSubscribers } from './collections/NewsletterSubscribers'
import { newsletterSubscribe } from './endpoints/newsletter'
const allowedOrigins = [
  'http://localhost:5173',
  'https://ecommerce-frontend-five-wheat.vercel.app',
  'https://ecommerce-frontend-git-main-mongemingaus-projects.vercel.app',
  'https://ecommerce-frontend-five-wheat.vercel.app', // teu front (Vite)
  'http://localhost:3000',
]

console.log('[payload] BLOB_READ_WRITE_TOKEN definido?', !!process.env.BLOB_READ_WRITE_TOKEN)
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
export default buildConfig({
  endpoints: [
    {
      path: '/newsletter/subscribe',
      method: 'post',
      handler: newsletterSubscribe,
    },
  ],
  // 🔐 obrigatório
  secret: process.env.PAYLOAD_SECRET!,

  admin: {
    user: Users.slug,
  },

  editor: lexicalEditor({}),

  collections: [Users, Categories, Products, BlogPosts, Videos, Media, NewsletterSubscribers],

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: {
          // 👇 ESSA LINHA É A CHAVE:
          disablePayloadAccessControl: true,
          // se quiser, depois podemos testar clientUploads tb:
          // clientUploads: true,
        },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),

  // URL pública do app (Vercel)
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,

  // pra facilitar vida em front externo / testes
  cors: allowedOrigins,
  csrf: allowedOrigins,
})
