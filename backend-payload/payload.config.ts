import { buildConfig } from 'payload/config';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';

// Collections
import { Products } from './src/collections/Products';
import { BlogPosts } from './src/collections/BlogPosts';
import { Videos } from './src/collections/Videos';
import { Media } from './src/collections/Media';
import { Users } from './src/collections/Users';

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: 'webpack',
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
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost/payload-ecommerce',
  }),
  // Para development local
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
});