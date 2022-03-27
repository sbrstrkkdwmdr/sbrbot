const { loggingchannel } = require('./config.json');
const fs = require('fs');
module.exports = (userdatatags, client, Discord, osuauthtoken, osuapikey, osuclientid, osuclientsecret, trnkey, ytdl, monitorEventLoopDelay, setInterval) => {
    let logchannel = client.channels.cache.get(loggingchannel)
    client.eventstuff = new Discord.Collection();
    const eventstufffiles = fs.readdirSync('./event-stuff/').filter(file => file.endsWith('.js'));        
    for(const file of eventstufffiles){
        const eventthing = require(`./event-stuff/${file}`);
    
        client.eventstuff.set(eventthing.name, eventthing);
    }

    client.on('messageCreate', message => {
    let currentDate = new Date();
    let currentDateISO = new Date().toISOString();
    const linkargs = message.content.split(/ +/); //linkargs are the message content
    const triggerwords = require('./triggerwords.json');
    const triggerstring = message.content.toString().toLowerCase();
    const foundtriggers = triggerwords.find(v => (triggerstring.includes(v)));
    const antitriggers = require('./antitriggerwords.json');
    const foundantitriggers = antitriggers.find(v => (triggerstring.includes(v)));

    if (foundtriggers && message.channel != loggingchannel && !foundantitriggers){
        client.eventstuff.get('triggers').execute(message, logchannel, linkargs, Discord, client, currentDate, currentDateISO)
    }
})
client.on('messageUpdate', (oldMessage, newMessage) => {
    let currentDate = new Date();
    let currentDateISO = new Date().toISOString();
    const linkargs = newMessage.content.split(/ +/); //linkargs are the message content
    const triggerwords = require('./triggerwords.json');
    const triggerstring = newMessage.content.toString().toLowerCase();
    const foundtriggers = triggerwords.find(v => (triggerstring.includes(v)));
    const antitriggers = require('./antitriggerwords.json');
    const foundantitriggers = antitriggers.find(v => (triggerstring.includes(v)));

    if (foundtriggers && newMessage.channel != loggingchannel && !foundantitriggers){
        client.eventstuff.get('triggers').execute(newMessage, logchannel, linkargs, Discord, client, currentDate, currentDateISO)
    }
})
client.on('guildMemberAdd', (member) => {
    let currentDate = new Date();
    let currentDateISO = new Date().toISOString();
    client.eventstuff.get('newmember').execute(member, logchannel, Discord, client, currentDate, currentDateISO)
    

})
client.on('guildMemberUpdate', (oldMember, newMember) => {
    let currentDate = new Date();
    let currentDateISO = new Date().toISOString();
    client.eventstuff.get('name').execute(oldMember, newMember, logchannel, Discord, client, currentDate, currentDateISO)
})
client.on('presenceUpdate', (oldPresence, newPresence) => {
    //fs.appendFileSync('checker.log', "\n" + newPresence)
    let currentDate = new Date();
    let currentDateISO = new Date().toISOString();
    if(newPresence.status != 'offline'){
    //oldpresencename = oldPresence?.activities.name//toString();
    //newpresencename = newPresence.activities[0].name
    //newpresencetxt = newPresence.activities[0].state
    //fs.appendFileSync('checker.log', "\n" + newPresence.activities.length)
    for(i = 0; i < newPresence.activities.length ; i++){
        newpresencetxt = newPresence.activities[i].state
        //fs.appendFileSync('checker.log', "\n" + newpresencetxt)
        bannedwords = require('./bannedwords.json');
        if(!newpresencetxt || newpresencetxt == null || newpresencetxt == 'null') return
        triggerstring = newpresencetxt.toLowerCase();
        foundtriggers = bannedwords.find(v => (triggerstring.includes(v)));
        if(foundtriggers){
            logchannel.send(`${newpresencetxt} - ${newPresence.userId} | <@${newPresence.userId}> presence warning\n guild - ${newPresence.guild.id} | ${newPresence.guild.name}`)
        }
    }}
    
})

/*  
client.on('a', a => {

})
*/

}