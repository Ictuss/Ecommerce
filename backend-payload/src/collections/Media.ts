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
  // 🔐 ACCESS CONTROL
  access: {
    // Qualquer um pode ver mídias (necessário pro e-commerce)
    read: () => true,

    // Apenas usuários logados podem fazer upload
    create: ({ req: { user } }) => {
      return !!user // qualquer usuário logado
    },

    // Admins e Editors podem editar mídias
    update: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'editor'
    },

    // Apenas admins podem deletar mídias
    delete: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
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
    mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'video/ogg'],
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
