const fs = require('fs');
const helper = require('../helper.js');
//const w 

module.exports = {
    name: 'osusave',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) { 
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - osusave")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 

        message.reply("WIP (can someone else code this for me pls im dumb)")
        
            return new Promise((resolve, reject) => {
                let user_ign = args[0]
    
                let split = helper.splitWithTail(message.content, ' ', 1);
    
                if(split.length < 2){
                    reject(helper.commandHelp('ign-set'));
                    return false;
                }
    
                let ign = split[1];
                let user_id = message.author.id;
    
                if(ign.length == 0){
                    reject(helper.commandHelp('ign-set'));
                    return false;
                }
    
                if(!helper.validUsername(ign)){
                    reject('Not a valid osu! username!');
                    return false;
                }
    
                user_ign[user_id] = ign;
                helper.setItem('user_ign', JSON.stringify(user_ign));
    
                let author = message.author.username.endsWith('s') ?
                    `${message.author.username}'`: `${message.author.username}'s`;
    
                message.channel.send(`${author} ingame name set to ${ign}`);
            });
        /*let user = message.author.id;
        let osuid = args[0];

        if(isNaN(osuid)) return message.reply("error - NaN");
        if(!osuid) return message.reply("error - not an id (use `sbr-osuid username` to get it)")
        let text = `,    "${user}": "${osuid}`
        fs.copyFileSync("savedusers.json", "savedusersold.json")
        let oldtext = require("")
        let oldtextthing = JSON.stringify(oldtext, null, 2).replace('}', '')
        fs.writeFileSync("savedusers.json", JSON.stringify(oldtextthing, null, 2).replaceAll('\\', '').replace('"', ''))
        fs.appendFileSync("savedusers.json", JSON.stringify(text, null, 2).replaceAll('\\', '').replace('"', ''))
        fs.appendFileSync("savedusers.json", JSON.stringify('}', null, 2))
        message.reply("saved")*/
}
}
//client.commands.get('').execute(message, args)