import ws = require('ws');
const fs = require('fs');
module.exports = (userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {
    const accessN = fs.readFileSync('configs/osuauth.json', 'utf-8');
    const access_token = JSON.parse(accessN).access_token;

/*     let osutrackclient = new ws.WebSocket('ws://osu.ppy.sh/api/v2', {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    });
    osutrackclient.on('new', a => {
        console.log(a);
    }) */



}