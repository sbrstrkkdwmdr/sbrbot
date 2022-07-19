const fs = require('fs')
const calc = require('../configs/calculations.js')
module.exports = {
    name: 'time',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - time (message)\n${currentDate} | ${currentDateISO}\n recieved time command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            let epoch = new Date().getTime()
            let Datenow = new Date(currentDate).toUTCString()

            let msepochsince = parseInt(epoch) - 1640995200000
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
            let timetonum = (rn - lasttimetodateobj) / (1000 * 60)

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

            let monthnum = rn.getUTCMonth()
            let daynum = rn.getUTCDate()
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

            let relmonthnum = rn.getMonth()
            let reldaynum = rn.getDate()
            if (relmonthnum < 10) { relmonthnum = '0' + relmonthnum }
            if (reldaynum < 10) { reldaynum = '0' + reldaynum }
            let reltruedate = `${relyear}/${relmonthnum}/${reldaynum}`


            let Embed = new Discord.EmbedBuilder()
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
            if (args[0]) {
                if (!args[0].includes('/')) {
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
                else {
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
                        let optionaldatefirst = new Date(new Date().toLocaleString('en-US', timeopts));
                    } catch (error) {
                        fs.appendFileSync(otherlogdir, "\n" + error)
                        fs.appendFileSync(otherlogdir, "\n" + getStackTrace(error))
                        Embed.addFields([{
                            name: `UTC/GMT +??:?? (Requested Time)`,
                            value: `\nRecived invalid timezone!` +
                                `\nBoth Country and City must be specified` +
                                `\ni.e **Australia/Melbourne**` +
                                `\nCheck [here](https://www.iana.org/time-zones) or [here](https://stackoverflow.com/a/54500197) for valid dates`
                            ,
                            inline: false
                        }]
                        )
                        message.reply({ embeds: [Embed] })
                        return;
                    }
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

                    optionaldatehours = parseInt(optionaldate.getHours())
                    optionaldateutchours = parseInt(new Date().getUTCHours())
                    /* console.log(optionaldatehours)
                    console.log(optionaldateutchours) */
                    optionaldateoffsetNEW = calc.fixoffset((optionaldateutchours - optionaldatehours) * 60) //had to remake another version of offset 

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
                }
            }
            //message.channel.send(`${currentDateISO} | ${currentDate}`) 
            message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } })
        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - time (interaction)\n${currentDate} | ${currentDateISO}\n recieved time command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

        }

        fs.appendFileSync('commands.log', 'success\n\n', 'utf-8')
    }
}