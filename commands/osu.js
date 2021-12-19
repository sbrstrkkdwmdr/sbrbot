module.exports = {
    name: 'osu',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO) {
        const url = new URL(
            "https://osu.ppy.sh/api/v2/users/1/"
        );
        
        let params = {
            "limit": "10",
            "offset": "1",
        };
        Object.keys(params)
            .forEach(key => url.searchParams.append(key, params[key]));
        
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        };
        
        fetch(url, {
            method: "GET",
            headers,
        }).then(response => response.json());

        let embed = new Discord.RichEmbed
            .setAuthor(``)
            .setColor("9AAAC0")
            .addField(`${avatar} ${username}`)
            .addField(`Rank #${userrank} global | #${usercountryrank} ${usercountry}`)
            .addField(`acc: ${useraccuracy}% | ${userpp}pp`)
            .addField(`${userplaycount} plays`)
            .addField(`${userrankgrades}`)
            .addField(`${userliveicon}`)
            .addField(`${userrankgraph}`)
            .setFooter("");
        message.channel.send(embed)
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("executed command - osu")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
//        message.channel.send("I'm not an osu! bot. go use owobot or something")  
    }
}
//client.commands.get('').execute(message, args)