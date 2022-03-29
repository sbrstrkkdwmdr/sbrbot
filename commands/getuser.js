const fs = require('fs')
module.exports = {
    name: 'getuser',
    description: "say",
    execute(message, client, Discord, args, currentDate, currentDateISO) {
        try{
            if(isNaN(args[0])){
            member1 = client.users.fetch((message.mentions.members.first()).id)
        }
        else{
            member1 = client.users.fetch(args[0])
        }
        }
        catch(error){
            console.log(error)
            return message.reply("no user data found")
            //doesn't catch error properly if deleted user for some reason
        }
        //member1 = client.users.fetch((message.mentions.members.first()).id)
        //if(!member1 || member1 == undefined){
            //member1 = client.users.fetch(args[0])
        //}
        if(!member1) return message.reply("no user data found")
        //member = message.guild.members.fetch(args[0])
        member1.then(function(result){
            //console.log(result)
            //member = JSON.stringify(result, null, 2); // Now you can use res everywhere
        
        //console.log("penis" + member)
        let username = JSON.stringify(result['username']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('username', '');//.toString()
        //let flags = JSON.stringify(result['flags']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('flags', '');
        let discrim = JSON.stringify(result['discriminator']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('discriminator', '');
        //let avatar = JSON.stringify(result['avatar']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('avatar', '');
        let creation = JSON.stringify(result['createdAt']).replaceAll('"', '').replaceAll('createdAt', '');
        let date2 = creation.replace('T', ' ').slice(0, 19);
        let id = JSON.stringify(result['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
        try{
            avatar = JSON.stringify(result['avatar']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('avatar', '');
            av = `https://cdn.discordapp.com/avatars/${id}/${avatar}`
        } catch(error) {
            av = 'https://a.ppy.sh/15222484'
        }
        let bot = JSON.stringify(result['bot']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replace(':', '').replaceAll('bot', '');
        botstatus = ''
        if(bot == 'true'){
            botstatus = `<:bot:958289108147523584>`
        }
        if(!bot == 'true' || !bot){
            botstatus = ''
        }
        //let av = 'https://a.ppy.sh/15222484'
        //console.log(av)

        let embed = new Discord.MessageEmbed()
        .setTitle(`Information for ${username} ${botstatus}`)
        .setThumbnail(av)
        .setDescription(`Discriminator - ${discrim}\nUser ID - ${id}\nAccount created on ${date2}\n`)
        message.channel.send({ embeds: [embed]})
    })
    }
}