import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { Users } from './collections/Users';
import { BlogPosts } from './collections/BlogPosts';
import { Media } from './collections/Media';
import { Products } from './collections/Products';
import { Videos } from './collections/Videos';


const allowedOrigins = [
  'http://localhost:5173', // teu front (Vite)
  'http://localhost:3000',
  'https://ecommerce-za3e.onrender.com', // admin do Payload
];
export default buildConfig({
  // 🔐 obrigatório
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',

  admin: {
    user: Users.slug,
  },

  editor: lexicalEditor({}),

  collections: [Users, Products, BlogPosts, Videos, Media],

  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },

  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },

  db: postgresAdapter({
    pool: {
      // usa DATABASE_URL (mas como setamos DATABASE_URI também, você pode logar os dois)
      connectionString: process.env.DATABASE_URL || process.env.DATABASE_URI || '',
    },
  }),

  // URL pública do app (Vercel)
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,

  // pra facilitar vida em front externo / testes
cors: allowedOrigins,
  csrf: allowedOrigins,
});
