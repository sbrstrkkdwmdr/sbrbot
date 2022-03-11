module.exports = {
    name: 'ping',
    description: 'ping',
    execute(interaction, client, Discord, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        //interaction.channel.send('pong!');   
        interaction.reply(`Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - ping")
        let consoleloguserweeee = interaction.member.user
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log(`Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
        console.log("")
        console.groupEnd()
    }
}



