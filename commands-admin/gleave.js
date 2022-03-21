module.exports = {
    name: 'gleave',
    description: '',
    execute(interaction, options, client, Discord, currentDate, currentDateISO) {
        let idofguild = options.getNumber('guildid')
        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - guild leave")
        console.log("category - admin")
        let consoleloguserweeee = interaction.member.user
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        if(interaction.member.user.id = 503794887318044675){
        let guildID = client.guilds.cache.get(idofguild);
        if(!guildID){
        message.reply("id bro");
        return(false)
        }
        guildID.leave(); 

        console.log(`left guild - ${guildID}`)
        console.log("")
    }   console.groupEnd()
        }
    }