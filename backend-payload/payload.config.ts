import { buildConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { postgresAdapter } from '@payloadcms/db-postgres';

// Collections
import { Products } from './src/collections/Products';
import { BlogPosts } from './src/collections/BlogPosts';
import { Videos } from './src/collections/Videos';
import { Media } from './src/collections/Media';
import { Users } from './src/collections/Users';

export default buildConfig({
  // 🔐 obrigatória no v3
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',

  admin: {
    user: Users.slug,
  },
  editor: lexicalEditor({}),
  collections: [
    Users,
    Products,
    BlogPosts,
    Videos,
    Media,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),

  // Para development local
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
});
