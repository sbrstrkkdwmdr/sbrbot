import extypes = require('../types/extratypes');

const defaultClientConfig: extypes.config = {
    token: '',
    prefix: 'sbr-',
    osuClientID: '',
    osuClientSecret: '',
    osuApiKey: '',
    ownerusers: [],
    google: {
        apiKey: '',
        engineId: '',
    },
    useScreenshotParse: false,
    LogApiCalls: false,
    enableTracking: true,
}

const defaultGuildSettings: extypes.guildSettings = {
    guildid: null,
    guildname: 'null',
    prefix: 'sbr-',
    osuParseLinks: true,
    osuParseScreenshots: true,
    osuParseReplays: true,
}

const chocoMOF = `chocomint's Made of Fire HDDT 98.54 full combo. Without a doubt, one of the most impressive plays ever set in osu! history, but one that takes some experience to appreciate fully. In the 12 years that this map has been ranked, chocomint's score remains the ONLY DT FC, and there's much more to unpack about this score. While some maps easily convey how difficult they are through the raw aim, or speed requirements, Made of Fire is much more nuanced than it may seem at first glance. To help illustrate just how difficult this play is, I would like to break down and analyze aspects of the map and the play itself. Right off the bat, we get a sense of the density of the notes, and the reading difficulty associated. With DT applied, the map becomes around 243 bpm, and approximately AR 9.67, a higher note density than most players are used to. Still, this should be manageable, but adding to the difficulty is the constant rhythm of, and spacing of the patterns which continues for the entire map. These would already pose a significant challenge to players' rhythm sense, reading, and finger control, but with hidden, the reading becomes MUCH harder. This is all bread and butter to someone like chocomint, who plays maps with similar patterns all the time, but everything we've gone over is just the beginning. Ask any top player what the hardest part of Made of Fire is, and they will all say the aim control. Many of the patterns in this map are continuous with strange velocity and angle changes, which need very fine adjustments in a player's aim to hit. None are more apparent than the various zig-zag patterns, which appear in the highest spacing sections. These require a player to aim to each note in a 1/4th beat time window, while potentially changing to an almost opposite direction. This is where chocomint shines, as almost no players have the level of aim control which he does. Bringing it all together is where the magic of this play really lies. DT alone makes the aim control barely in reach for any other player, but adding hidden makes these highly control-intensive patterns nearly impossible. Following the rhythm on such a map can be hard already as well, and trying to keep high accuracy, given the layout of the patterns, becomes ridiculous too. The real challenge is diverting focus between the aim aspect and the tapping aspects of the map, while keeping your reading in check as well. Keeping up with the map the entire way through to such a degree is exactly why chocomint's play is so astonishing. It's hard to put into words how much skill goes into a play like this, but to get an idea, I recommend trying the map for yourself. chocomint's HDDT score truly is in a league of its own when it comes to the aspects described earlier. Just over 2 years after it was set, some players are now approaching DT FCs, but not with nearly as high accuracy, and the majority lacking hidden. For now, it will remain a dream play for every top play, and a reality for chocomint. Hopefully this video has given you some more insight into, and appreciation of, one of osu!'s best plays of all time.`

const images = {
    user: {
        name: 'user',
        url: 'https://osu.ppy.sh/images/layout/avatar-guest@2x.png',
    },
    any: {
        name: 'any',
        url: 'https://cdn.discordapp.com/attachments/762455063922737174/1022133648578854912/blank.png'
    }
}

export { defaultClientConfig, defaultGuildSettings, chocoMOF, images };

