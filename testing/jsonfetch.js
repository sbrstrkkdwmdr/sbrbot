const { access_token } = require('../osuauth.json')
let playerid = 15222484
const fetch = require('node-fetch');

const recentactiveurl = `https://osu.ppy.sh/api/v2/users/15222484/osu/`;
                
fetch(recentactiveurl, {
    headers: {
        Authorization: `Bearer ${access_token}`
    }
}).then(res => {res.json()
console.log(res)
})