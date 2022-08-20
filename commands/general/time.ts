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

        let epoch = new Date().getTime()
        let Datenow = new Date(currentDate).toUTCString()

        let msepochsince = (epoch) - 1640995200000
        let thedaysthingyiuseonmydiscordstatus = (msepochsince / 1000 / 60 / 60 / 24).toFixed(2)

        let rn = new Date()
        let seconds = rn.getUTCSeconds()
        let datenow12hhours = calc.to12htime(rn)
        let day = calc.dayhuman(rn.getUTCDay())
        let date = rn.getUTCDate()
        let month = calc.tomonthname(rn.getUTCMonth())//tomonthname(rn.getUTCMonth())
        let year = rn.getUTCFullYear()
        let datenow12h = `${day}, ${date} ${month} ${year} ${datenow12hhours}`
        let lasttime = (fs.readFileSync('debug/timesince.txt')).toString()

        let lasttimetodateobj = new Date(lasttime)
        let timetonum = (rn.getTime() - lasttimetodateobj.getTime()) / (1000 * 60)

        let lasvisdays = (Math.trunc(timetonum / 60 / 24));
        let lastvishours = (Math.trunc(timetonum / 60)) % 24;
        let lastvisminutes = Math.trunc(timetonum % 60);
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

        let monthnum: any = rn.getUTCMonth()
        let daynum: any = rn.getUTCDate()
        if (monthnum < 10) { monthnum = '0' + monthnum }
        if (daynum < 10) { daynum = '0' + daynum }
        let truedate = `${year}/${monthnum}/${daynum}`

        let offsetnum = rn.getTimezoneOffset()
        let offset = calc.fixoffset(offsetnum)

        let relseconds = rn.getSeconds()
        let reldatenow12hhours = calc.relto12htime(rn)
        let relday = calc.dayhuman(rn.getDay())
        let reldate = rn.getDate()
        let relmonth = calc.tomonthname(rn.getMonth())//tomonthname(rn.getUTCMonth())
        let relyear = rn.getFullYear()
        let reldatenow12h = `${relday}, ${reldate} ${relmonth} ${relyear} ${reldatenow12hhours}`

        let relmonthnum: any = rn.getMonth()
        let reldaynum: any = rn.getDate()
        if (relmonthnum < 10) { relmonthnum = '0' + relmonthnum }
        if (reldaynum < 10) { reldaynum = '0' + reldaynum }
        let reltruedate = `${relyear}/${relmonthnum}/${reldaynum}`


        let Embed = new Discord.EmbedBuilder()
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
                let timezone = args.splice(0, 1000).join(" ");
                //timezone = 'Europe/Andorra'
                let timeopts = {
                    timeZone: `${timezone}`,
                    hour12: false
                }
                let timeopts2 = {
                    timeZone: `${timezone}`,
                    hour12: true
                }
                try {
                    let optionaldatefirst = new Date(new Date().toLocaleString('en-US', timeopts));//).toISOString();
                    let optionaldateISO = new Date(optionaldatefirst).toISOString()
                    let optionaldateDate = new Date(optionaldateISO).toLocaleDateString();
                    let optionaldate = new Date(optionaldateISO)//.toString();
                    //let optionaldate12hISO = new Date().toISOString(timeopts2);//.toString(timeopts2);
                    let optionaldate12hfirst = new Date(new Date().toLocaleString('en-US', timeopts2));
                    let optionaldateoffset = calc.fixoffset(new Date(optionaldateISO).getTimezoneOffset())

                    //let reldatenow12h = `${relday}, ${reldate} ${relmonth} ${relyear} ${reldatenow12hhours}`
                    let optionaldate2 = `${calc.dayhuman(optionaldate.getDay())}, ${calc.tomonthname(optionaldate.getMonth())} ${optionaldate.getDate()} ${optionaldate.getFullYear()}`
                    let optionaldatetime = calc.relto12htime(new Date(optionaldate12hfirst))
                    let optionaldate12h = `${optionaldate2} ${optionaldatetime}`

                    let optionaldatehours = (optionaldate.getHours())
                    let optionaldateutchours = (new Date().getUTCHours())
                    /* console.log(optionaldatehours)
                    console.log(optionaldateutchours) */
                    let optionaldateoffsetNEW = calc.fixoffset((optionaldateutchours - optionaldatehours) * 60) //had to remake another version of offset 

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

        if (message != null && interaction == null && button == null) {
            message.reply({
                content: '',
                embeds: [Embed],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
        }
        if (interaction != null && button == null && message == null) {
            interaction.reply({
                content: '',
                embeds: [Embed],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
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