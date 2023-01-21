import path from 'path';

/* SET DEFAULT CONFIG DIRECTORY */
process.env.NODE_CONFIG_DIR = path.join(process.cwd(), 'dist/core/config/');

export * from './server';