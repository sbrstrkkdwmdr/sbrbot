const { access_token } = require('../configs/osuauth.json');

module.exports = {
    name: 'osu',
    description: 'Return information of a user\'s osu! profile',
    async execute(message, userdata, client, Discord, config, interaction) {
        if (message != null) { }

        if (interaction != null) {
            let user = interaction.options.getString('user')
            if (user.length < 1) {
                findname = await userdata.findOne({ where: { userid: interaction.member.user.id } })
                if (findname != null) {
                    user = findname.get('osuname');
                }
            }
            const userurl = `https://osu.ppy.sh/api/v2/users/${user}/osu`
            fetch(userurl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json())
                .then(osudata => {

                    let osustats = osudata.statistics
                    let grades = osustats.grade_counts

                    let playerrank = osudata.statistics.global_rank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    let countryrank = osudata.statistics.country_rank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                    if(playerrank == null) {
                        playerrank = '---'
                    }
                    if(countryrank == null) {
                        countryrank = '---'
                    }

                    let playerlasttoint = new Date(osudata.last_visit)

                    let currenttime = new Date()

                    let minsincelastvis = (playerlasttoint - currenttime) / (1000 * 60);
                    let minlastvis = Math.abs(minsincelastvis).toFixed(0);

                    let lastvishours = (Math.trunc(minlastvis / 60)) % 24;
                    let lastvisminutes = minlastvis % 60;
                    let lastvisdays = Math.trunc((minlastvis / 60) / 24) % 30;
                    let lastvismonths = Math.trunc(minlastvis / 60 / 24 / 30.437) % 12;
                    let lastvisyears = Math.trunc(minlastvis / 525600); //(60/24/30/12)
                    let minlastvisredo = (lastvisyears + "y " + lastvismonths + "m " + lastvisdays + "d | " + lastvishours + "h " + lastvisminutes + "m");
                    if (lastvisyears < 1) {
                        minlastvisredo = (lastvismonths + "m " + lastvisdays + "d | " + lastvishours + "h " + lastvisminutes + "m");
                    } //check if under an year
                    if (lastvismonths < 1) {
                        minlastvisredo = (lastvisdays + "d | " + lastvishours + "h " + lastvisminutes + "m");
                    } //check if under an month
                    if (lastvisdays < 1) {
                        minlastvisredo = (lastvishours + "h " + lastvisminutes + "m");
                    } //check if under an day
                    if (lastvishours < 1) {
                        minlastvisredo = (lastvisminutes + "m");
                    } //check if under an hour

                    let online = osudata.is_online;

                    let isonline = '`**<:osu_offline:927800829153513472> Offline**'

                    if (online == true) {
                        isonline = '**<:osu_online:927800818445455421> Online**'
                    }
                    else {
                        isonline = `**<:osu_offline:927800829153513472> Offline** | Last online ${minlastvisredo} ago`
                    }

                    let prevnames = osudata.previous_usernames;
                    if(prevnames.length > 0) {
                        let prevnameslist = '**Previous Usernames:**' + prevnames.join(', ');
                    }
                    else {
                        let prevnameslist = ''
                    }

                    const embed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`${osudata.username}'s osu! profile`)
                        .setURL(`https://osu.ppy.sh/users/${osudata.id}`)
                        .setThumbnail(`https://a.ppy.sh/${osudata.id}`)
                        .setDescription(`
                    **Global Rank:** ${playerrank} (#${countryrank} ${osudata.country_code} :flag_${osudata.country_code.toLowerCase()}:)\n
                    **pp:** ${osustats.pp}
                    **Accuracy:** ${(osustats.hit_accuracy).toFixed(2)}
                    **Play Count:** ${osustats.play_count}
                    **Level:** ${osustats.level.current}.${osustats.level.progress}
                    <:rankingxh:927797179597357076>${grades.ssh} <:rankingX:927797179832229948>${grades.ss} <:rankingSH:927797179710570568>${grades.sh} <:rankingS:927797179618295838> ${grades.s} <:rankingA:927797179739930634>${grades.a}
                    
                    **Player joined on** ${osudata.join_date.toString().slice(0, 10)}
                    **Followers:** ${osudata.follower_count}
                    ${prevnamelist}
                    ${isonline}
                    `)






                })

        }
    }
}