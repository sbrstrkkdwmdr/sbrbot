import cmdchecks = require('../../calc/commandchecks');
import calc = require('../../calc/calculations');
import fs = require('fs');
import colours = require('../../configs/colours');

module.exports = {
    name: 'time',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let fetchtimezone;
        if (message != null && interaction == null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - time (message)
${currentDate} | ${currentDateISO}
recieved time command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            fetchtimezone = args.join(' ')
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - time (interaction)
${currentDate} | ${currentDateISO}
recieved time command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - time (interaction)
${currentDate} | ${currentDateISO}
recieved time command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        }
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}

----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        const epoch = new Date().getTime()
        const Datenow = new Date(currentDate).toUTCString()

        const msepochsince = (epoch) - 1640995200000
        const thedaysthingyiuseonmydiscordstatus = (msepochsince / 1000 / 60 / 60 / 24).toFixed(2)

        const rn = new Date()
        const seconds = rn.getUTCSeconds()
        const datenow12hhours = calc.to12htime(rn)
        const day = calc.dayhuman(rn.getUTCDay())
        const date = rn.getUTCDate()
        const month = calc.tomonthname(rn.getUTCMonth())//tomonthname(rn.getUTCMonth())
        const year = rn.getUTCFullYear()
        const datenow12h = `${day}, ${date} ${month} ${year} ${datenow12hhours}`
        const lasttime = (fs.readFileSync('debug/timesince.txt')).toString()

        const lasttimetodateobj = new Date(lasttime)
        const timetonum = (rn.getTime() - lasttimetodateobj.getTime()) / (1000 * 60)

        const lasvisdays = (Math.trunc(timetonum / 60 / 24));
        const lastvishours = (Math.trunc(timetonum / 60)) % 24;
        const lastvisminutes = Math.trunc(timetonum % 60);
        let minlastvisw = ''

        if (lasvisdays > 0) {
            minlastvisw += lasvisdays + "d "
        }
        if (lastvishours > 0) {
            minlastvisw += lastvishours + "h "
        }
        if (lastvisminutes > 0) {
            minlastvisw += lastvisminutes + "m " //+ lastvisminutes + "m");
        }
        if (minlastvisw == '') {
            minlastvisw = 'now'
        }


        fs.writeFileSync('debug/timesince.txt', rn.toString())

        let monthnum: number | string = rn.getUTCMonth()
        let daynum: number | string = rn.getUTCDate()
        if (monthnum < 10) { monthnum = '0' + monthnum }
        if (daynum < 10) { daynum = '0' + daynum }
        const truedate = `${year}/${monthnum}/${daynum}`

        const offsetnum = rn.getTimezoneOffset()
        const offset = calc.fixoffset(offsetnum)

        const relseconds = rn.getSeconds()
        const reldatenow12hhours = calc.relto12htime(rn)
        const relday = calc.dayhuman(rn.getDay())
        const reldate = rn.getDate()
        const relmonth = calc.tomonthname(rn.getMonth())//tomonthname(rn.getUTCMonth())
        const relyear = rn.getFullYear()
        const reldatenow12h = `${relday}, ${reldate} ${relmonth} ${relyear} ${reldatenow12hhours}`

        let relmonthnum: number | string = rn.getMonth()
        let reldaynum: number | string = rn.getDate()
        if (relmonthnum < 10) { relmonthnum = '0' + relmonthnum }
        if (reldaynum < 10) { reldaynum = '0' + reldaynum }
        const reltruedate = `${relyear}/${relmonthnum}/${reldaynum}`


        const Embed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.info.hex)
            .setTitle('Current Time')
            .addFields([{
                name: 'UTC/GMT+00:00',
                value: `\n**Date**: ${truedate}` +
                    `\n**Full Date**: ${datenow12h}` +
                    `\n**Full Date(24h)**: ${Datenow}` +
                    `\n\n**Full Date ISO8601**: ${currentDateISO}` +
                    `\n**EPOCH(ms)**: ${epoch}` +
                    `\n**Days since Jan 1st 2022**: [${thedaysthingyiuseonmydiscordstatus}]`
                ,
                inline: false
            }]
            )
            .addFields([{
                name: `UTC/GMT${offset} (Host's Local Time)`,
                value: `\n**Date**: ${reltruedate}` +
                    `\n**Full Date**: ${reldatenow12h}` +
                    `\n**Full Date(24h)**: ${currentDate}` +
                    `\n**Time since command was last used**: ${minlastvisw} `
                ,
                inline: false
            }]
            )
        if (fetchtimezone != null && fetchtimezone != '') {
            if (fetchtimezone.includes('/')) {
                const timezone = args.splice(0, 1000).join(" ");
                //timezone = 'Europe/Andorra'
                const timeopts = {
                    timeZone: `${timezone}`,
                    hour12: false
                }
                const timeopts2 = {
                    timeZone: `${timezone}`,
                    hour12: true
                }
                try {
                    const optionaldatefirst = new Date(new Date().toLocaleString('en-US', timeopts));//).toISOString();
                    const optionaldateISO = new Date(optionaldatefirst).toISOString()
                    const optionaldateDate = new Date(optionaldateISO).toLocaleDateString();
                    const optionaldate = new Date(optionaldateISO)//.toString();
                    //let optionaldate12hISO = new Date().toISOString(timeopts2);//.toString(timeopts2);
                    const optionaldate12hfirst = new Date(new Date().toLocaleString('en-US', timeopts2));
                    const optionaldateoffset = calc.fixoffset(new Date(optionaldateISO).getTimezoneOffset())

                    //let reldatenow12h = `${relday}, ${reldate} ${relmonth} ${relyear} ${reldatenow12hhours}`
                    const optionaldate2 = `${calc.dayhuman(optionaldate.getDay())}, ${calc.tomonthname(optionaldate.getMonth())} ${optionaldate.getDate()} ${optionaldate.getFullYear()}`
                    const optionaldatetime = calc.relto12htime(new Date(optionaldate12hfirst))
                    const optionaldate12h = `${optionaldate2} ${optionaldatetime}`

                    const optionaldatehours = (optionaldate.getHours())
                    const optionaldateutchours = (new Date().getUTCHours())
                    /* console.log(optionaldatehours)
                    console.log(optionaldateutchours) */
                    const optionaldateoffsetNEW = calc.fixoffset((optionaldateutchours - optionaldatehours) * 60) //had to remake another version of offset 

                    //


                    Embed
                        .addFields([{
                            name: `UTC/GMT ${optionaldateoffsetNEW} (Requested Time)`,
                            value: `\n**Date**: ${optionaldateDate}` +
                                `\n**Full Date**: ${optionaldate12h}` +
                                `\n**Full Date(24h)**: ${optionaldate}` +
                                `\n**Full Date ISO8601**: ${optionaldateISO}`,
                            inline: false
                        }])
                } catch (error) {
                    Embed.addFields([{
                        name: `UTC/GMT +??:?? (Requested Time)`,
                        value: `\nRecived invalid timezone!` +
                            `\n\`${fetchtimezone}\` is not a valid timezone` +
                            `\nCheck [here](https://www.iana.org/time-zones) or [here](https://stackoverflow.com/a/54500197) for valid timezones`
                        ,
                        inline: false
                    }]
                    )
                    message.reply({ embeds: [Embed] })
                        .catch(error => { });
                    return;
                }

            } else {
                Embed.addFields([{
                    name: `UTC/GMT +??:?? (Requested Time)`,
                    value: `\nRecived invalid timezone!` +
                        `\nBoth Country and City must be specified` +
                        `\ni.e **Australia/Melbourne**` +
                        `\nCheck [here](https://www.iana.org/time-zones) or [here](https://stackoverflow.com/a/54500197) for valid dates`
                    ,
                    inline: false
                }])
            }
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================

        if ((message != null || interaction != null) && button == null) {
            obj.reply({
                content: '',
                embeds: [Embed],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });
        }
        if (button != null) {
            message.edit({
                content: '',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
        }


        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}