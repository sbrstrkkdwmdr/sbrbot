const Discord = require('discord.js'); 

const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    ] });

client.once('ready', () => {
    let currentDate = new Date();
    let currentDateISO = new Date().toISOString();
    console.group('--- BOT IS NOW ONLINE ---')
    console.log(`${currentDateISO} | ${currentDate}`)
    console.log(`API Latency is ${Math.round(client.ws.ping)}ms`);
    console.log("")
    console.groupEnd()

client.user.setPresence({ activities: [{ name: "you", type: 'WATCHING', video_url: 'https://youtube.com/saberstrkkdwmdr'}], status: `dnd`,});
})

client.on('messageCreate', message =>{

    const messagedetect = message.content
    const messageattachementdetect = message.attachments
    const msgguild = message.channel.guild
    const msgguildid = message.channel.guildId
    const msgchannelid = message.channelId
    const msgchannel = message.channel.name

    //const owner = require('./botowners.json');

    let consoleloguserweeee = message.author
    let currentDate = new Date();
    let currentDateISO = new Date().toISOString();

    if(message.content || message.attachments.size > 0 || message.embeds){
        console.group(`MESSAGE SENT IN guild: ${msgguild} channel: ${msgchannelid}`)
        console.log(`GUILD "${msgguild}"| ${msgguildid}`)
        console.log(`CHANNEL "#${msgchannel}" | ${msgchannelid}`)
        console.log(`${currentDate} | ${currentDateISO}`)
        if(message.author.bot){
            console.log("[BOT]")
        }
        console.group(`${consoleloguserweeee.tag} | ${consoleloguserweeee}`)
        console.log(`${messagedetect}`)
        if(message.attachments.size > 0){
        console.log(messageattachementdetect)}
        if(message.embeds){
            console.log(message.embeds)
        }
        console.log('')
        console.groupEnd()
        console.groupEnd()
    }
    /*if (message.attachments.size > 0) {
        console.group(`MESSAGE SENT IN guild: ${msgguild} channel: ${msgchannelid}`)
        console.log(`GUILD "${msgguild}"| ${msgguildid}`)
        console.log(`CHANNEL "#${msgchannel}" | ${msgchannelid}`)
        console.log(`${currentDate} | ${currentDateISO}`)
        console.group(`${consoleloguserweeee.tag} | ${consoleloguserweeee}`)
        console.log(messageattachementdetect)
        console.log('')
        console.groupEnd()
        console.groupEnd()
    }*/


});

try{
client.login(token)
} //turns on the bot
catch (error) {
    console.group("--- DEBUG ---")
    console.log("login error")
    console.log(error)
    console.groupEnd()
}