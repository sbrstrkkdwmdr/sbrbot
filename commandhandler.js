module.exports =(userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {
    client.on('messageCreate', async (message) => {
    
    let currentDate = new Date();
    let currentDateISO = new Date().toISOString();
    
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    
    if (!message.content.startsWith(prefix)) return; //the return is so if its just prefix nothing happens
    if (message.author.bot && message.content.includes("You're on cooldown")) {
        setTimeout(() => {
            message.delete();
        }, 1)
    }
    if (message.author.bot && !message.author.id == '755220989494951997') return;
    if (oncooldown.has(message.author.id)) {
        return message.channel.send(`You're on cooldown\nTime left: ${getTimeLeft(timeouttime)}ms (this is definitely the wrong number)`)
    };

    if (!oncooldown.has(message.author.id)) {
        oncooldown.add(message.author.id);
        setTimeout(() => {
            oncooldown.delete(message.author.id)
        }, 3000)
        timeouttime = setTimeout(() => { }, 3000)
    }
    function getTimeLeft(timeout) {
        return Math.ceil((timeout._idleStart + timeout._idleTimeout) / 1000);
    }

    switch(command){
        case 'ping':
            client.commands.get('ping').execute(message, userdata, Discord, osuApiKey, osuClientID, osuClientSecret, config);
            break;
    }


    })
}