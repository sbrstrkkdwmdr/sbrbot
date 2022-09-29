import fs = require('fs');

function commandLog(commandname: string, baseCommandType: string, absoluteID: number, commanduser) {
    const currentDate = new Date();
    return `
----------------------------------------------------
COMMAND EVENT - ${commandname} (${baseCommandType})
${currentDate} | ${currentDate.toISOString()}
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`;
}
function optsLog(absoluteID: number, options: { name: string, value: string | number }[]) {
    const currentDate = new Date();
    let firstlog = `
----------------------------------------------------
${currentDate} | ${currentDate.toISOString()}
cmd ID: ${absoluteID}
Options: \n`;
    let optslog = ''
    for (let i = 0; i < options.length; i++) {
        optslog += `${options[i].name}: ${options[i].value}\n`
    }
    if (options.length < 1) {
        optslog = '\nNo options provided'
    }
    firstlog += optslog
    firstlog += `\n----------------------------------------------------`
    return firstlog;
}

function errLog(errType: string, err: string, ID?: string) {
    const errorstring = `
${ID ? 'ID: ' + ID : ''}
Error: ${errType}
Text: ${err}
`
    return errorstring;
}

function logFile(type: string, text: string, opts?: {
    guildId: string | number
}) {
    switch (type) {
        case 'err': case 'error': default:
            fs.appendFileSync('logs/log.txt', text)
            break;
        case 'command':
            fs.appendFileSync(`logs/cmd/commands${opts.guildId ?? null}.log`, text, 'utf-8')
    }
}

export { commandLog, optsLog, errLog, logFile };

