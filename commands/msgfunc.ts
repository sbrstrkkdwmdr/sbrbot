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
        components?: Discord.ActionRowBuilder<any>[],
        ephemeral?: boolean,
        react?: boolean,
        edit?: boolean,
    };
},
    canReply: boolean
) {
    try {
        if (input.args.react == true) {
            switch (input.commandType) {
                case 'message': {
                    (input.obj as Discord.Message<any>).react('✅')
                        .catch();
                }
                    break;

                //==============================================================================================================================================================================================

                case 'interaction': {
                    (input.obj as Discord.CommandInteraction).reply({
                        content: '✅',
                        ephemeral: true,
                        allowedMentions: { repliedUser: false },
                    })
                        .catch();
                }

                    //==============================================================================================================================================================================================

                    break;
                case 'button': {
                    (input.obj as Discord.ButtonInteraction).message.react('✅')
                        .catch();
                }
                    break;
            }
        } else {
            switch (input.commandType) {
                case 'message': case 'link': {
                    if (!canReply) {
                        (input.obj as Discord.Message<any>).channel.send({
                            content: `${input.args.content ?? ''}`,
                            embeds: input.args.embeds ?? [],
                            files: input.args.files ?? [],
                            components: input.args.components ?? [],
                        })
                            .catch(x => console.log(x));
                    } else {
                        (input.obj as Discord.Message<any>).reply({
                            content: `${input.args.content ?? ''}`,
                            embeds: input.args.embeds ?? [],
                            files: input.args.files ?? [],
                            components: input.args.components ?? [],
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        })
                            .catch(err => {
                                sendMessage(input, false)
                            });
                    }
                }
                    break;

                //==============================================================================================================================================================================================

                case 'interaction': {
                    if (input.args.edit == true) {
                        setTimeout(() => {
                            (input.obj as Discord.CommandInteraction<any>).editReply({
                                content: `${input.args.content ?? ''}`,
                                embeds: input.args.embeds ?? [],
                                files: input.args.files ?? [],
                                components: input.args.components ?? [],
                                allowedMentions: { repliedUser: false },
                            })
                                .catch();
                        }, 1000);
                    } else {
                        (input.obj as Discord.CommandInteraction<any>).reply({
                            content: `${input.args.content ?? ''}`,
                            embeds: input.args.embeds ?? [],
                            files: input.args.files ?? [],
                            components: input.args.components ?? [],
                            allowedMentions: { repliedUser: false },
                            ephemeral: input.args.ephemeral ?? false
                        })
                            .catch();
                    }
                }

                    //==============================================================================================================================================================================================

                    break;
                case 'button': {
                    (input.obj as Discord.ButtonInteraction).message.edit({
                        content: `${input.args.content ?? ''}`,
                        embeds: input.args.embeds ?? [],
                        files: input.args.files ?? [],
                        components: input.args.components ?? [],
                        allowedMentions: { repliedUser: false },
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