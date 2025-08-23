import type { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'inStock'],
  },
  access: {
    read: () => true, // Público para o ecommerce
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL amigável para o produto'
      }
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      admin: {
        description: 'Descrição curta para listagens'
      }
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'salePrice',
      type: 'number',
      min: 0,
      admin: {
        description: 'Preço promocional (opcional)'
      }
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      admin: {
        description: 'Ex: roupas, acessórios, calçados'
      }
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
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
        }
      ]
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'stock',
      type: 'number',
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mostrar na página inicial'
      }
    },
    // Campos para migração do WordPress
    {
      name: 'wpId',
      type: 'number',
      admin: {
        description: 'ID do produto no WordPress (para migração)'
      }
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
        // Auto-gerar slug se não existir
        if (!data.slug && data.name) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
        return data;
      }
    ]
  }
};