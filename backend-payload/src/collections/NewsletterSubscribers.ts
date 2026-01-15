// src/collections/NewsletterSubscribers.ts
import { CollectionConfig } from 'payload'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'phone', 'createdAt'],
    group: 'Marketing',
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req }: any) => !!req.user,
    delete: ({ req }: any) => !!req.user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
      maxLength: 20,
      validate: (value: any) => {
        if (!value) return true
        const phoneRegex = /^[\d\s\-\(\)\+]+$/
        if (!phoneRegex.test(value)) {
          return 'Telefone inválido'
        }
        return true
      },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ value, operation }: any) => {
            if (operation === 'create' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Se o inscrito está ativo na newsletter',
      },
    },
  ],
  timestamps: true,
}
