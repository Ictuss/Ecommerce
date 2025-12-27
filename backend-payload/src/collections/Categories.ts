import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order', 'showOnHome'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nome',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
    },
    {
      name: 'banner',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Banner',
    },
    {
      name: 'order',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Ordem de exibição',
    },
    {
      name: 'showOnHome',
      type: 'checkbox',
      required: false,
      defaultValue: false,
      label: 'Exibir na Home',
      admin: {
        description: 'Marque para mostrar esta categoria na página inicial',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data.slug && data.name) {
          data.slug = data.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
  },
}