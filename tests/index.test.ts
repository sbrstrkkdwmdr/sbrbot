// cant be bothered configuring jest lmfao
import * as test from './test.js';

import * as msgfunc from '../commands/msgfunc.js';

const patterns = [
    'https://osu.ppy.sh/u/152',
    'osu.ppy.sh/users/152',
    'osu.ppy.sh/users/152/taiko',
    '"152"',
    '152',
    '152 152',
    'hello "152 152" hello',
];

export function run() {
    console.log('Running tests...');
    test.test("user link", msgfunc.parseUsers('"user name" osu.ppy.sh/users/hello'), ["username", "hello"]);
    test.test("link link", msgfunc.parseUsers('osu.ppy.sh/u/saber osu.ppy.sh/users/username/mode'), ["saber", "username"]);
    test.test("user user", msgfunc.parseUsers('awwa userx'), ["awwa", "userx"]);
    test.test("user null", msgfunc.parseUsers('hi'), ["hi", null])
    test.checkTests();

}

run();