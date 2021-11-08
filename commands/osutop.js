module.exports = {
    name: 'osutop',
    description: '',
    execute(message, args, Discord) {
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
            .addField(`${maptitle1} [${mapdifficulty1}] | ${scorepp1}`)
            .addField(`${maptitle2} [${mapdifficulty2}] | ${scorepp2}`)
            .addField(`${maptitle3} [${mapdifficulty3}] | ${scorepp3}`)
            .addField(`${maptitle4} [${mapdifficulty4}] | ${scorepp4}`)
            .addField(`${maptitle5} [${mapdifficulty5}] | ${scorepp5}`)
            .setFooter("");
        message.channel.send(embed)
//        message.channel.send("I'm not an osu! bot. go use owobot or something")  
    }
}
//client.commands.get('').execute(message, args)