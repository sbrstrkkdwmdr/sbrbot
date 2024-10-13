const testPasses: {
    name: string,
    pass: boolean;
}[] = [];

/**
 * 
 * @param name name of test
 * @param input input value
 * @param output value to equal
 * doesnt work on arrays
 */
export function test(name: string, input, output): boolean {
    
    console.log(input);
    console.log(output);
    if (input == output) {
        testPasses.push({
            name,
            pass: true
        });
    } else {
        testPasses.push({
            name,
            pass: false
        });
    }
    return input == output;
}

export function checkTests() {
    let str = `- Tests\n\n`;
    let pstr = `-- ✔ Passed Tests (${testPasses.filter(x => x.pass).length})\n`;
    testPasses.filter(x => x.pass).forEach(test => {
        pstr += `--- ✔ ${test.name}\n`;
    });

    let fstr = `-- ❌ Failed Tests (${testPasses.filter(x => !x.pass).length})\n`;
    testPasses.filter(x => !x.pass).forEach(test => {
        fstr += `--- ❌ ${test.name}\n`;
    });
    if (testPasses.filter(x => x.pass).length > 0) {
        str += pstr;
    }
    if (testPasses.filter(x => !x.pass).length > 0) {
        str += fstr;
    }
    console.log(str + `\nPassed ${testPasses.filter(x => x.pass).length}/${testPasses.length} tests\n`);

}