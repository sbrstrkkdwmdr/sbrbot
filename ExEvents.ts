const checks = require('./configs/commandchecks')
import fs = require('fs');
import osuapiext = require('osu-api-extended');
import osumodcalc = require('osumodcalculator');
import fetch from 'node-fetch';

module.exports = (userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {

    //update oauth access token
    setInterval(() => {
        fetch('https://osu.ppy.sh/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
            ,
            body: JSON.stringify({
                grant_type: 'client_credentials',
                client_id: osuClientID,
                client_secret: osuClientSecret,
                scope: 'public'
            })

        }).then(res => res.json() as any)
            .then(res => {
                fs.writeFileSync('configs/osuauth.json', JSON.stringify(res))
            }
            )
    }, 10 * 60 * 1000);


/* 
    let osupp;
    (async () => {
        //await osuapiext.auth.authorize(osuClientID, osuClientSecret, '');

        osupp = osuapiext.tools.pp.calculate(1186443, osumodcalc.ModStringToInt('HDDT'), 412, 0, 96.95)
            .then(x => {
                console.log(x)
            })
    })(); */

}