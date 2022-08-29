import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import calc = require('../../calc/calculations');
import emojis = require('../../configs/emojis');
import colours = require('../../configs/colours');
import osufunc = require('../../calc/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../configs/osuApiTypes');


module.exports = {
    name: 'osumaplink',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, parse, overrideID) {
        let prevmap;
        if (fs.existsSync(`./debugosu/prevmap${obj.guildId}.json`)) {
            try {
                prevmap = JSON.parse(fs.readFileSync(`./debugosu/prevmap${obj.guildId}.json`, 'utf8'));
            } catch {
                console.log(`no prevmap.json id found for server ${obj.guildId}\nCreating default file...`)
                fs.writeFileSync(`./debugosu/prevmap${obj.guildId}.json`, JSON.stringify(({ id: 32345 }), null, 2));
                prevmap = { id: 32345 }
            }
        } else {
            console.log(`no prevmap.json file for server ${obj.guildId}\nCreating default file...`)
            fs.writeFileSync(`./debugosu/prevmap${obj.guildId}.json`, JSON.stringify(({ id: 32345 }), null, 2));
            prevmap = { id: 32345 }
        }
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
COMMAND EVENT - map (link)
${currentDate} | ${currentDateISO}
recieved map link
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        const messagenohttp = message.content.replace('https://', '').replace('http://', '').replace('www.', '')
        const mapmods: string =
            message.content.includes('+') ?
                messagenohttp.split('+')[1] : 'NM';
        let mapid;
        if (
            (!messagenohttp.includes('/s/') && (messagenohttp.includes('/beatmapsets/') && messagenohttp.includes('#'))) ||
            (!messagenohttp.includes('/s/') && (messagenohttp.includes('/b/'))) ||
            (!messagenohttp.includes('/s/') && (messagenohttp.includes('/beatmaps/')))
        ) {
            let idfirst;
            try {
                if (messagenohttp.includes('beatmapsets')) {

                    idfirst = messagenohttp.split('#')[1].split('/')[1]
                } else if (messagenohttp.includes('?')) {
                    // osu.ppy.sh/beatmaps/4204?mode=osu
                    idfirst = messagenohttp.split('beatmaps/')[1].split('?')[0]
                }
                else {
                    //make a variable that takes everything after the last '/'
                    idfirst = messagenohttp.split('/')[messagenohttp.split('/').length - 1]
                }
                if (isNaN(idfirst)) {
                    mapid = idfirst.split(' ')[0]
                } else {
                    mapid = idfirst
                }
            } catch (error) {
                message.reply({
                    content: 'Please enter a valid beatmap link.',
                    allowedMentions: { repliedUser: false }
                })
                    .catch(error => { });
                return;
            }
        } else {
            let setid = 910392;
            if (!messagenohttp.includes('/beatmapsets/')) {
                setid = messagenohttp.split('/s/')[1]

                if (isNaN(setid)) {
                    setid = messagenohttp.split('/s/')[1].split(' ')[0]
                }
            } else if (!messagenohttp.includes('/s/')) {
                setid = messagenohttp.split('/beatmapsets/')[1]

                if (isNaN(setid)) {
                    setid = messagenohttp.split('/s/')[1].split(' ')[0]
                }
            }
            const bmsdata: osuApiTypes.Beatmapset = await osufunc.apiget('mapset_get', `${setid}`)
            try {
                mapid = bmsdata.beatmaps[0].id;
            } catch (error) {
                message.reply({
                    content: 'Please enter a valid beatmap link.',
                    allowedMentions: {
                        repliedUser: false
                    }
                })
                    .catch(error => { });
                return;
            }
        }

        const overrides = {
            mods: mapmods,
            id: mapid,
            detailed: false,
        }


        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}
mods: ${mapmods}
mapid: ${mapid}
----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
command diverting to map command
----------------------------------------------------
ID: ${absoluteID}
mods: ${mapmods}
mapid: ${mapid}
----------------------------------------------------
`, 'utf-8')
        client.osucmds.get('map').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
    }
}