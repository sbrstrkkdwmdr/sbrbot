const get = require('node-fetch2');
module.exports = {
    name: 'osutest',
    description: '',
    execute(message, args, Discord, fetch) {
        const pickeduserX = args[0]
        const pickedpageX = args[1]
        /*if(pickedpageX == 0){
            let pickedpage = 1
        } else {
            let pickedpage = args[1]
        }
        if(pickeduserX == 0){
            let pickeduser = 2
        } else {
            let pickeduser = args[0]
        }*/
        const url = new URL(
            `https://osu.ppy.sh/api/v2/users/2/scores/best/`
        );
        
        let params = {
            "limit": "5",
            "offset": `1`,
        };
        Object.keys(params)
            .forEach(key => url.searchParams.append(key, params[key]));
        
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        };
        
        get(url, {
            method: "GET",
            headers,
        }).then(response => response.json());

       /* let embed = new Discord.RichEmbed
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
        message.channel.send(embed)*/
//        message.channel.send("I'm not an osu! bot. go use owobot or something")  
    }
}
//client.commands.get('').execute(message, args)