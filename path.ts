import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const path = `${__dirname}`;

export const filespath = `${__dirname}/files`;


export function getParentFolderPath(filePath: string) {
    const separator = filePath.includes('/') ? '/' : '/';
    const lastIndex = filePath.lastIndexOf(separator);
    if (lastIndex === -1) {
        return filePath; // Parent folder does not exist
    }
    return filePath.slice(0, lastIndex);
}

export const precomppath = getParentFolderPath(path);
//let path = x/y/
//want x/z/
//get