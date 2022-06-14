const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
const { getStackTrace } = require('../somestuffidk/log')

module.exports = {
    name: 'time',
    description: 
    'Returns the current time given' +
    'Usage: `sbr-time` or `sbr-time [region/continent/country]/[city/town]`' +
    'All allowed timezones are here: https://www.iana.org/time-zones and here: https://stackoverflow.com/a/54500197'
    ,
    execute(message, args, Discord, currentDate, currentDateISO) {
        let epoch = new Date().getTime()
        let Datenow = new Date(currentDate).toUTCString()

        let msepochsince = parseInt(epoch) - 1640995200000
        let thedaysthingyiuseonmydiscordstatus = (msepochsince / 1000 / 60 / 60 / 24).toFixed(2)
        //                                                       ms    s   min hour    day
        /**
         * 
         * @param {date} date 
         * @returns to 12 hour time (UTC+00)
         */
        function to12htime(date) {
            let hours = date.getUTCHours();
            let minutes = date.getUTCMinutes();
            let seconds = date.getUTCSeconds();
            let amorpm;
            if (parseInt(hours) >= 12) {
                amorpm = 'PM'
            }
            else {
                amorpm = 'AM'
            }
            hours = hours % 12;
            if (hours == 0) hours = 12 // the hour '0' should be '12'
            if (minutes < 10) {
                minutes = '0' + minutes
            }
            if (seconds < 10) {
                seconds = '0' + seconds
            }
            var strTime = hours + ':' + minutes + ':' + seconds + amorpm;
            return strTime;
        }
        /**
         * 
         * @param {date} date 
         * @returns relative 12 hour time (non UTC)
         */
        function relto12htime(date) { //relative version of above
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            let amorpm;
            if (parseInt(hours) >= 12) {
                amorpm = 'PM'
            }
            else {
                amorpm = 'AM'
            }
            hours = hours % 12;
            if (hours == 0) hours = 12 // the hour '0' should be '12'
            if (minutes < 10) {
                minutes = '0' + minutes
            }
            if (seconds < 10) {
                seconds = '0' + seconds
            }
            var strTime = hours + ':' + minutes + ':' + seconds + amorpm;
            return strTime;
        }
        /**
         * 
         * @param {int} weekdaynum 
         * @returns weekdays to shorthand name i.e 1 -> Mon
         */
        function dayhuman(weekdaynum) { //date.getUTCDay returns an int so this is to convert to its name
            switch (weekdaynum.toString()) {
                case '0':
                    str = 'Sun'
                    break;
                case '1':
                    str = 'Mon'
                    break;
                case '2':
                    str = 'Tue'
                    break;
                case '3':
                    str = 'Wed'
                    break;
                case '4':
                    str = 'Thu'
                    break;
                case '5':
                    str = 'Fri'
                    break;
                case '6':
                    str = 'Sat'
                    break;
                default:
                    str = 'idk'
                    break;
            }
            return str;
        }
        /**
         * 
         * @param {int} monthnum 
         * @returns name of the month in shorthand i.e 1 -> Feb
         */
        function tomonthname(monthnum) {//date.getUTCMonth returns an int so this is to convert to its name
            switch (monthnum.toString()) {
                case '0':
                    str = 'Jan'
                    break;
                case '1':
                    str = 'Feb'
                    break;
                case '2':
                    str = 'Mar'
                    break;
                case '3':
                    str = 'Apr'
                    break;
                case '4':
                    str = 'May'
                    break;
                case '5':
                    str = 'Jun'
                    break;
                case '6':
                    str = 'Jul'
                    break;
                case '7':
                    str = 'Aug'
                    break;
                case '8':
                    str = 'Sep'
                    break;
                case '9':
                    str = 'Oct'
                    break;
                case '10':
                    str = 'Nov'
                    break;
                case '11':
                    str = 'December'
                    break;
                default:
                    str = 'idk'
                    break;
            }
            return str;
        }

        /**
         * 
         * @param {date} time 
         * @returns fixes offset i.e. +11:00 being returned as -660.
         */
        function fixoffset(time) {
            let offsettype;
            if (time.toString().includes('-')) {
                offsettype = '+'
            } else {
                offsettype = '-'
            }
            let current;
            let actualoffset;
            current = Math.abs(time / 60).toFixed(2)
            actualoffset = (offsettype + current).replace('.', ':')
            return actualoffset;
        }


        let rn = new Date()
        let seconds = rn.getUTCSeconds()
        let datenow12hhours = to12htime(rn)
        let day = dayhuman(rn.getUTCDay())
        let date = rn.getUTCDate()
        let month = tomonthname(rn.getUTCMonth())//tomonthname(rn.getUTCMonth())
        let year = rn.getUTCFullYear()
        let datenow12h = `${day}, ${date} ${month} ${year} ${datenow12hhours}`
        let lasttime = (fs.readFileSync('debug/timesince.txt')).toString()

        let lasttimetodateobj = new Date(lasttime)
        let timetonum = (rn - lasttimetodateobj) / (1000 * 60)

        let lasvisdays = (Math.trunc(timetonum / 60 / 24));
        let lastvishours = (Math.trunc(timetonum / 60)) % 24;
        let lastvisminutes = Math.trunc(timetonum % 60);
        let minlastvisw = ''

        if(lasvisdays > 0){
            minlastvisw += lasvisdays + "d "
        }
        if(lastvishours > 0){
            minlastvisw += lastvishours + "h "
        }
        if(lastvisminutes > 0){
            minlastvisw += lastvisminutes + "m " //+ lastvisminutes + "m");
        }
        if(minlastvisw == ''){
            minlastvisw = 'now'
        }


        fs.writeFileSync('debug/timesince.txt', rn.toString() )

        let monthnum = rn.getUTCMonth()
        let daynum = rn.getUTCDate()
        if (monthnum < 10) { monthnum = '0' + monthnum }
        if (daynum < 10) { daynum = '0' + daynum }
        let truedate = `${year}/${monthnum}/${daynum}`

        let offsetnum = rn.getTimezoneOffset()
        let offset = fixoffset(offsetnum)

        let relseconds = rn.getSeconds()
        let reldatenow12hhours = relto12htime(rn)
        let relday = dayhuman(rn.getDay())
        let reldate = rn.getDate()
        let relmonth = tomonthname(rn.getMonth())//tomonthname(rn.getUTCMonth())
        let relyear = rn.getFullYear()
        let reldatenow12h = `${relday}, ${reldate} ${relmonth} ${relyear} ${reldatenow12hhours}`

        let relmonthnum = rn.getMonth()
        let reldaynum = rn.getDate()
        if (relmonthnum < 10) { relmonthnum = '0' + relmonthnum }
        if (reldaynum < 10) { reldaynum = '0' + reldaynum }
        let reltruedate = `${relyear}/${relmonthnum}/${reldaynum}`


        let Embed = new Discord.MessageEmbed()
            .setTitle('Current Time')
            .addField(
                'UTC/GMT+00:00',
                `\n**Date**: ${truedate}` +
                `\n**Full Date**: ${datenow12h}` +
                `\n**Full Date(24h)**: ${Datenow}` +
                `\n\n**Full Date ISO8601**: ${currentDateISO}` +
                `\n**EPOCH(ms)**: ${epoch}` +
                `\n**Days since Jan 1st 2022**: [${thedaysthingyiuseonmydiscordstatus}]`
                ,
                false
            )
            .addField(
                `UTC/GMT${offset} (Host's Local Time)`,
                `\n**Date**: ${reltruedate}` +
                `\n**Full Date**: ${reldatenow12h}` +
                `\n**Full Date(24h)**: ${currentDate}` + 
                `\n**Time since command was last used**: ${minlastvisw} `
                ,
                false
            )
        if (args[0]) {
            if (!args[0].includes('/')) {
                Embed.addField(
                    `UTC/GMT +??:?? (Requested Time)`,
                    `\nRecived invalid timezone!` +
                    `\nBoth Country and City must be specified` +
                    `\ni.e **Australia/Melbourne**` +
                    `\nCheck [here](https://www.iana.org/time-zones) or [here](https://stackoverflow.com/a/54500197) for valid dates`
                    ,
                    false
                )
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
                    Embed.addField(
                        `UTC/GMT +??:?? (Requested Time)`,
                        `\nRecived invalid timezone!` +
                        `\nBoth Country and City must be specified` +
                        `\ni.e **Australia/Melbourne**` + 
                        `\nCheck [here](https://www.iana.org/time-zones) or [here](https://stackoverflow.com/a/54500197) for valid dates`
                        ,
                        false
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
                let optionaldateoffset = fixoffset(new Date(optionaldateISO).getTimezoneOffset())

                //let reldatenow12h = `${relday}, ${reldate} ${relmonth} ${relyear} ${reldatenow12hhours}`
                let optionaldate2 = `${dayhuman(optionaldate.getDay())}, ${tomonthname(optionaldate.getMonth())} ${optionaldate.getDate()} ${optionaldate.getFullYear()}`
                let optionaldatetime = relto12htime(new Date(optionaldate12hfirst))
                let optionaldate12h = `${optionaldate2} ${optionaldatetime}`

                optionaldatehours = parseInt(optionaldate.getHours())
                optionaldateutchours = parseInt(new Date().getUTCHours())
                console.log(optionaldatehours)
                console.log(optionaldateutchours)
                optionaldateoffsetNEW = fixoffset((optionaldateutchours - optionaldatehours) * 60) //had to remake another version of offset 
                
                Embed
                    .addField(
                        `UTC/GMT ${optionaldateoffsetNEW} (Requested Time)`,
                        `\n**Date**: ${optionaldateDate}` +
                        `\n**Full Date**: ${optionaldate12h}` +
                        `\n**Full Date(24h)**: ${optionaldate}` +
                        `\n**Full Date ISO8601**: ${optionaldateISO}`,
                        false
                    )
            }
        }
        //message.channel.send(`${currentDateISO} | ${currentDate}`) 
        message.channel.send({ embeds: [Embed] })
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + "command executed - time")
        fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + "")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)