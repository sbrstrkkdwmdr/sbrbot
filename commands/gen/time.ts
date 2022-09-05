import cmdchecks = require('../../src/checks');
import fs = require('fs');
import calc = require('../../src/calc');
import emojis = require('../../src/consts/emojis');
import colours = require('../../src/consts/colours');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../../src/log');

module.exports = {
    name: 'time',
    execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides) {
        let commanduser;

        let fetchtimezone;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                fetchtimezone = args.join(' ')
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }
        if (overrides != null) {

        }

        //==============================================================================================================================================================================================

        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-time-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅'),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-time-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-time-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶'),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-time-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡'),
            );

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'time',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [{
                    name: 'timezone',
                    value: `${fetchtimezone}`
                }]
            ), 'utf-8')

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
        const lasttime = fs.existsSync('debug/timesince.txt') ? (fs.readFileSync('debug/timesince.txt')).toString() :
            (new Date()).toString()


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
            .setColor(colours.embedColour.info.dec)
            .setTitle('Current Time')
            .addFields([{
                name: 'UTC/GMT+00:00',
                value: `\n**Date**: ${truedate}` +
                    `\n**Full Date**: ${datenow12h}` +
                    `\n**Full Date(24h)**: ${Datenow}` +
                    `\n\n**Full Date ISO8601**: ${currentDate.toISOString()}` +
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
                    obj.reply({ embeds: [Embed] })
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
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [Embed],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                obj.reply({
                    content: '',
                    embeds: [Embed],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.edit({
                    content: '',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
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