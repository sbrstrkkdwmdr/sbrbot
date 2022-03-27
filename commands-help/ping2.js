module.exports = {
    name: 'ping2',
    description: 'ping',
    execute(interaction, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync('help.log', "\n" + '--- COMMAND EXECUTION ---')
        interaction.reply(`Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
        fs.appendFileSync('help.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('help.log', "\n" + "command executed - ping")
        fs.appendFileSync('help.log', "\n" + "category - help")
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync('help.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('help.log', "\n" + `Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
        fs.appendFileSync('help.log', "\n" + "")
        console.groupEnd()
        }
}



