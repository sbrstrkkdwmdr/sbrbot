const ms = require('ms')
const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
module.exports = {
    name: "remindslash",
    category: "utility",
    description:{
        usage: "remind <time> <reminder>",
        content:  "Helps remind you something",
    },
    async execute(interaction, options, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        let time = options.getString('time').split(/ +/);
        let user = interaction.member.user
        let reminder = options.getString('reminder')

        let totaltime = 0
        try {
            for(let i = 0; i < time.length; i++){
                totaltime += ms(time[i])
            }
        } catch(error){
            interaction.reply('timing error. Make sure times are written as 4h and not 4 h')
            fs.appendFileSync(otherlogdir, "\n" + error)
        }

        if (!reminder) {
            reminder = 'undefined_reminder'
        }

        const remindertime = new Discord.MessageEmbed()
        .setColor('#33F304')
        .setTitle(`\**A reminder has been set to go off in ${time}**`);

        interaction.reply({ embeds: [remindertime] })

        const reminderdm = new Discord.MessageEmbed()
        .setColor('#7289DA')
        .setTitle('**REMINDER**')
        .setDescription(`${reminder}`);

        async function reminderlmao() {
           try{
            setTimeout(() => {
                user.send({ embeds: [reminderdm] })
            }, totaltime);
           }catch(error){
            fs.appendFileSync(otherlogdir, "\n" + "reminder error")
           } 
           
        }
        reminderlmao();

        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + "command executed - remind")
        fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + totaltime)
        fs.appendFileSync(otherlogdir, "\n" + "")
        console.groupEnd()
    }
}