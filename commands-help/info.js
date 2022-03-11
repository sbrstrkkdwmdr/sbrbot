module.exports = {
    name: 'info',
    description: '',
    execute(interaction, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        interaction.channel.send('bot coded by SaberStrike in node js\nsource code - https://github.com/sbrstrkkdwmdr/sbrbot')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - info")
        let consoleloguserweeee = interaction.member.user
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)