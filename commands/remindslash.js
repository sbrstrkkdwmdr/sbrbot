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

        const notime = new Discord.MessageEmbed()
            .setColor('#F30B04')
            .setTitle(`**Please specify the time!**`);

        const wrongtime = new Discord.MessageEmbed()
            .setColor('#F30B04')
            .setTitle(`**Incorrect time format: d, m, h, or s.**`);

        const reminderembed = new Discord.MessageEmbed()
            .setColor('#F30B04')
            .setTitle(`**Error: no reminder text**`);

        let totaltime = 0
        for(let i = 0; i < time.length; i++){
            totaltime += ms(time[i])
        }

        if (!reminder) {
            reminder = 'undefined_reminder'
        }

        const remindertime = new Discord.MessageEmbed()
        .setColor('#33F304')
        .setTitle(`\**A reminder has been set to go off in ${time}**`);

        message.channel.send({ embeds: [remindertime] })

        const reminderdm = new Discord.MessageEmbed()
        .setColor('#7289DA')
        .setTitle('**REMINDER**')
        .setDescription(`${reminder}`);

        async function reminderlmao() {
           try{
            setTimeout(() => {
                user.send({ embeds: [reminderdm] })
            }, totaltime);
           }catch(err){
            console.log("reminder error")
           } 
           
        }
        reminderlmao();

        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - remind")
        let consoleloguserweeee = interaction.member.user
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log(ms(time))
        console.log("")
        console.groupEnd()
    }
}