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

// Só pra conferir no build local, pode remover depois se quiser
console.log('>>> DATABASE_URL:', process.env.DATABASE_URL);
console.log('>>> DATABASE_URI:', process.env.DATABASE_URI);
console.log('>>> PAYLOAD_PUBLIC_SERVER_URL:', process.env.PAYLOAD_PUBLIC_SERVER_URL);

export default buildConfig({
  // URL pública onde o Payload está rodando (na Vercel)
  // Na Vercel: PAYLOAD_PUBLIC_SERVER_URL=https://seu-projeto.vercel.app
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',

  // 🔐 Obrigatório no Payload v3
  // Na Vercel: PAYLOAD_SECRET=uma_string_grande_e_aleatoria
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',

  // Pra não dar pau de CORS/CSRF em produção (depois você pode apertar isso)
  cors: ['*'],
  //csrf: false,

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
      // Aceita DATABASE_URL (Vercel/Neon) e cai pra DATABASE_URI se precisar
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
