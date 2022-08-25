const checks = require('./calc/commandchecks');
import fs = require('fs');
import osuapiext = require('osu-api-extended');
import osumodcalc = require('osumodcalculator');
import fetch from 'node-fetch';
import { OAuth } from './configs/osuApiTypes';

module.exports = (userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {

    //update oauth access token
   /*  setInterval(async () => {
        const newtoken: OAuth = await fetch('https://osu.ppy.sh/oauth/token', {
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
            .catch(error => {
                fs.appendFileSync(`logs/updates.log`,
                    `
        ----------------------------------------------------
        ERROR
        node-fetch error: ${error}
        ----------------------------------------------------
        `, 'utf-8')
            });
        if (newtoken.access_token) {
            fs.writeFileSync('configs/osuauth.json', JSON.stringify(newtoken))
            fs.appendFileSync('logs/updates.log', '\nosu auth token updated at ' + new Date().toLocaleString() + '\n')
        }

    }, 1 * 60 * 1000); */

    //clear maps folder
    try {
        fs.readdirSync('files/maps').forEach(file => {
            fs.unlinkSync('files/maps/' + file)
        }
        )
        fs.appendFileSync('logs/updates.log', '\nmaps folder cleared at ' + new Date().toLocaleString() + '\n')
    } catch (error) {
        fs.appendFileSync('logs/updates.log', '\n' + new Date().toLocaleString() + '\n' + error + '\n')
    }

    setInterval(() => {
        try {
            fs.readdirSync('files/maps').forEach(file => {
                fs.unlinkSync('files/maps/' + file)
            }
            )
            fs.appendFileSync('logs/updates.log', '\nmaps folder cleared at ' + new Date().toLocaleString() + '\n')
        } catch (error) {
            fs.appendFileSync('logs/updates.log', '\n' + new Date().toLocaleString() + '\n' + error + '\n')
        }
    }
        , 60 * 60 * 1000);



    //status updates
    const songsarr = [
        "Yomi Yori kikoyu, Koukoku no hi to Honoo no Shoujo [Kurushimi]",
        "FREEDOM DiVE [FOUR DiMENSIONS]",
        "A FOOL MOON NIGHT [Piggey's Destruction]",
        "Sidetracked Day [Infinity Inside]",
        "Cirno's Perfect Math Class [TAG4]",
        "Glorious Crown [FOUR DIMENSIONS]",
        "Made of Fire [Oni]",
        "小さな恋のうた (Synth Rock Cover) [Together]",
        "C18H27NO3(extend) [Pure Darkness]",
        "BLUE DRAGON [Blue Dragon]",
        "-ERROR [Drowning]",
        "Remote Control [Insane] +HDDT",
        "Usatei 2011 [Ozzy's Extra]",
        "Chocomint's made of fire hddt 98.54 full combo",
        "Ascension to Heaven [Death] +HDDTHR",
        "Can't Defeat Airman [Holy Shit! It's Airman!!!]",
        "The Big Black [WHO'S AFRAID OF THE BIG BLACK]"
    ]

    const activityarr = [
        {
            name: "240BPM | sbr-help",
            type: 1,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: songsarr[Math.floor(Math.random() * songsarr.length)] + " | sbr-help",//"Yomi Yori kikoyu, Koukoku no hi to Honoo no Shoujo | sbr-help",
            type: 2,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: "dt farm maps | sbr-help",
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: "nothing in particular | sbr-help",
            type: 3,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: "no mod farm maps | sbr-help",
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: "hr | sbr-help",
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: songsarr[Math.floor(Math.random() * songsarr.length)] + " | sbr-help",
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: "you | sbr-help",
            type: 3,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        }
    ]

    client.user.setPresence({
        activities: [activityarr[0]],
        status: 'dnd',
        afk: false
    });
    setInterval(() => {
        client.user.setPresence({
            activities: [activityarr[Math.floor(Math.random() * activityarr.length)]],
            status: 'dnd',
            afk: false
        });
    }, 60 * 1000);


    client.on('messageCreate', async (message) => {
        if (message.mentions.users.size > 0) {
            if (message.mentions.users.first().id == client.user.id && message.content.replaceAll(' ', '').length == (`<@${client.user.id}>`).length) {
                return message.reply({ content: `Prefix is \`${config.prefix}\``, allowedMentions: { repliedUser: false } })
            }
        }
        if (message.content.startsWith('You\'re on cooldown') && message.author.id == client.user.id) {
            setTimeout(() => {
                message.delete()
                    .catch(err => {
                    })
            }, 3000)
        }
    })


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