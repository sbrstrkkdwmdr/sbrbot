module.exports = {
    name: 'image',
    description: 'Search images through google images',
    async execute(message, args, Discord, get, client, currentDate, currentDateISO) {
        //message.channel.send("WIP")
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - image")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
       if (!args.length) return message.channel.send('Please specify the name of the image you want to search.')
        
        // Note that ephemeral messages are only available with Interactions, so we can't make the response here as an ephemeral.
        // Meaning People can search dirty things and the image will be seen by everyone, It's up to you on how you can make this safe.

        const GOOGLE_CX = "63d911bec99d0c63c"
        const GOOGLE_KEY = "AIzaSyADArGVmH3N3uUcJ2AxfFxIY2fgLSbxk9g"
        
        const cx = process.env.GOOGLE_CX // Watch the video to get your google cx.
        const key = process.env.GOOGLE_KEY // Watch the video to get your google api key.
        let searchthing = args.splice(0,100).join(" ")

        let res = await get(
            `https://customsearch.googleapis.com/customsearch/v1?q=${searchthing}&cx=${cx}&key=${key}&searchType=image`
        ).catch(e => console.log(e));
        
        if (!res) return message.channel.send('Unable to fetch the requested image.');
        if (res.status >= 400) return message.channel.send(`Error ${res.status}: ${res.statusText}`);

        res = await res.json();
        if (!res.items?.length) return message.channel.send('No results found.');

        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setImage(res.items[0].link)
                    .setTitle(`Image result for ${searchthing}`)
            ]
        });
    }
}