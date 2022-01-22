module.exports = {
    name: 'error',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - error")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        let errorlist = args[0];
        switch(errorlist){
            case 'LB1':
                message.reply("Error LB1 - insufficient link\nmap links should be either osu.ppy.sh/b/map_id or osu.ppy.sh/beatmapsets/mapset_id#osu/map_id")
                break;
            case 'LB2':
                message.reply("Error LB2 - unknown.")
                break;
            case 'OP1':
                message.reply("Error OP1 - user not found")
        }
    }
}
//client.commands.get('').execute(message, args)