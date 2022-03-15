const ms = require('ms')

module.exports = {
    name: "remindslash",
    category: "utility",
    description:{
        usage: "remind <time> <reminder>",
        content:  "Helps remind you something",
    },
    async execute(interaction, options, client, Discord, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
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
            console.log(error)
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
            console.log("reminder error")
           } 
           
        }
        reminderlmao();

        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - remind")
        let consoleloguserweeee = interaction.member.user
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log(totaltime)
        console.log("")
        console.groupEnd()
    }
}