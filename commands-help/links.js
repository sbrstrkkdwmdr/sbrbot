module.exports = {
    name: 'links',
    description: 'links',
    execute(interaction, args, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        interaction.channel.send('here you go! https://sbrstrkkdwmdr.github.io/sbr-web/');  
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - links")
        let consoleloguserweeee = interaction.member.user
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
    }
}
//client.commands.get('').execute(interaction, args)