import * as Discord from 'discord.js';
import fs from 'fs';
import * as msgfunc from '../../commands/msgfunc.js';
import * as calc from '../../src/calc.js';
import * as cmdchecks from '../../src/checks.js';
import * as colourfunc from '../../src/colourcalc.js';
import * as buttonsthing from '../../src/consts/buttons.js';
import * as colours from '../../src/consts/colours.js';
import * as def from '../../src/consts/defaults.js';
import * as emojis from '../../src/consts/emojis.js';
import * as log from '../../src/log.js';
import * as osufunc from '../../src/osufunc.js';
import * as extypes from '../../src/types/extratypes.js';
import * as osuApiTypes from '../../src/types/osuApiTypes.js';
import * as mainconst from '../consts/main.js';
import * as func from '../func.js';
import * as osumodcalc from '../osumodcalc.js';


module.exports = {
    name: 'COMMANDNAME',
    async execute(input: {
        commandType: extypes.commandType,
        obj: extypes.commandObject,
        args: string[],
        button: string,
        config: extypes.config,
        client: Discord.Client,
        absoluteID: number,
        currentDate: Date,
        overrides: extypes.overrides,
        userdata: extypes.data,
        canReply: boolean;
    }) {
        let commanduser: Discord.User;


        switch (input.commandType) {
            case 'message': {
                input.obj = (input.obj as Discord.Message<any>);
                commanduser = input.obj.author;
            }
                break;
            //==============================================================================================================================================================================================
            case 'interaction': {
                input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
                commanduser = input.obj.member.user;
            }
                //==============================================================================================================================================================================================

                break;
            case 'button': {
                input.obj = (input.obj as Discord.ButtonInteraction<any>);
                commanduser = input.obj.member.user;
            }
                break;
            case 'link': {
                input.obj = (input.obj as Discord.Message<any>);
                commanduser = input.obj.author;
            }
                break;
        }
        if (input.overrides != null) {

        }
        //==============================================================================================================================================================================================

        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${mainconst.version}-BigLeftArrow-COMMANDNAME-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.first),
                new Discord.ButtonBuilder()
                    .setCustomId(`${mainconst.version}-LeftArrow-COMMANDNAME-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.previous),
                new Discord.ButtonBuilder()
                    .setCustomId(`${mainconst.version}-RightArrow-COMMANDNAME-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.next),
                new Discord.ButtonBuilder()
                    .setCustomId(`${mainconst.version}-BigRightArrow-COMMANDNAME-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.last),
            );
        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${mainconst.version}-Refresh-COMMANDNAME-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.main.refresh),
            );

        log.logCommand({
            event: 'Command',
            commandType: input.commandType,
            commandId: input.absoluteID,
            commanduser,
            object: input.obj,
            commandName: 'COMMANDNAME',
            options: [],
            config: input.config,
        });

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================



        //SEND/EDIT MSG==============================================================================================================================================================================================
        const finalMessage = await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
            }
        }, input.canReply);

        if (finalMessage == true) {
            log.logCommand({
                event: 'Success',
                commandName: 'COMMANDNAME',
                commandType: input.commandType,
                commandId: input.absoluteID,
                object: input.obj,
                config: input.config,
            });
        } else {
            log.logCommand({
                event: 'Error',
                commandName: 'COMMANDNAME',
                commandType: input.commandType,
                commandId: input.absoluteID,
                object: input.obj,
                customString: 'Message failed to send',
                config: input.config,
            });
        }
    }
};