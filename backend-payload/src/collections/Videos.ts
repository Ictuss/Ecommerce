// payload/collections/Videos.ts
import type { CollectionConfig } from 'payload'

export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true, // público pra listar no site
  },
  fields: [
    {
      name: 'title', // vira mainTitle no front
      type: 'text',
      required: true,
    },
    {
      name: 'slug', // pra usar rota /videos/:slug no futuro
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description', // vira descriptionText
      type: 'textarea',
    },
    {
      name: 'videoUrl', // YouTube / arquivo / o que você quiser
      type: 'text',
      required: true,
      admin: {
        description: 'URL do YouTube, Vimeo ou arquivo de vídeo',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      type: 'text', // deixa texto livre p/ bater com "mobilidade", "aspirar-baby" etc
      admin: {
        description: 'Use o mesmo texto da categoria de produtos (ex: "mobilidade").',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
