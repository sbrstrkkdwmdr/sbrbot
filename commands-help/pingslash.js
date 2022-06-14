const fs = require('fs')
const { helplogdir } = require('../logconfig.json')

module.exports = {
    name: 'pingslash',
    description: 'ping',
    execute(interaction, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync(helplogdir, "\n" + '--- COMMAND EXECUTION ---')
        interaction.reply(`Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
        fs.appendFileSync(helplogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(helplogdir, "\n" + "command executed - ping")
        fs.appendFileSync(helplogdir, "\n" + "category - help")
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync(helplogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(helplogdir, "\n" + `Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
        fs.appendFileSync(helplogdir, "\n" + "")
        console.groupEnd()
        }
}



