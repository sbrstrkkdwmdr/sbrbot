import * as Discord from 'discord.js';
import fs from 'fs';
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
        case 'err': case 'error':
            fs.appendFileSync(`${path}/logs/err.log`, text, 'utf-8');
            break;
        default:
            fs.appendFileSync(`${path}/logs/general.log`, text, 'utf-8');
            break;
        case 'command':
            fs.appendFileSync(`${path}/logs/cmd/commands${opts?.guildId ?? null}.log`, text, 'utf-8');
    }
}


export function logCommand(input: {
    event: 'Command' | 'Error' | 'Update' | 'Success',
    commandType: string,
    commandId: string | number,
    commanduser?: Discord.User,
    object: extypes.commandObject,
    button?: string,
    commandName: string,
    options?: {
        name: string,
        value: string | number | boolean,
    }[];
    customString?: string,
    config: extypes.config,
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

    let output: string;
    switch (input.event) {
        case 'Command':
            output = `
====================================================
${input.event}
----------------------------------------------------
Command name: ${input.commandName}
Command Type: ${input.commandType}
Date:         ${(new Date).toISOString()}
Date (epoch): ${(new Date).getTime()}
ID:           ${input.commandId}
Requested by: ${input?.commanduser?.username} (${input?.commanduser?.id})
Guild ID:     ${input?.object?.guildId}
Channel ID:   ${input?.object?.channelId}
${input.button ?
                    `----------------------------------------------------
Button: ${input.button}
`
                    : ''}
${optstring ?
                    `----------------------------------------------------
${optstring}
` : ''
                }
====================================================`;
            break;
        case 'Error':
            output = `
====================================================
${input.event}
----------------------------------------------------
Command name: ${input.commandName}
Date:         ${(new Date).toISOString()}
Date (epoch): ${(new Date).getTime()}
ID:           ${input.commandId}
----------------------------------------------------
${input.customString}
====================================================`;
            break;
        case 'Update':
            output = `
====================================================
${input.event}
----------------------------------------------------
Command name: ${input.commandName}
Date:         ${(new Date).toISOString()}
Date (epoch): ${(new Date).getTime()}
ID:           ${input.commandId}
----------------------------------------------------
${input.customString}
====================================================`;
            break;
        case 'Success':
            output = `
====================================================
${input.event}
----------------------------------------------------
Command name: ${input.commandName}
Date:         ${(new Date).toISOString()}
Date (epoch): ${(new Date).getTime()}
ID:           ${input.commandId}
====================================================`;
            break;
    }
    if (input.config.storeCommandLogs) {
        fs.appendFileSync(`${path}/logs/${input?.object?.guildId ? 'cmd/' + input?.object?.guildId + '.log' : 'commands.log'}`, output, 'utf-8');
    }
}
// commandLog,
// optsLog,

export function toOutput(string: string, config: extypes.config,) {
    if (config.LogApiCalls == true) {
        console.log(string);
    }
    if (config.LogApiCallsToFile == true) {
        fs.appendFileSync(`${path}/logs/console.log`, `${string}\n`);
    }
    return;
}

export {
    errLog,
    logFile
};

