import { dirname } from 'path';
import { fileURLToPath } from 'url';

// WHY DOESNT THIS WORK ITS LITERALLY A COPY PASTE OF AN INSTANCE WHERE IT DOES
// const __adirname = dirname(fileURLToPath(import.meta.url));

export const main = `${__dirname}`;

export function getParentFolderPath(filePath: string) {
    const separator = filePath.includes('/') ? '/' : '\\';
    const lastIndex = filePath.lastIndexOf(separator);
    if (lastIndex === -1) {
        return filePath; // Parent folder does not exist
    }
    return filePath.slice(0, lastIndex);
}
/**
 * path before files are compiled (ie before they're put into ./dist)
 */

// sbrbot/src/path ->
// sbrbot/dist/src/path
export const precomp = getParentFolderPath(getParentFolderPath(main));
//let path = x/y/
//want x/z/
//get

export const files = `${main}/files`;
export const cache = `${main}/cache`;
export const logs = `${main}/logs`;
