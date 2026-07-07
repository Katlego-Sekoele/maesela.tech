import * as migration_20260707_063327_init from './20260707_063327_init';
import * as migration_20260707_070011_gallery_password from './20260707_070011_gallery_password';
import * as migration_20260707_073000_photos_collection from './20260707_073000_photos_collection';

export const migrations = [
  {
    up: migration_20260707_063327_init.up,
    down: migration_20260707_063327_init.down,
    name: '20260707_063327_init',
  },
  {
    up: migration_20260707_070011_gallery_password.up,
    down: migration_20260707_070011_gallery_password.down,
    name: '20260707_070011_gallery_password'
  },
  {
    up: migration_20260707_073000_photos_collection.up,
    down: migration_20260707_073000_photos_collection.down,
    name: '20260707_073000_photos_collection'
  },
];
