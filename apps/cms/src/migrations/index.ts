import * as migration_20260707_063327_init from './20260707_063327_init';

export const migrations = [
  {
    up: migration_20260707_063327_init.up,
    down: migration_20260707_063327_init.down,
    name: '20260707_063327_init'
  },
];
