const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
module.exports = {
    name: 'time',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO) {
        let epoch = new Date().getTime()
        let Datenow = new Date(currentDate).toUTCString()
        
        function to12htime(date) {
            let hours = date.getUTCHours();
            let minutes = date.getUTCMinutes();
            let seconds = date.getUTCSeconds();
            let amorpm;
            if(parseInt(hours) > 12){
                amorpm = 'PM'
            }
            else{
                amorpm = 'AM'
            }
            hours = hours % 12;
            if(hours == 0) hours = 12 // the hour '0' should be '12'
            if(minutes < 10){
                minutes = '0' + minutes
            }
            var strTime = hours + ':' + minutes + ':' + seconds + amorpm;
            return strTime;
        }
        function relto12htime(date) { //relative version of above
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            let amorpm;
            if(parseInt(hours) > 12){
                amorpm = 'PM'
            }
            else{
                amorpm = 'AM'
            }
            hours = hours % 12;
            if(hours == 0) hours = 12 // the hour '0' should be '12'
            if(minutes < 10){
                minutes = '0' + minutes
            }
            var strTime = hours + ':' + minutes + ':' + seconds + amorpm;
            return strTime;
        } 
        function dayhuman(weekdaynum){ //date.getUTCDay returns an int so this is to convert to its name
            switch(weekdaynum.toString()){
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
        function tomonthname(monthnum){//date.getUTCMonth returns an int so this is to convert to its name
            switch(monthnum.toString()){
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
        let rn = new Date()
        let seconds = rn.getUTCSeconds()
        let datenow12hhours = to12htime(rn)
        let day = dayhuman(rn.getUTCDay())
        let date = rn.getUTCDate()
        let month = tomonthname(rn.getUTCMonth())//tomonthname(rn.getUTCMonth())
        let year = rn.getUTCFullYear()
        let datenow12h = `${day}, ${date} ${month} ${year} ${datenow12hhours}`

        let monthnum = rn.getUTCMonth()
        let daynum = rn.getUTCDate()
        if(month<10) {month = '0' + month}
        if(day<10) {day = '0' + day}
        let truedate = `${year}/${monthnum}/${daynum}`

        let offset = rn.getTimezoneOffset()
        let relseconds = rn.getSeconds()
        let reldatenow12hhours = relto12htime(rn)
        let relday = dayhuman(rn.getDay())
        let reldate = rn.getDate()
        let relmonth = tomonthname(rn.getMonth())//tomonthname(rn.getUTCMonth())
        let relyear = rn.getFullYear()
        let reldatenow12h = `${relday}, ${reldate} ${relmonth} ${relyear} ${reldatenow12hhours}`

        let relmonthnum = rn.getMonth()
        let reldaynum = rn.getDate()
        if(relmonthnum<10){relmonthnum = '0' + relmonthnum}
        if(reldaynum<10){reldaynum = '0' + reldaynum}
        let reltruedate = `${relyear}/${relmonthnum}/${reldaynum}`

        let Embed = new Discord.MessageEmbed()
        .setTitle('Current Time')
        .addField(
            'UTC/GMT+00',
            `\n**Date**: ${truedate}` +
            `\n**Full Date**: ${datenow12h}` + 
            `\n**Full Date(24h)**: ${Datenow}` +
            `\n\n**Full Date ISO8601**: ${currentDateISO}` +
            `\n**EPOCH(ms)**: ${epoch}`,
            false
        )
        .addField(
            `UTC/GMT${offset}`,
            `\n**Date**: ${reltruedate}` +
            `\n**Full Date**: ${reldatenow12h}` +
            `\n**Full Date(24h)**: ${currentDate}`,
            false
            )
        //message.channel.send(`${currentDateISO} | ${currentDate}`) 
        message.channel.send({ embeds: [Embed]})
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