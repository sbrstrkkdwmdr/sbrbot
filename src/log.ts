import Discord from 'discord.js';
import fs from 'fs';
import config from '../config/config.json';
import { path } from '../path.js';
import * as extypes from './types/extratypes.js';

function commandLog(commandname: string, baseCommandType: string, absoluteID: number | string, commanduser) {
    const currentDate = new Date();
    return `
----------------------------------------------------
COMMAND EVENT - ${commandname} (${baseCommandType})
${currentDate} | ${currentDate.toISOString()}
current epoch: ${currentDate.getTime()}
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`;
}
function optsLog(absoluteID: number | string, options: { name: string, value: string | number; }[]) {
    const currentDate = new Date();
    let firstlog = `
----------------------------------------------------
${currentDate} | ${currentDate.toISOString()}
current epoch: ${currentDate.getTime()}
cmd ID: ${absoluteID}
Options: \n`;
    let optslog = '';
    for (let i = 0; i < options.length; i++) {
        optslog += `${options[i].name}: ${options[i].value}\n`;
    }
    if (options.length < 1) {
        optslog = '\nNo options provided';
    }
    firstlog += optslog;
    firstlog += `\n----------------------------------------------------`;
    return firstlog;
}

function errLog(errType: string, err: string, ID?: string) {
    const currentDate = new Date();
    const errorstring = `
----------------------------------------------------
${currentDate} | ${currentDate.toISOString()}
current epoch: ${currentDate.getTime()}
${ID ? 'ID: ' + ID : ''}
Error: ${errType}
Text: ${err}
----------------------------------------------------
`;
    return errorstring;
}

function logFile(type: string, text: string, opts?: {
    guildId: string | number;
}) {
    switch (type) {
        case 'err': case 'error': default:
            fs.appendFileSync('logs/log.txt', text);
            break;
        case 'command':
            fs.appendFileSync(`logs/cmd/commands${opts?.guildId ?? null}.log`, text, 'utf-8');
    }
}


export function logCommand(input: {
    event: 'Command',
    commandType: string,
    commandId: string | number,
    commanduser: Discord.User,
    object: extypes.commandObject,
    commandName: string;
    options?: {
        name: string,
        value: string | number | boolean;
    }[];
}) {
    let optstring;
    if (input.options && input.options.length > 0) {
        optstring = '';
        const addLength = input.options.slice().sort((a, b) => b.name.length - a.name.length)[0].name.length + 1;
        for (let i = 0; i < input.options.length; i++) {
            const curopt = input.options[i];
            optstring += `${`${curopt.name}:`.padEnd(addLength)} ${curopt.value}\n`;
        }
    }

    const output = `
====================================================
${input.event}
----------------------------------------------------
Command name: ${input.commandName}
Command Type: ${input.commandType}
Date:         ${(new Date).toISOString}
Date (epoch): ${(new Date).getTime()}
ID:           ${input.commandId}
Requested by: ${input?.commanduser?.username} (${input?.commanduser?.id})
Guild ID:     ${input?.object?.guildId}
Channel ID:   ${input?.object?.channelId}
${optstring ?
            `----------------------------------------------------
${optstring}
` : ''
        }
====================================================`;
    if (config.storeCommandLogs) {
        console.log(`${path}/logs/${input?.object?.guildId ? 'cmd/' + input?.object?.guildId + '.log' : 'commands.log'}`)
        //fs.appendFileSync(`${path}/logs/${input?.object?.guildId ? 'cmd/' + input?.object?.guildId + '.log' : 'commands.log'}`, output, 'utf-8');
    }
}
// commandLog,
// optsLog,

export {
    errLog,
    logFile
};

