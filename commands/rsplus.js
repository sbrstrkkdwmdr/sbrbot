module.exports = {
    name: 'rsplus',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO) {
        let pickeduser = args[0]
        const url = new URL(
            `https://osu.ppy.sh/api/v2/users/${pickeduser}/recent_activity`
        );
        
        let params = {
            "limit": "5",
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
            .addField(`${maptitle} [${mapdiff}] +${mods} ${mapstar}`)
            .addField(`${mapacc} | ${hitcount} | ${mappp} | ${mapscore}`)
            .addField(`${mapgraph}`)
            // do this five times?
            .setFooter("");
        message.channel.send(embed)
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - rsplus")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
//        message.channel.send("I'm not an osu! bot. go use owobot or something")  
    }
}
//client.commands.get('').execute(message, args)