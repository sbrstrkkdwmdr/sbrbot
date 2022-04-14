const fetch = require('node-fetch')
const { access_token } = require('../debug/osuauth.json');

const userinfourl = `https://osu.ppy.sh/api/v2/users/15222484/osu`;
            
fetch(userinfourl, {
    headers: {
        Authorization: `Bearer ${access_token}`
    }
}).then(res => res.json())
.then(user => {

    console.log(user)
})