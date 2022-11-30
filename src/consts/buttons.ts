import Discord from 'discord.js';
export const type = {
    current: Discord.ButtonStyle.Secondary,
    next: Discord.ButtonStyle.Primary,
};
// Discord.ButtonStyle.Danger //red
// Discord.ButtonStyle.Link //link
// Discord.ButtonStyle.Primary //blue
// Discord.ButtonStyle.Secondary //grey
// Discord.ButtonStyle.Success //green


export const label = {
    page: {
        first: '<:first:1025231767067689001>',
        previous: '<:previous:1025231772943913040>',
        search: '🔍',
        next: '<:next:1025231771262001182> ',
        last: '<:last:1025231769361989642>',
    },
    main: {
        refresh: '<:refresh:1025233415383031918>',
        detailed: '📝',
        detailDefault: '',
        detailLess: '',
        random: '🎲'
    },
    page_old: {
        first: '⬅',
        previous: '◀',
        search: '🔍',
        next: '▶',
        last: '➡',
    },
}

