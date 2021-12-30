const fetch = require('node-fetch');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//const xhr = new XMLHttpRequest();
const GET = require('node-fetch');
const fs = require('fs');
module.exports = {
    name: 'rs',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, currentDateForSomeApiThing) {
        let pickeduser = args[0]
        const pickeduserX = args[0];
        
//        `https://osutrack-api.ameo.dev/hiscores?user=${pickeduserX}&mode=0`
        let url = `https://osutrack-api.ameo.dev/hiscores?user=${pickeduserX}&mode=0&from=${currentDateForSomeApiThing}`;
    fetch(url)
    .then(res => res.json())
    .then(out =>
        message.reply(JSON.stringify(out))
    ).catch(error => message.reply("no recent plays found"))
    message.channel.send(currentDateForSomeApiThing)
//        message.channel.send("I'm not an osu! bot. go use owobot or something") 
console.log(`${currentDateISO} | ${currentDate}`)
console.log("command executed - rs")
let consoleloguserweeee = message.author
console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
console.log("") 
    }
}
//client.commands.get('').execute(message, args)