module.exports = {
    name: 'osutop',
    description: '',
    execute(message, args, Discord, currentDate) {
        let pickeduser = args[0]
        let pickedpageX = args[1]
        if(pickedpageX = 0){
            let pickedpage = 1
        } else {
            let pickedpage = args[1]
        }
        const url = new URL(
            `"https://osu.ppy.sh/api/v2/users/${pickeduser}/scores/best/`
        );
        
        let params = {
            "limit": "5",
            "offset": `${pickedpage}`,
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
        console.log(`${currentDate}`)
        console.log("command executed - osutop")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
//        message.channel.send("I'm not an osu! bot. go use owobot or something")  
    }
}
//client.commands.get('').execute(message, args)