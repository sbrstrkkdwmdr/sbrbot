const { loggingchannel } = require('./config.json');
const fs = require('fs');
module.exports = (userdatatags, client, Discord, osuauthtoken, osuapikey, osuclientid, osuclientsecret, trnkey, ytdl, monitorEventLoopDelay, setInterval) => {
    let logchannel = client.channels.cache.get(loggingchannel)
    client.eventstuff = new Discord.Collection();
    const eventstufffiles = fs.readdirSync('./event-stuff/').filter(file => file.endsWith('.js'));
    for (const file of eventstufffiles) {
        const eventthing = require(`./event-stuff/${file}`);

        client.eventstuff.set(eventthing.name, eventthing);
    }

    function leaguetimer() {
        //console.log(client);
        client.guilds.cache.forEach(guild => {
            const users = guild.members.cache.map(u => u.id)
            for (i0 = 0; i0 < users.length; i0++) {
                //let member1 = client.users.cache.get(users[i0]);
                (async () => {
                    try {
                        member = await guild.members.fetch(users[i0])
                        //console.log(member)
                    } catch (error) {
                        return;
                    }
                    //console.log(member.presence)
                    //if (member.bot == (true || 'true')) return;
                    //console.log(member)
                    //console.log(member.username)
                    if (member.presence || member.presences) {
                        fs.appendFileSync('logs/presence.log', '| true ')
                        for (i = 0; i < member.presence.activities.length; i++) {
                            let activitytimestamp = member.presence.activities[i].createdTimestamp//(new Date(member.presence.activities.createdAt)).getTime()
                            //the milliseconds since jan 1 1970 when the activity started
                            let rightnow = (new Date()).getTime() //current number of milliseconds since jan 1 1970
                            let totaltimems = (rightnow - activitytimestamp) //calculate how long activity has been running for in milliseconds
                            let totaltimes = totaltimems / 1000 //convert to seconds
                            if (member.presence.activities[i].name == 'League of Legends' && totaltimes > 1800) {
                                fs.appendFileSync('logs/presence.log', `\n${member.id} AKA ${member.username} has been playing league for ${totaltimes / 60} minutes!\n`) // saves it in logs
                                let user = member.presence.user
                                //console.log('')
                                //user.send('You have been playing league for too long!') // sends a DM
                                /*member.ban({
                                    reason: 'league player',
                                    
                                })
                                .catch(error => {
                                    message.reply(`I am unable to ban ${member.username}. `)
                                })*///uncomment to enable banning
                            }
                            else {
                                // do nothing
                            }
                        }
                    } //if presence
                    else {
                        fs.appendFileSync('logs/presence.log', '| false ')
                    }
                })()
            }
            //user.send('you have been playing league for too long!')

        })
    }

    let timer = 60 * 1000 * 30;
    leaguetimer();
    setInterval(leaguetimer, timer)//last value is minutes

    //putting this here bcs for some reason the loop.js file is broken and doesn't let me run this there instead :(


    client.on('messageCreate', message => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        const linkargs = message.content.split(/ +/); //linkargs are the message content
        const triggerwords = require('./triggerwords.json');
        const triggerstring = message.content.toString().toLowerCase();
        const foundtriggers = triggerwords.find(v => (triggerstring.includes(v)));
        const antitriggers = require('./antitriggerwords.json');
        const foundantitriggers = antitriggers.find(v => (triggerstring.includes(v)));

        if (foundtriggers && message.channel != loggingchannel && !foundantitriggers) {
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

        if (foundtriggers && newMessage.channel != loggingchannel && !foundantitriggers) {
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
        if (newPresence.status != 'offline') {
            //oldpresencename = oldPresence?.activities.name//toString();
            //newpresencename = newPresence.activities[0].name
            //newpresencetxt = newPresence.activities[0].state
            //fs.appendFileSync('checker.log', "\n" + newPresence.activities.length)
            for (i = 0; i < newPresence.activities.length; i++) {
                newpresencetxt = newPresence.activities[i].state
                //fs.appendFileSync('checker.log', "\n" + newpresencetxt)
                bannedwords = require('./bannedwords.json');
                if (!newpresencetxt || newpresencetxt == null || newpresencetxt == 'null') return
                triggerstring = newpresencetxt.toLowerCase();
                foundtriggers = bannedwords.find(v => (triggerstring.includes(v)));
                if (foundtriggers) {
                    logchannel.send(`${newpresencetxt} - ${newPresence.userId} | <@${newPresence.userId}> presence warning\n guild - ${newPresence.guild.id} | ${newPresence.guild.name}`)
                }
            }
        }

    })

    /*  
    client.on('a', a => {
    
    })
    */

}