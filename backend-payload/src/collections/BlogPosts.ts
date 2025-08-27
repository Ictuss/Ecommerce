import type { CollectionConfig } from 'payload';

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt'],
  },
  // TEMPORARIAMENTE removendo todas as restrições de acesso para debug
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
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
      admin: {
        description: 'URL amigável do post (será gerada automaticamente se não preenchida)'
      }
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Resumo do post para listagens'
      }
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      admin: {
        rows: 10,
        description: 'Conteúdo completo do post'
      }
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: false, // Temporariamente não obrigatório
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        }
      ]
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Novidades', value: 'news' },
        { label: 'Dicas', value: 'tips' },
        { label: 'Tendências', value: 'trends' },
        { label: 'Eventos', value: 'events' },
      ]
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        }
      ]
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Rascunho', value: 'draft' },
        { label: 'Publicado', value: 'published' },
      ]
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Post em destaque'
      }
    },
    // Campos SEO
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'Título para SEO (se não preenchido, usará o título do post)'
          }
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'Descrição para SEO'
          }
        }
      ]
    },
    // Campos para migração do WordPress
    {
      name: 'wpId',
      type: 'number',
      admin: {
        hidden: true, // Oculta no admin, usado apenas para migração
      }
    },
    {
      name: 'publishedAt',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        description: 'Data de publicação'
      }
    }
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-gerar slug se não existir
        if (!data.slug && data.title) {
          data.slug = data.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais
            .replace(/\s+/g, '-') // Substitui espaços por hífens
            .replace(/(^-|-$)/g, ''); // Remove hífens no início e fim
        }

        return data;
      }
    ]
  }
};