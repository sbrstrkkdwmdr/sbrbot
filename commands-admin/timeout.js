module.exports = {
    name: 'timeout',
    description: 'timeout',
    execute(message, args, client, Discord, currentDate, currentDateISO){
        let user = message.mentions.members.first()
        let time = args.splice(2,2).join("")
        let reason = args.splice(3, 100).join(" ")
        if(!reason){
            reasonx = 'undefined reason'
        } else {
            reasonx = reason
        }
        if(isNaN(time)){
            time = 1000 * 60 * 60 * 24 //ms -> s -> m -> h -> d
        }
        if(user){
            member = message.guild.members.cache.get(user.id)
            member.timeout(time, reasonx)
        }
    }
}