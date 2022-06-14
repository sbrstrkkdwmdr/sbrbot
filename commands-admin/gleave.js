const { adminlogdir } = require('../logconfig.json')
const fs = require('fs')
module.exports = {
    name: 'gleave',
    description: 
    'Makes the bot leave a guild/server' + 
    '\nUsage: `/guildleave guildid:[id]`' 
    //'Aliases:'
    ,
    execute(interaction, options, client, Discord, currentDate, currentDateISO) {
        let idofguild = options.getNumber('guildid')
        fs.appendFileSync(adminlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(adminlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(adminlogdir, "\n" + "command executed - guild leave")
        fs.appendFileSync(adminlogdir, "\n" + "category - admin")
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(adminlogdir, "\n" + "")
        if (interaction.member.user.id = 503794887318044675) {
            let guildID = client.guilds.cache.get(idofguild);
            if (!guildID) {
                message.reply("id bro");
                return (false)
            }
            guildID.leave();

            fs.appendFileSync(adminlogdir, "\n" + `left guild - ${guildID}`)
            fs.appendFileSync(adminlogdir, "\n" + "")
        } console.groupEnd()
    }
}