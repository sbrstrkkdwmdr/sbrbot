import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
module.exports = {
    name: 'roll',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let roll: any;
        let maxnum: any;
        let minnum: any;
        if (message != null && interaction == null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - roll (message)
${currentDate} | ${currentDateISO}
recieved roll command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            maxnum = parseFloat(args[0]);
            if (!args[0]) {
                maxnum = 100;
            }
            minnum = parseFloat(args[1]);
            if (!args[1]) {
                minnum = 0;
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - roll (interaction)
${currentDate} | ${currentDateISO}
recieved roll command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            maxnum = interaction.options.getNumber('max');
            minnum = interaction.options.getNumber('min');
            if(maxnum == null){
                maxnum = 100;
            }
            if(minnum == null){
                minnum = 0;
            }
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - roll (interaction)
${currentDate} | ${currentDateISO}
recieved roll command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        }
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}
maxnum: ${maxnum}
minnum: ${minnum}
----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        let limitlen = maxnum.toString().length - 2;
        if(limitlen < 0){
            limitlen = 0;
        }
        if(maxnum == 100){
            limitlen = 0;
        }
        roll = `${((Math.random() * (maxnum - minnum + 1)) + minnum).toFixed(limitlen)}`;

        //SEND/EDIT MSG==============================================================================================================================================================================================

        obj.reply({
            content: `${roll}`,
            allowedMentions: { repliedUser: false },
            failIfNotExits: true
        })
        if (button != null) {
            message.edit({
                content: '',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });

        }


        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}