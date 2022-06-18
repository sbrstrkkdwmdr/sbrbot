module.exports =(userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {
    client.on('messageCreate', async (message) => {
   
        let messagenohttp = message.content.replace('https://', '').replace('http://', '').replace('www.', '')
        if(messagenohttp.startsWith('osu.ppy.sh/b/') || messagenohttp.startsWith('osu.ppy.sh/beatmaps/') || messagenohttp.startsWith('osu.ppy.sh/beatmapsets/') || messagenohttp.startsWith('osu.ppy.sh/s/')) {
            client.links.get('osumaplink').execute(message, userdata, Discord, osuApiKey, osuClientID, osuClientSecret, config);
        }
        if(messagenohttp.startsWith('osu.ppy.sh/u/') || messagenohttp.startsWith('osu.ppy.sh/users/')) {
            client.links.get('osuuserlink').execute(message, userdata, Discord, osuApiKey, osuClientID, osuClientSecret, config);
        }
        
        if(message.attachments.size > 0 && message.attachments.every(attachment => attachment.url.endsWith('.osr'))) {
            client.links.get('replayparse').execute(message, userdata, Discord, osuApiKey, osuClientID, osuClientSecret, config);
        }
    })
}