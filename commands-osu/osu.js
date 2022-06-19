const { access_token } = require('./configs/osuauth.json');

module.exports = {
    name: 'osu',
    description: 'Return information of a user\'s osu! profile',
    async execute(message, userdata, client, Discord, config, interaction) {
        if (message != null) { }

        if (interaction != null) {
            let user = interaction.options.getString('user');
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
                }}).then(res => res.json())
                .then(osudata => {
                
                    let playerrank = osudata.statistics.global_rank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    let countryrank = osudata.statistics.country_rank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                    if(playerrank == null) {
                        playerrank = '---'
                    }
                    if(countryrank == null) {
                        countryrank = '---'
                    }
                    
                    let osuembed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`${osudata.username}'s osu! profile`)
                    .setURL(`https://osu.ppy.sh/users/${osudata.user_id}`)
                    .setThumbnail(`https://a.ppy.sh/${osudata.user_id}`)
                    

                    
                })

        }
    }
}