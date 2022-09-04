import fs = require('fs');
import checks = require('./src/checks');
import extypes = require('./src/types/extratypes');
import defaults = require('./src/consts/defaults');
import Discord = require('discord.js');

module.exports = (userdata, client, config, oncooldown) => {
    let timeouttime;

    client.on('messageCreate', async (message) => {
        const currentDate = new Date();
        const absoluteID = currentDate.getTime();

        if (message.author.bot && !message.author.id == client.user.id) return;

        const currentGuildId = message.guildId
        let settings: extypes.guildSettings;
        try {
            const settingsfile = fs.readFileSync(`./configs/guilds/${currentGuildId}.json`, 'utf-8')
            settings = JSON.parse(settingsfile);
        } catch (error) {
            fs.writeFileSync(`./configs/guilds/${currentGuildId}.json`, JSON.stringify(defaults.defaultGuildSettings, null, 2), 'utf-8')
            settings = defaults.defaultGuildSettings;
        }

        if (!(message.content.startsWith(config.prefix) || message.content.startsWith(settings.prefix))) return; //the return is so if its just prefix nothing happens
        
        if (!oncooldown.has(message.author.id)) {
            timeouttime = new Date().getTime() + 3000
        }
        if (oncooldown.has(message.author.id)) {
            setTimeout(() => {
                message.delete()
                    .catch()
            }, 3000)
        }
        if (oncooldown.has(message.author.id)) {
            message.reply({
                content: `You're on cooldown!\nTry again in ${getTimeLeft(timeouttime) / 1000}s`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true,
                ephemeral: true
            });
            return;
        }
        if (!oncooldown.has(message.author.id)) {
            oncooldown.add(message.author.id);
            setTimeout(() => {
                oncooldown.delete(message.author.id)
            }, 3000)
        }
        function getTimeLeft(timeout) {
            return (timeout - new Date().getTime());
        }

        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        const interaction = null;
        const button = null;
        const obj = message;
        const overrides = null;
    })

    function execCommand(command, commandtype, object) {

        return;
    }
}


