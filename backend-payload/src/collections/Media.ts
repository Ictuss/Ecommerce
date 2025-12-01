import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Mídia',
    plural: 'Mídias',
  },
  admin: {
    description: 'Gerencie imagens e arquivos do site',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  upload: {
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: 800,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: [
      'image/*', // continua aceitando imagens
      'video/mp4', // vídeos mp4
      'video/webm', // webm (se usar)
      'video/ogg', // ogg/ogv (opcional)
      // se quiser ser mais genérico: 'video/*'
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Texto Alternativo',
      type: 'text',
      admin: {
        description: 'Descrição da imagem para acessibilidade (obrigatório para SEO)',
      },
    },
    {
      name: 'caption',
      label: 'Legenda',
      type: 'text',
      admin: {
        description: 'Legenda que aparecerá abaixo da imagem (opcional)',
      },
    },
  ],
}
