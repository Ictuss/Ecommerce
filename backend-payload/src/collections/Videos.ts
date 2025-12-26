import type { CollectionConfig } from 'payload'

export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: {
    useAsTitle: 'title',
  },
  // 🔐 ACCESS CONTROL
  access: {
    // Qualquer um pode ver vídeos (necessário pro site)
    read: () => true,

    // Admins e Editors podem criar vídeos
    create: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'editor'
    },

    // Admins e Editors podem editar vídeos
    update: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'editor'
    },

    // Apenas admins podem deletar vídeos
    delete: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'videoFile',
      label: 'Vídeo (upload)',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Selecione um arquivo de vídeo da biblioteca de mídias (MP4, WebM, etc).',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      required: false,
      admin: {
        description: 'Opcional: URL do YouTube, Vimeo ou outro arquivo de vídeo externo.',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
{
  name: 'relatedProducts',
  label: 'Produtos relacionados',
  type: 'relationship',
  relationTo: 'products',
  hasMany: true,
  admin: {
    description: 'Selecione manualmente os produtos que aparecem neste vídeo.',
  },
},
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
