import type { CollectionConfig } from 'payload';

export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'videoUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'URL do YouTube, Vimeo ou arquivo de vídeo'
      }
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Tutorial', value: 'tutorial' },
        { label: 'Produto', value: 'product' },
        { label: 'Institucional', value: 'institutional' },
      ]
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    }
  ]
};