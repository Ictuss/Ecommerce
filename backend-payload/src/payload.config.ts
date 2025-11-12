// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Videos } from './collections/Videos'
import { BlogPosts } from './collections/BlogPosts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

console.log('>>> DATABASE_URI no payload.config:', process.env.DATABASE_URI)

export default buildConfig({
  cors: [
    'http://localhost:3000', // Admin do Payload
    'http://localhost:5173', // Frontend React
  ],
  csrf: [
    'http://localhost:3000', // Admin do Payload
    'http://localhost:5173', // Frontend React
  ],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
    upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
  collections: [Users, Media, Products, Videos, BlogPosts],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    // payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})