import * as log from '../src/log.js';
import * as extypes from '../src/types/extraTypes.js';
import Discord = require('discord.js');
import fs = require('fs');

export async function sendMessage(input: {
    commandType: extypes.commandType,
    obj: extypes.commandObject,
    args: {
        content?: string,
        embeds?: Discord.EmbedBuilder[] | Discord.Embed[],
        files?: string[],
        components?: Discord.ActionRowBuilder[] | Discord.ActionRowComponent[],
        ephemeral?: boolean,
        react?: boolean,
        edit?: boolean,
    };
}) {
    try {
        if (input.args.react == true) {
            switch (input.commandType) {
                case 'message': {
                    //@ts-expect-error aaaaaaaaa
                    //This expression is not callable.
                    //Each member of the union type '((options: string | MessagePayload | MessageReplyOptions) => Promise<Message<any>>) | { (options: InteractionReplyOptions & { ...; }): Promise<...>; (options: string | ... 1 more ... | InteractionReplyOptions): Promise<...>; } | { ...; }' has signatures, but none of those signatures are compatible with each other.ts(2349)
                    input.obj.react('✅')
                        .catch();
                }
                    break;

                //==============================================================================================================================================================================================

                case 'interaction': {
                    //@ts-expect-error wwwwwwww
                    //This expression is not callable.
                    //Each member of the union type '((options: string | MessagePayload | MessageReplyOptions) => Promise<Message<any>>) | { (options: InteractionReplyOptions & { ...; }): Promise<...>; (options: string | ... 1 more ... | InteractionReplyOptions): Promise<...>; } | { ...; }' has signatures, but none of those signatures are compatible with each other.ts(2349)
                    input.obj.reply({
                        content: '✅',
                        ephemeral: true,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                }

                    //==============================================================================================================================================================================================

                    break;
                case 'button': {
                    //@ts-expect-error property 'message' does not exist on 'Message<any>'
                    input.obj.message.react('✅')
                        .catch();
                }
                    break;
            }
        } else {
            switch (input.commandType) {
                case 'message': case 'link': {
                    //@ts-expect-error aaaaaaaaaaa
                    //This expression is not callable.
                    //Each member of the union type '((options: string | MessagePayload | MessageReplyOptions) => Promise<Message<any>>) | { (options: InteractionReplyOptions & { ...; }): Promise<...>; (options: string | ... 1 more ... | InteractionReplyOptions): Promise<...>; } | { ...; }' has signatures, but none of those signatures are compatible with each other.ts(2349)
                    input.obj.reply({
                        content: `${input.args.content ?? ''}`,
                        embeds: input.args.embeds ?? [],
                        files: input.args.files ?? [],
                        components: input.args.components ?? [],
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                }
                    break;

                //==============================================================================================================================================================================================

                case 'interaction': {
                    if (input.args.edit == true) {
                        setTimeout(() => {
                            //@ts-expect-error property 'editReply' does not exist on 'Message<any>'
                            input.obj.editReply({
                                content: `${input.args.content ?? ''}`,
                                embeds: input.args.embeds ?? [],
                                files: input.args.files ?? [],
                                components: input.args.components ?? [],
                                allowedMentions: { repliedUser: false },
                                failIfNotExists: true,
                                ephemeral: input.args.ephemeral ?? false
                            })
                                .catch();
                        }, 1000);
                    } else {
                        //@ts-expect-error aaaaaaa
                        //This expression is not callable.
                        //Each member of the union type '((options: string | MessagePayload | MessageReplyOptions) => Promise<Message<any>>) | { (options: InteractionReplyOptions & { ...; }): Promise<...>; (options: string | ... 1 more ... | InteractionReplyOptions): Promise<...>; } | { ...; }' has signatures, but none of those signatures are compatible with each other.ts(2349)
                        input.obj.reply({
                            content: `${input.args.content ?? ''}`,
                            embeds: input.args.embeds ?? [],
                            files: input.args.files ?? [],
                            components: input.args.components ?? [],
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true,
                            ephemeral: input.args.ephemeral ?? false
                        })
                            .catch();
                    }
                }

                    //==============================================================================================================================================================================================

                    break;
                case 'button': {
                    //@ts-expect-error property 'message' does not exist on 'Message<any>'
                    input.obj.message.edit({
                        content: `${input.args.content ?? ''}`,
                        embeds: input.args.embeds ?? [],
                        files: input.args.files ?? [],
                        components: input.args.components ?? [],
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                }
                    break;
            }
        }
    } catch (error) {
        log.errLog('message error', error);
        return error;
    }
    return true;

}

export async function SendFileToChannel(channel: Discord.GuildTextBasedChannel, filePath: string) {
    let url = 'https://cdn.discordapp.com/attachments/762455063922737174/1039051414082691112/image.png';
    await new Promise(async (resolve, reject) => {

        if (!filePath.includes('/') || typeof channel == 'undefined' || !fs.existsSync(filePath)) {
            reject('invalid/null path');
        }

        channel.send({
            files: [filePath]
        }).then(message => {
            const attachment = filePath.split('/')[filePath.split('/').length - 1];
            url = message.attachments.at(0).url;
            resolve(1);
        });
    });
    return url;
}