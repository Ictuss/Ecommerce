// src/seed/seedAdmin.ts
import path from 'path';
import dotenv from 'dotenv';
import payload from 'payload';
import { fileURLToPath } from 'url';

// importa o config do Payload (objeto, não path!)
import config from '../../payload.config';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// carrega seu .env local
dotenv.config({
  path: path.resolve(dirname, '../../.env'),
});

const run = async () => {
  // Inicializa o Payload com o config (sem secret!)
  await payload.init({
    config,
  });

  console.log('🌱 Criando usuário admin...');

  const user = await payload.create({
    collection: 'users',
    data: {
      name: 'Felipe Admin',
      email: 'fdomingueskt@gmail.com',
      password: 'MinhaSenhaFort3!',
      role: 'admin',
    },
    overrideAccess: true,
  });

  console.log('✅ Admin criado:', user);
  process.exit(0);
};

run().catch((err) => {
  console.error('Erro ao criar admin:', err);
  process.exit(1);
});
