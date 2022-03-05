const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { std_ppv2, taiko_ppv2, catch_ppv2, mania_ppv2 } = require('booba');
const { access_token } = require('../debug/osuauth.json');
let maphash = '527bc63f13471981010066ad57d75a02'
const mapurl = `https://osu.ppy.sh/api/v2/beatmaps/lookup?checksum=${maphash}`
fetch(mapurl, {
    method: "GET",
    headers: {
        Authorization: `Bearer ${access_token}`
    }
})
.then(res => res.json())
.then(output3 => {
    const mapdata = output3;
    console.log(mapdata)
})