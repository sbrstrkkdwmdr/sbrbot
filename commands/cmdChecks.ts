import * as mainconst from '../src/consts/main.js';
import * as msgfunc from './msgfunc.js';

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