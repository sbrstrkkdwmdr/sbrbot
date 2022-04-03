const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
module.exports = {
    name: 'slashtest',
    description: '',
    execute(interaction, options, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + "command executed - test")
        fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + "")
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