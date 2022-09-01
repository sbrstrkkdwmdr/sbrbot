type config = {

}

type guildSettings = {
    enabledModules: {
        admin: boolean,
        osu: boolean,
        general: boolean,
        links: boolean,
        misc: boolean,
        music: boolean,
    },
    admin: {
        basic: string,
        limited: boolean,
        channels: string[],
        log: {
            messageUpdates: boolean,
            guildUpdates: boolean,
            channelUpdates: boolean,
            roleUpdates: boolean,
            emojiUpdates: boolean,
            userUpdates: boolean,
            presenceUpdates: boolean,
            voiceUpdates: boolean,
        }
    },
    osu: {
        basic: string,
        limited: boolean,
        channels: string[],
        parseLinks: boolean,
        parseReplays: boolean,
        parseScreenshots: boolean,
    },
    general: {
        basic: string,
        limited: boolean,
        channels: string[],
    },
    misc: {
        basic: string,
        limited: boolean,
        channels: string[],
    },
    music: {
        basic: string,
        limited: boolean,
        channels: string[],
    }

}



export { config, guildSettings };

