import Discord from 'discord.js';
import fs from 'fs';
import moment from 'moment';
import util from 'util';
import * as helper from '../helper.js';
export function out(text: string, path: string, fileOnly?: boolean) {
    text = appendTime(text);
    if (helper.vars.config.logs.file) {
        fs.appendFileSync(path, text + '\n');
    }
    if (helper.vars.config.logs.console && fileOnly != true) {
        console.log(text);
    }
}

function appendTime(str: string) {
    const rn = moment().utc();
    const time = '[' + rn.format("YYYY-MM-DD HH:mm:ss") + '] ';
    let out = '';
    if (str.includes('\n')) {
        const split = str.split('\n').map(x =>
            time + x);
        out = split.join('\n');
    } else {
        out = time + str;
    }
    return out;
}

// use this as you would with console.log()
export function stdout(message?: any, ...optionalParams: any[]) {
    const text = optionalParams ? util.format(message) : util.format(message, optionalParams ?? null);
    out(text, `${helper.vars.path.logs}/console.log`);
}

export function commandOptions(
    opts: { name: string, value: any; }[], id: string | number,
    name: string, type: string,
    user: Discord.User | Discord.APIUser,
    message?: Discord.Message<any>,
    interaction?: Discord.Interaction
) {
    let txt: string =
        `====================================================
Command
----------------------------------------------------
Command name: ${name}
Command Type: ${type}
Date:         ${(new Date).toISOString()}
Date (epoch): ${(new Date).getTime()}
ID:           ${id}
Requested by: ${user?.username} (${user?.id})
Guild ID:     ${message?.guildId ?? interaction?.guildId}
Channel ID:   ${message?.channelId ?? interaction?.channelId}`;
    if (opts.length > 0) {
        txt += '\n----------------------------------------------------';
        const padding = opts.slice().map(x => x.name.length).sort((a, b) => b - a)[0];
        opts.forEach(opt => {
            txt += `\n${(opt.name + ':').padEnd(padding, ' ')}${opt.value}`;
        });
    }
    txt += '\n====================================================';
    out(txt,
        `${helper.vars.path.logs}/${(message?.guildId ?? interaction?.guildId) ? 'cmd/' + (message?.guildId ?? interaction?.guildId) + '.log' : 'commands.log'}`, true);
}

export function commandErr(input: string, id: string | number,
    name: string, message: Discord.Message<any>, interaction: Discord.Interaction
) {

    const output = `
====================================================
ERROR
----------------------------------------------------
Command name: ${name}
Date:         ${(new Date).toISOString()}
Date (epoch): ${(new Date).getTime()}
ID:           ${id}
----------------------------------------------------
${input}
====================================================`;
    out(output, `${helper.vars.path.logs}/${(message?.guildId ?? interaction?.guildId) ? 'cmd/' + (message?.guildId ?? interaction?.guildId) + '.log' : 'commands.log'}`, true);
}

/**
 * converts an object into a simple array that can be used in commandOptions()
 */
export function objectLoggable(input: object) {
    return Object.entries(input).map(x => {
        return {
            name: x[0],
            value: x[1]
        };
    });
}
