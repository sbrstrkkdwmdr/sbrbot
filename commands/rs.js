module.exports = {
    name: 'rs',
    description: '',
    execute(message, args, Discord) {
        const url = new URL(
            "https://osu.ppy.sh/api/v2/users/1/recent_activity"
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
            .setAuthor("")
            .setColor("")
            .addField("username")
            .addField("beatmap info here")
            .addField("hits" + "pp")
            .addField("graph")
            .setFooter("");
        message.channe.send(embed)
//        message.channel.send("I'm not an osu! bot. go use owobot or something")  
    }
}
//client.commands.get('').execute(message, args)