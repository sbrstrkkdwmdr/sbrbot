import extypes = require('../types/extratypes');

const defaultClientConfig:extypes.config = {
    token: '',
    prefix: 'sbr-',
    osuClientID: '',
    osuClientSecret: '',
    osuApiKey: '',
    testGuildID: '',
    ownerusers: [],
    fileblockedusers: [],
    google: {
        apiKey: '',
        cx: '',
    },
    youtube: {
        apiKey: '',
    },
    twitch: {
        clientID: '',
        clientSecret: '',
    },
    useScreenshotParse: false,
    LogApiCalls: false,
}

const defaultGuildSettings: extypes.guildSettings = {
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

export { defaultClientConfig, defaultGuildSettings };
