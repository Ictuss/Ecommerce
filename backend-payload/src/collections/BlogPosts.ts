import type { CollectionConfig } from 'payload';

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt'],
  },
  access: {
   read: ({ req }) => {
    console.log('Acesso público solicitado:', req.url); // Depuração
    return true; // Sempre permite leitura
  }, // Permitir leitura pública por enquanto
    create: () => true, // Permitir criação
    update: () => true, // Permitir edição
    delete: () => true, // Permitir exclusão
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
      required: true,
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
        },
        {
          name: 'metaDescription',
          type: 'textarea',
        }
      ]
    },
    // Campos para migração do WordPress
    {
      name: 'wpId',
      type: 'number',
    },
    {
      name: 'publishedAt',
      type: 'date',
      defaultValue: () => new Date(),
    }
  ],
  hooks: {
    beforeChange: [
      ({ data }: any) => {
        // Auto-gerar slug
        if (!data.slug && data.title) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
        return data;
      }
    ]
  }
};