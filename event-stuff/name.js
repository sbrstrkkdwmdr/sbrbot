const fs = require('fs')
module.exports = {
    name: 'name',
    description: '',
    execute(oldMember, newMember, logchannel, Discord, client, currentDate, currentDateISO) {
        oldmembernick = oldMember.displayName
        newmembernick = newMember.displayName
    
        bannedwords = require('../bannedwords.json');
        triggerstring = newmembernick.toLowerCase();
        foundtriggers = bannedwords.find(v => (triggerstring.includes(v)));
        if(oldmembernick != newmembernick){
            fs.appendFileSync('checker.log', "\n" + `!!!memberupdate!!! - (${newMember.id})\n${oldmembernick} > ${newmembernick}`)
           if(foundtriggers){
               logchannel.send(`${newMember.id} | <@${newMember.id}> username warning\n guild - ${newMember.guild.id} | ${newMember.guild.id}\ncontent - ${oldmembernick} > ${newmembernick}`)
           } 
        }
    }
}