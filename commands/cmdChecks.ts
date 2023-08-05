import * as Discord from 'discord.js';
import * as fs from 'fs';
import * as replayparser from 'osureplayparser';
import pkgjson from '../package.json' assert { type: 'json' };
import * as calc from '../src/calc.js';
import * as cmdchecks from '../src/checks.js';
import * as colourfunc from '../src/colourcalc.js';
import * as buttonsthing from '../src/consts/buttons.js';
import * as colours from '../src/consts/colours.js';
import * as def from '../src/consts/defaults.js';
import * as emojis from '../src/consts/emojis.js';
import * as helpinfo from '../src/consts/helpinfo.js';
import * as mainconst from '../src/consts/main.js';
import * as embedStuff from '../src/embed.js';
import * as func from '../src/func.js';
import * as log from '../src/log.js';
import * as osufunc from '../src/osufunc.js';
import * as osumodcalc from '../src/osumodcalc.js';
import * as extypes from '../src/types/extratypes.js';
import * as osuApiTypes from '../src/types/osuApiTypes.js';
import * as msgfunc from './msgfunc.js';

export function name(input: extypes.commandInput) {
}

/**
 * if no permissions
 */
export function noperms(commandType, obj, type: 'bot' | 'user', canReply, missing: string) {


    switch (type) {
        case 'user': {
            switch (commandType) {
                //==============================================================================================================================================================================================
                case 'interaction': case 'message': {
                    msgfunc.sendMessage({
                        commandType: commandType,
                        obj: obj,
                        args: {
                            content: 'You do not have permission to use this command.' + `\nMissing permissions: ${missing}`
                        }
                    }, canReply);
                }

            }
        }
            break;
        case 'bot': {
            msgfunc.sendMessage({
                commandType: commandType,
                obj: obj,
                args: {
                    content: 'I am missing permissions to use this command.' + `\nMissing permissions: ${missing}`
                }
            }, canReply);
        }
    }

}

export function outdated(commandType, obj, type: 'command', commandVer: string) {
    const findcommand = mainconst.versions.find(x =>
        x.name == commandVer ||
        x.releaseDate.toString() == commandVer ||
        x.releaseDateFormatted == commandVer
    ) ?? false;

    const content =
        `This command is disabled and cannot be used.
Bot version: ${mainconst.version} (${mainconst.versionAlt})
Command version: ${findcommand ? `${findcommand.releaseDate} (${findcommand.name})` : 'INVALID'}
`;
    switch (type) {
        case 'command': {
            switch (commandType) {
                case 'button':
                    obj.reply({
                        content: content,
                        ephemeral: true,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                    break;
            }
        }
            break;
    }
}

export function disabled(commandType, obj, type: 'command') {
    switch (type) {
        case 'command': {
            switch (commandType) {
                case 'message': case 'link':
                    obj.reply({
                        content: 'This command is disabled and cannot be used.',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                    break;
                case 'button': case 'interaction':
                    obj.reply({
                        content: 'This command is disabled and cannot be used.',
                        ephemeral: true,
                        allowedMentions: { repliedUser: false },
                    })
                        .catch();
                    break;
            }
        }
            break;
    }
}