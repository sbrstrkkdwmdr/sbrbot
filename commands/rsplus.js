module.exports = {
    name: 'rsplus',
    description: '',
    execute(message, args, Discord) {
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

        const embed = require ("response.json");

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
//        message.channel.send("I'm not an osu! bot. go use owobot or something")  
    }
}
//client.commands.get('').execute(message, args)