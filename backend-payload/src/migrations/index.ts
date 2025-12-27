import * as migration_20251227_202906 from './20251227_202906';

export const migrations = [
  {
    up: migration_20251227_202906.up,
    down: migration_20251227_202906.down,
    name: '20251227_202906'
  },
];
