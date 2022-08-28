import fs = require('fs');
import { ApplicationCommandOptionType, InteractionType } from 'discord.js';
module.exports = (userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {
    client.on('interactionCreate', interaction => {
        if (interaction.type != InteractionType.MessageComponent) return;
        if (interaction.applicationId != client.application.id) return;
        //console.log('received')
        //console.log(interaction.message.id)
        //console.log(interaction.customId)

        const currentDate = new Date();
        const currentDateISO = new Date().toISOString();
        const absoluteID = currentDate.getTime();

        const args = null;
        const message = interaction.message;
        const obj = interaction;

        const command = interaction.customId.split('-')[1]
        const button = interaction.customId.split('-')[0]
        const specid = interaction.customId.split('-')[2]
        if (specid && specid != interaction.user.id) {
            interaction.deferUpdate();
            return;
        }
        switch (command) {
            /*             case 'test':
                            if (button == 'BigLeftArrow') {
                                //message.edit({content: 'Left'})
                                client.tstcmds.get('testcmd').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button);
                            }
                            if (button == 'LeftArrow') {
                                message.edit({ content: 'LeftS' })
                                client.tstcmds.get('testcmd').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button);
                            }
                            if (button == 'BigRightArrow') {
                                //message.edit({content: 'Right'})
                                client.tstcmds.get('testcmd').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button);
                            }
                            if (button == 'RightArrow') {
                                //message.edit({content: 'RightS'})
                                client.tstcmds.get('testcmd').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button);
                            }
                            if (button == 'Middle') {
                                //message.edit({content: 'Middle'})
                                client.tstcmds.get('testcmd').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button);
                            }
                            interaction.reply({ content: '👍' }).then(
                                setTimeout(() => interaction.deleteReply(), 100)
                            )
                            break; */
            case 'leaderboard':
                client.osucmds.get('leaderboard').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                interaction.deferUpdate();
                break;
            case 'osutop':
                client.osucmds.get('osutop').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                interaction.deferUpdate();
                break;
            case 'rs':
                client.osucmds.get('rs').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                interaction.deferUpdate();
                break;
            case 'lb':
                client.osucmds.get('lb').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                interaction.deferUpdate();
                break;
            case 'firsts':
                client.osucmds.get('firsts').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                interaction.deferUpdate();
                break;
            case 'pinned':
                client.osucmds.get('pinned').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                interaction.deferUpdate();
                break;
            case 'scores':
                client.osucmds.get('scores').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                interaction.deferUpdate();
                break;
            case 'map':
                client.osucmds.get('map').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                interaction.deferUpdate();
                break;
            case 'osumaplink':
                client.links.get('osumaplink').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                interaction.deferUpdate();
                break;
            case 'osu':
                client.osucmds.get('osu').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                interaction.deferUpdate();
                break;
            case 'test':
                client.commands.get('test').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                interaction.deferUpdate();
                break;

        }
        fs.appendFileSync('logs/totalcommands.txt', 'x')



    })


}