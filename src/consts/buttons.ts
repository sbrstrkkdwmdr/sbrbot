import * as Discord from 'discord.js';
export const type = {
    current: Discord.ButtonStyle.Secondary,
    next: Discord.ButtonStyle.Primary,
};
// Discord.ButtonStyle.Danger //red
// Discord.ButtonStyle.Link //link
// Discord.ButtonStyle.Primary //blue
// Discord.ButtonStyle.Secondary //grey
// Discord.ButtonStyle.Success //green

// files/img/button/(x).png
export const label = {
    page: {
        first: '<:first:1025231767067689001>',
        previous: '<:previous:1025231772943913040>',
        search: '<:page_select:1058600589690409040>',
        next: '<:next:1025231771262001182> ',
        last: '<:last:1025231769361989642>',
    },
    main: {
        refresh: '<:refresh:1025233415383031918>',
        detailed: '<:details_default:1058601386935332974>',
        detailDefault: '<:details_default:1058601386935332974>',
        detailMore: '<:details_more:1136617552026550393>',
        detailLess: '<:details_less:1136617548230709249>',
    },
    extras: {
        random: '<:random:1058601388965363772>', //🎲
        graph: '<:graph:1058600585525469274>', //'📈',
        map: '<:map:1058600587274494064>', //🗺
        user: '<:user:1057463807930277988>',
        leaderboard: '<:leaderboard:1057463857305632908>',
        time: '<:time:1174306276637941810>',
        weather: '<:weather:1174306274637258782>'
    },
}

