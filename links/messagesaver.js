const fs = require('fs')
module.exports = { 
    name: 'messagesaver',
    execute(linkargs, message, args,currentDate, currentDateISO) {
        //if(message.author.bot) return;
        if(message.content.startsWith('sbr-', '!', '?', '$', '%', '^', '&', '*', '-', '_', '=', '+', '\\', '/', '<', '>', '.', '`', '~')) return;
        const allowuser = require('../allowedusers.json')
        let userid = message.author.id
        const allowedusers = allowuser.find(v => (userid.includes(v)));
        if(allowedusers){
        let savemsg = linkargs.splice(0,1000).join(" ") + '\n'
        fs.appendFileSync('msglist.txt', savemsg)}
    }
}