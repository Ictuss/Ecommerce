import type { CollectionConfig } from 'payload'
import path from 'path'

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
    // ✅ MANTÉM staticDir para funcionar localmente
    // O plugin do Vercel Blob vai sobrescrever isso em produção
    staticDir: path.resolve(__dirname, '../../media'),

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
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      label: 'Texto Alternativo',
      type: 'text',
      required: true,
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

  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data?.alt && data?.filename) {
          data.alt = data.filename.replace(/\.[^/.]+$/, '').replace(/-|_/g, ' ')
        }
        return data
      },
    ],
  },
}
