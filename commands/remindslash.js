const ms = require('ms')
const fs = require('fs')
module.exports = {
    name: "remindslash",
    category: "utility",
    description:{
        usage: "remind <time> <reminder>",
        content:  "Helps remind you something",
    },
    async execute(interaction, options, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync('cmd.log', "\n" + '--- COMMAND EXECUTION ---')
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
            fs.appendFileSync('cmd.log', "\n" + error)
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
            fs.appendFileSync('cmd.log', "\n" + "reminder error")
           } 
           
        }
        reminderlmao();

        fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('cmd.log', "\n" + "command executed - remind")
        fs.appendFileSync('cmd.log', "\n" + "category - general")
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('cmd.log', "\n" + totaltime)
        fs.appendFileSync('cmd.log', "\n" + "")
        console.groupEnd()
    }
}