const ms = require('ms')
const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
module.exports = {
    name: "remind",
    category: "utility",
    description:
        'Sets a reminder to send in a set amount of time' +
        '\nUsage: `sbr-remind [time in d/h/m/s] [reminder]`',
    async execute(message, args, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
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
            try {
                setTimeout(() => {
                    user.send({ embeds: [reminderdm] })
                }, ms(`${time}`));
            } catch (err) {
                fs.appendFileSync(otherlogdir, "\n" + "reminder error")
            }

        }
        reminderlmao();

        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + "command executed - remind")
        fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + ms(time))
        fs.appendFileSync(otherlogdir, "\n" + "")
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