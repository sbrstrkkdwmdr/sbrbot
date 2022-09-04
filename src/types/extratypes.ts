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

type imagesearches = {
    kind: string,
    url: {
        type: string,
        template: string
    },
    queries: {
        request: {
            title: string,
            totalResults: string,
            searchTerms: string,
            count: number,
            startIndex: number,
            inputEncoding: string,
            outputEncoding: string,
            safe: string,
            cx: string
            searchType: string,
        }[],
        nextPage: {
            title: string,
            totalResults: string,
            searchTerms: string,
            count: number,
            startIndex: number,
            inputEncoding: string,
            outputEncoding: string,
            safe: string,
            cx: string
            searchType: string,
        }[]
    },
    context: {
        title: string
    },
    searchInformation: {
        searchTime: number,
        formattedSearchTime: string,
        totalResults: string,
        formattedTotalResults: string
    },
    items: googleSearchItem[]
}

type googleSearchItem = {
    kind: string,
    title: string,
    htmlTitle: string,
    link: string,
    displayLink: string,
    snippet: string,
    htmlSnippet: string,
    mime: string,
    fileFormat: string,
    image?: {
        contextLink: string,
        height: number,
        width: number,
        byteSize: number,
        thumbnailLink: string,
        thumbnailHeight: number,
        thumbnailWidth: number
    }
}

export { config, guildSettings, imagesearches }

