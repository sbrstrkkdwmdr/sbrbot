type config = {
    token: string,
    prefix: string,
    osuClientID: string | number,
    osuClientSecret: string,
    osuApiKey: string,
    testGuildID: string,
    ownerusers: string[],
    fileblockedusers: string[],
    google: {
        apiKey: string,
        cx: string
    },
    youtube: {
        apiKey: string
    },
    twitch: {
        clientID: string,
        clientSecret: string
    },
    useScreenshotParse: boolean,
    LogApiCalls: boolean,
}

type guildSettings = {
    serverName: string,
    prefix: string,
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

const defaultSettings: guildSettings = {
    serverName: "Server Name",
    prefix: 'sbr-',
    enabledModules: {
        admin: false,
        osu: true,
        general: true,
        links: true,
        misc: true,
        music: true,
    },
    admin: {
        basic: 'n',
        limited: false,
        channels: [],
        log: {
            messageUpdates: true,
            guildUpdates: true,
            channelUpdates: true,
            roleUpdates: true,
            emojiUpdates: true,
            userUpdates: true,
            presenceUpdates: false,
            voiceUpdates: true,
        }
    },
    osu: {
        basic: 'n',
        limited: false,
        channels: [],
        parseLinks: true,
        parseReplays: true,
        parseScreenshots: true,
    },
    general: {
        basic: 'n',
        limited: false,
        channels: []
    },
    misc: {
        basic: 'n',
        limited: false,
        channels: []
    },
    music: {
        basic: 'n',
        limited: false,
        channels: []
    }
}


export { config, guildSettings, defaultSettings }

