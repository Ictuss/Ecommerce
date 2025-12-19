import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'featured'],
  },
  // 🔐 ACCESS CONTROL
  access: {
    // Qualquer um pode ver produtos (necessário pro e-commerce)
    read: () => true,

    // Apenas admins podem criar produtos
    create: ({ req: { user } }) => {
      return user?.role === 'admin'
    },

    // Apenas admins podem editar produtos
    update: ({ req: { user } }) => {
      return user?.role === 'admin'
    },

    // Apenas admins podem deletar produtos
    delete: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
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
      required: false,
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
        { label: 'Inverno', value: 'inverno' },
        { label: 'Mamãe e Bebê', value: 'mae-bebe' },
        { label: 'Mobilidade', value: 'mobilidade' },
        { label: 'Produtos Ortopédicos', value: 'produtos-ortopedicos' },
        { label: 'Produtos Terapêuticos', value: 'produtos-terapeuticos' },
        { label: 'Estética', value: 'estetica' },
        { label: 'COVID-19', value: 'covid-19' },
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
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
  },
}
