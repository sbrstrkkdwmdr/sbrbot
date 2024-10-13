// cant be bothered configuring jest lmfao
import * as test from './test.js';

import * as msgfunc from '../commands/msgfunc.js';

export function run() {
    console.log('Running tests...');
    test.checkTests();

}

run();