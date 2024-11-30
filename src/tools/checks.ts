import * as Discord from 'discord.js';
import * as fs from 'fs';
import * as helper from '../helper.js';
import * as path from '../path.js';
import * as bottypes from '../types/bot.js';

export function checkConfig() {
    const config = JSON.parse(fs.readFileSync(path.precomp + '/config/config.json', 'utf-8'));
    if (!config.hasOwnProperty("token")) {
        throw new Error('missing `token` value in config');
    }
    if (config.hasOwnProperty("osu")) {
        if (!config["osu"].hasOwnProperty("clientId") && typeof config["important"]["clientId"] != "string") {
            helper.tools.log.stdout("Property `osu.clientId` is invalid or an incorrect type");
            helper.tools.log.stdout("The bot cannot run without this property");
            process.exit(0);
        }
        if (!config["osu"].hasOwnProperty("clientSecret") && typeof config["important"]["clientSecret"] != "string") {
            helper.tools.log.stdout("Property `osu.clientSecret` is invalid or an incorrect type");
            helper.tools.log.stdout("The bot cannot run without this property");
            process.exit(0);
        }

    } else {
        throw new Error('missing `osu` value in config');
    }
    if (!config.hasOwnProperty("prefix") || typeof config["prefix"] != "string") {
        helper.tools.log.stdout("Prefix value is either missing or an invalid type\nThe default value of `sbr-` will be used");
        config['prefix'] = 'sbr-';
    }
    if (!config.hasOwnProperty("owners")) {
        helper.tools.log.stdout("owners value is either missing or an invalid type\nThe default value of `['INVALID_ID']` will be used");
        config['owners'] = ['INVALID_ID'];
    }
    if (!config.hasOwnProperty("tenorKey") || typeof config["tenorKey"] != "string") {
        config['tenorKey'] = 'INVALID_ID';
        helper.tools.log.stdout("tenorKey value is either missing or an invalid type\nThe default value of `['INVALID_ID']` will be used");
    }
    if (!config.hasOwnProperty("enableTracking") || typeof config["enableTracking"] != "boolean") {
        helper.tools.log.stdout("enableTracking value is either missing or an invalid type\nThe default value of `false` will be used");
        config['enableTracking'] = false;
    }
    if (config.hasOwnProperty("logs")) {
        if (!config["logs"].hasOwnProperty("console") || typeof config["logs"]["console"] != "boolean") {
            helper.tools.log.stdout("logs.console value is either missing or an invalid type\nThe default value of `true` will be used");
            config['logs']['console'] = false;

        }
        if (!config["logs"].hasOwnProperty("file") || typeof config["logs"]["file"] != "boolean") {
            helper.tools.log.stdout("logs.file value is either missing or an invalid type\nThe default value of `true` will be used");
            config['logs']['file'] = false;

        }
    } else {
        helper.tools.log.stdout("Missing log options. Using default values {console:true,file:true}");
        config['logs'] = {
            console: true,
            file: true
        };

    }
    return config as bottypes.config;
}

/**
 * 
 * @param {number} userid 
 * @returns true if the user is an owner
 */
export function isOwner(userid: string | number,) {
    for (let i = 0; i < helper.vars.config.owners.length; i++) {
        if (`${helper.vars.config.owners[i]}` == `${userid}`) {
            return true;
        }
    }
    return false;
}

/**
 * @param userid user ID
 * @param guildid ID of the current guild
 * @param client client object
 * @returns true if user is admin in the current guild
 */
export function isAdmin(userid: string | number, guildid: string | number,) {
    try {
        if (helper.vars.client.guilds.cache.has(`${guildid}`)) {
            const curguild = helper.vars.client.guilds.cache.get(`${guildid}`);
            const curmem = curguild?.members?.cache?.has(`${userid}`) ? curguild?.members?.cache?.get(`${userid}`) : null;
            if (curmem != null) {
                if (curmem.permissions.toArray().includes('Administrator')) {
                    return true;
                }
            }
        }
    } catch (error) {
        return false;
    }
    return false;
}

/**
 * 
 * @param object message/interaction called
 * @param client bot client
 */
export function botHasPerms(object: Discord.Interaction | Discord.Message, requiredPerms: Discord.PermissionsString[]) {
    const guild = helper.vars.client.guilds.cache.get(object.guildId);
    const botmember = guild?.members?.cache?.get(helper.vars.client.user.id);
    if (!botmember) return false;
    const botperms = botmember.permissions.toArray();
    //if all of the elements in requiredPerms are in botperms return true
    const len = requiredPerms.length;
    let newLen = 0;
    for (const i in requiredPerms) {
        if (botperms.includes(requiredPerms[i])) {
            newLen++;
        }
    }
    const channel = helper.vars.client.channels.cache.get(object.channelId) as Discord.TextChannel | Discord.ThreadChannel;
    const botchannelperms = channel.permissionsFor(helper.vars.client.user.id).toArray();
    let channelPermLen = 0;
    for (const i in requiredPerms) {
        if (botchannelperms.includes(requiredPerms[i])) {
            channelPermLen++;
        }
    }

    return newLen == len && channelPermLen == len ? true : false;
}

/**
 * 
 * @param str input string
 * @returns a string with special characters converted to versions that won't break URLs
 */
export function toHexadecimal(str: string | number) {
    const newstr = `${str}`
        .replaceAll('%', '%25')
        .replaceAll('`', '%60')
        .replaceAll('~', '%7E')
        .replaceAll('!', '%21')
        .replaceAll('@', '%40')
        .replaceAll('#', '%23')
        .replaceAll('$', '%24')
        .replaceAll('^', '%5E')
        .replaceAll('&', '%26')
        .replaceAll('*', '%2A')
        .replaceAll('(', '%28')
        .replaceAll(')', '%29')
        .replaceAll('-', '%2D')
        .replaceAll('_', '%5F')
        .replaceAll('=', '%3D')
        .replaceAll('+', '%2B')
        .replaceAll('[', '%5B')
        .replaceAll(']', '%5D')
        .replaceAll('{', '%7B')
        .replaceAll('}', '%7D')
        .replaceAll('|', '%7C')
        .replaceAll('\\', '%5C')
        .replaceAll(':', '%3A')
        .replaceAll(';', '%3B')
        .replaceAll('\'', '%27')
        .replaceAll('"', '%22')
        .replaceAll(',', '%2C')
        .replaceAll('.', '%2E')
        .replaceAll('<', '%3C')
        .replaceAll('>', '%3E')
        .replaceAll('?', '%3F')
        .replaceAll('/', '%2F')
        .replaceAll(' ', '%20')
        .replace(/([^A-Za-z0-9 %])/g, '');
    return newstr;
}