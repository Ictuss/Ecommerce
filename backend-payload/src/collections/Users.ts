import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // 🔐 Proteção contra brute force
    maxLoginAttempts: 5, // máximo de tentativas
    lockTime: 600 * 1000, // 10 minutos bloqueado

    // 🍪 Cookies seguros
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax', // ✅ Com L maiúsculo
    },
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Apenas admins podem criar outros usuários
    create: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
    // Usuários podem ver apenas a si mesmos, admins veem todos
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    // Usuários podem editar apenas a si mesmos, admins editam todos
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    // Apenas admins podem deletar usuários
    delete: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Apenas admins podem alterar roles
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}
