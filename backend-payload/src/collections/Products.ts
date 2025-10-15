import type { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'featured'],
  },
  access: {
    read: () => true, // Público para leitura
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nome do Produto',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL amigável (ex: camiseta-preta)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Descrição',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      label: 'Preço',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Categoria',
      options: [
        { label: 'Roupas', value: 'roupas' },
        { label: 'Acessórios', value: 'acessorios' },
        { label: 'Calçados', value: 'calcados' },
        { label: 'inverno', value: 'inverno' },
         { label: 'mae-bebe', value: 'mae-bebe' },
          { label: 'mobilidade', value: 'mobilidade' },
      ],
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 5,
      label: 'Imagens',
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
          defaultValue: 'Imagem do produto',
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Produto em Destaque',
      admin: {
        description: 'Mostrar na página inicial',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-gerar slug se não existir
        if (!data.slug && data.name) {
          data.slug = data.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
        return data;
      },
    ],
  },
};