
module.exports = {
    name: 'hentai',
    execute(message, args, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        if(message.channel.nsfw) {
            let searchingfor = args[0];
            if(!searchingfor){
        let pp = Math.floor(Math.random () * 1000000 + 1)
        message.channel.send(`https://nhentai.net/g/${pp}`)}
            /*//else{
                try {
                    const api = new API();
 
                    api.search(searchingfor) 
                    .then(res => res.json())
                    .then(out =>
                {        out.sort((a, b) => b.pp - a.pp);
                });
                } catch(error) {console.log(error)}
            //}*/
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - hentai")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
        else {
            message.channel.send("this channel is not NSFW")
            console.log(`${currentDateISO} | ${currentDate}`)   
            console.log("command executed - hentai")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("command failed - non NSFW channel")
            console.log("")
        }
        console.groupEnd()
    }
}