import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const path = `${__dirname}`;

export const filespath = `${__dirname}\\files`;