import fs = require('fs');
const https = require('https');
import tesseract = require('tesseract.js');
import extypes = require('./src/types/extratypes');
import defaults = require('./src/consts/defaults');
import Discord = require('discord.js');

module.exports = (userdata, client, commandStruct, config, oncooldown) => {
    let imgParseCooldown = false;

    client.on('messageCreate', async (message) => {

        const currentGuildId = message.guildId
        let settings: extypes.guildSettings;
        try {
            const settingsfile = fs.readFileSync(`./config/guilds/${currentGuildId}.json`, 'utf-8')
            settings = JSON.parse(settingsfile)
        } catch (error) {
            fs.writeFileSync(`./config/guilds/${currentGuildId}.json`, JSON.stringify(defaults.defaultGuildSettings, null, 2), 'utf-8')
            settings = defaults.defaultGuildSettings
        }

    });
}