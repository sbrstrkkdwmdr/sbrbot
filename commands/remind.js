const ms = require('ms')

module.exports = {
    name: "remind",
    category: "utility",
    description:{
        usage: "remind <time> <reminder>",
        content:  "Helps remind you something",
    },
    async execute(message, args, client, Discord, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        let time = args[0];
        let user = message.author
        let reminder = args.splice(1).join(' ')

        const notime = new Discord.MessageEmbed()
            .setColor('#F30B04')
            .setTitle(`**Please specify the time!**`);

        const wrongtime = new Discord.MessageEmbed()
            .setColor('#F30B04')
            .setTitle(`**Incorrect time format: d, m, h, or s.**`);

        const reminderembed = new Discord.MessageEmbed()
            .setColor('#F30B04')
            .setTitle(`**Error: no reminder text**`);

        if (!args[0]) return message.channel.send({ embeds: [notime] })
        if (
            !args[0].endsWith("d") &&   
            !args[0].endsWith("m") &&
            !args[0].endsWith("h") &&
            !args[0].endsWith("s")
        )


            return message.channel.send({ embeds: [wrongtime] })
        if (!reminder) return message.channel.send({ embeds: [reminderembed] })

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
            }, ms(`${time}`));
           }catch(err){
            console.log("reminder error")
           } 
           
        }
        reminderlmao();

        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - remind")
        console.log("category - general")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log(ms(time))
        console.log("")
        console.groupEnd()
    }
}
/*

            let Embed = new Discord.MessageEmbed()
            .setColor(0xFFC1EC)
            .setTitle("amoggers")
            .setImage(`https://media.discordapp.net/attachments/724514625005158403/921733161229107210/amoggers.png`);
            message.reply({ embeds: [Embed] });
             */