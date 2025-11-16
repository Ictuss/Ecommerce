// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Products } from './collections/Products';
import { Videos } from './collections/Videos';
import { BlogPosts } from './collections/BlogPosts';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const serverURL =
  process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000';

export default buildConfig({
  // URL pública onde o app está rodando (Vercel em produção)
  serverURL,

  // Obrigatório no Payload v3
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',

  // CORS / CSRF alinhados com admin + front
  cors: [
    serverURL,
    'http://localhost:3000', // admin local
    'http://localhost:5173',
    'https://ecommerce-inky-chi.vercel.app/' // front Vite local
  ],
  csrf: [
    serverURL,
    'http://localhost:3000',
    'http://localhost:5173',
  ],

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  upload: {
    limits: {
      fileSize: 5_000_000, // 5MB
    },
  },

  collections: [Users, Media, Products, Videos, BlogPosts],

  editor: lexicalEditor(),

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URL ||
        process.env.DATABASE_URI ||
        '',
    },
  }),

  sharp,

  plugins: [
    // payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
});
