module.exports = {
    name: 'slashtest',
    description: '',
    execute(interaction, options, client, Discord, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - test")
        let consoleloguserweeee = interaction.member.user
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
        let testcmd = options.getString('type');
        if(!testcmd) return interaction.reply('⠀');
        switch(testcmd){
            case 'list':
                let listEmbed = Discord.MessageEmbed()
                    .setTitle('list of WIP commands')
                    .setDescription('')
                interaction.reply('')
                break;
            default:
                interaction.reply('⠀')
                break;
        }
    }
}
//client.commands.get('').execute(message, args)