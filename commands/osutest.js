const fetch = require('node-fetch');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const xhr = new XMLHttpRequest();
const POST = require('node-fetch');
module.exports = {
    name: 'osutest',
    description: '',
    execute(message, args, Discord, fetch, currentDate, currentDateISO) {
        const pickeduserX = args[0];
        const osutrackthingy = new XMLHttpRequest();
        osutrackthingy.open(POST, `https://osutrack-api.ameo.dev/update?user=${pickeduserX}&mode={0}`)
        osutrackthingy.setRequestHeader('Content-type', 'application/json');
        message.channel.send(JSON.stringify(osutrackthingy))

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
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - osutest")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")    
}
}
//client.commands.get('').execute(message, args)