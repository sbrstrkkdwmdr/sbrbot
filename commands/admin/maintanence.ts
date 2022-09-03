// import cmdchecks = require('../../calc/commandchecks');
// import fs = require('fs');
// import colours = require('../../configs/colours');
// import calc = require('../../calc/calculations');
// import emojis = require('../../configs/emojis');

// module.exports = {
//     name: 'COMMANDNAME',
//     execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
//         let commanduser;
//         let baseCommandType;
//         if (message != null && interaction == null && button == null) {
//             commanduser = message.author;
//             baseCommandType = 'message';
//         }

//         //==============================================================================================================================================================================================

//         if (interaction != null && button == null && message == null) {
//             commanduser = interaction.member.user;
//             baseCommandType = 'interaction';
//         }

//         //==============================================================================================================================================================================================

//         if (button != null) {
//             commanduser = interaction.member.user;
//             baseCommandType = 'button';
//         }
//         fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
//             `
// ----------------------------------------------------
// COMMAND EVENT - COMMANDNAME (${baseCommandType})
// ${currentDate} | ${currentDateISO}
// recieved COMMANDNAME command
// requested by ${commanduser.id} AKA ${commanduser.tag}
// cmd ID: ${absoluteID}
// ----------------------------------------------------
// `, 'utf-8')

//         //OPTIONS==============================================================================================================================================================================================
//         /*         fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
//                     `
//         ----------------------------------------------------
//         ID: ${absoluteID}
        
//         ----------------------------------------------------
//         `, 'utf-8') */
//         //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

//         if (cmdchecks.isOwner(commanduser.id) == false) {
//             if ((message != null || interaction != null) && button == null) {
//                 obj.reply({
//                     content: 'You do not have permission to use this command.',
//                     allowedMentions: { repliedUser: false },
//                     failIfNotExists: false
//                 }).catch()
//             }
//         } else {
//             let curVal = fs.readFileSync('config/maintanence.txt', 'utf-8');
//             if (curVal == 'true') {
//                 fs.writeFileSync('config/maintanence.txt', 'false');
//                 obj.reply({
//                     content: 'Disabled maintanence mode.',
//                     allowedMentions: { repliedUser: false },
//                     failIfNotExists: false
//                 }).catch()
//             } else {
//                 fs.writeFileSync('config/maintanence.txt', 'true');
//                 obj.reply({
//                     content: 'Disabled maintanence mode.',
//                     allowedMentions: { repliedUser: false },
//                     failIfNotExists: false
//                 }).catch()
//             }
//         }

//         //SEND/EDIT MSG==============================================================================================================================================================================================

//         if (message != null && interaction == null && button == null) {
//             message.reply({
//                 content: '',
//                 embeds: [],
//                 files: [],
//                 allowedMentions: { repliedUser: false },
//                 failIfNotExists: true
//             })
//                 .catch(error => { });

//         }
//         if (interaction != null && button == null && message == null) {
//             interaction.reply({
//                 content: '',
//                 embeds: [],
//                 files: [],
//                 allowedMentions: { repliedUser: false },
//                 failIfNotExists: true
//             })
//                 .catch(error => { });

//         }
//         if (button != null) {
//             message.edit({
//                 content: '',
//                 embeds: [],
//                 files: [],
//                 allowedMentions: { repliedUser: false },
//                 failIfNotExists: true
//             })
//                 .catch(error => { });

//         }


//         fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
//             `
// ----------------------------------------------------
// success
// ID: ${absoluteID}
// ----------------------------------------------------
// \n\n`, 'utf-8')
//     }
// }