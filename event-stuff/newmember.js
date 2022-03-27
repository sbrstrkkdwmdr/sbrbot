const fs = require('fs')
module.exports = {
    name: 'newmember',
    description: '',
    execute(member, logchannel, Discord, client, currentDate, currentDateISO) {
        membername = member.displayName

        bannedwords = require('../bannedwords.json');
        triggerstring = membername.toLowerCase();
        foundtriggers = bannedwords.find(v => (triggerstring.includes(v)));
        fs.appendFileSync('checker.log', "\n" + `!!!memberupdate!!! - ${member.id} \n${member.tag} joined the server`)
        if(foundtriggers){
            logchannel.send(`${member.id} | <@${member.id}> username warning\nguild - ${member.guild.id} | ${member.guild.id}\ncontent - ${membername}`)
        }
    }
}