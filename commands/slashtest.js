const fs = require('fs')
module.exports = {
    name: 'slashtest',
    description: '',
    execute(interaction, options, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync('cmd.log', "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('cmd.log', "\n" + "command executed - test")
        fs.appendFileSync('cmd.log', "\n" + "category - general")
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('cmd.log', "\n" + "")
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