module.exports = {
    name: 'help2',
    description: '',
    execute(interaction, options, commands, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        let helper = options.getString('command')
        if(!helper){
        interaction.reply('all commands listed here - https://sbrstrkkdwmdr.github.io/sbr-web/botcmdslash\nuse sbr-help for non-slash commands')}

        //client.commands.get('').execute(message, args)

        switch(helper){
            
            default:
                interaction.reply(`command "${helper}" not found`)
                interaction.reply('commands listed here - https://sbrstrkkdwmdr.github.io/sbr-web/botcmdslash')
        }


        console.log(`${currentDateISO} | ${currentDate}`)  
        console.log("command executed - help")
        let consoleloguserweeee = interaction.member.user
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)