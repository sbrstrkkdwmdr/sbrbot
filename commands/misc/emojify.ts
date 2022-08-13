import fs = require('fs');
import emojisarr = require('../../configs/emojiarray')
module.exports = {
    name: 'emojify',
    description: 'Emojify a string',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        if (args.length < 1) {
            message.reply({ content: 'Please provide a string to emojify.', allowedMentions: { repliedUser: false } })
                .catch(error => { });

            return;
        }
        let emojified = '';
        for (let i = 0; i < args.length; i++) {
            emojified += args[i];
            if (i < args.length - 1) {
                let rdm = Math.floor(Math.random() * emojisarr.emojiarray.length - 1) + 1;
                //console.log(rdm);
                if (emojisarr.emojiarray[rdm] == null || emojisarr.emojiarray[rdm].length < 1) {
                    console.log('nullchar')
                }
                emojified += `${emojisarr.emojiarray[rdm]}` + ' ';
            }
        }
        message.reply({ content: emojified, allowedMentions: { repliedUser: false } })
            .catch(error => { });

    }
}