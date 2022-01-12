let currentDate = new Date();
let currentDateISO = new Date().toISOString();
module.exports = {
    name: 'gleave',
    description: '',
    execute(message, args, client) {
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - guild leave")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        if(message.author.id = 503794887318044675){
        let guildID = client.guilds.cache.get(args[0]);
        if(!guildID){
        message.reply("id bro");
        return(false)
        }
        return guildID.leave();

        console.log(`left guild - ${guildID}`)
        console.log("")
    }
        }
    }