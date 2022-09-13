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

type ytSearch = {
    all?: ytSearchItem[],
    videos?: ytSearchVideo[],
    live?: ytSearchLive[],
    playlists?: ytSearchPlaylist[],
    lists?: ytSearchList[],
    channels?: ytSearchChannel[],
    accounts?: ytSearchAccount[],
}

type ytSearchItem = ytSearchVideo | ytSearchChannel
type ytSearchVideo = {
    type: string,
    videoId: string,
    url: string,
    title: string,
    description: string,
    image: string,
    thumbnail: string,
    seconds: number,
    timestamp: string,
    duration: {
        seconds: number,
        timestamp: string
    },
    ago: string,
    views: number,
    author: {
        name: string,
        url: string,
    }
}

type ytSearchPlaylist = {
    type: string,
}

type ytSearchChannel = {
    type: string,
    name: string,
    url: string,
    title: string,
    image: string,
    thumbnail: string,
    videoCount: number,
    videoCountLabel: string,
    subCount: number,
    subCountLabel: string,
}

type ytSearchLive = any//{}

type ytSearchAccount = any

type ytSearchList = any//{}


type dbUser = {
    id:number,
    userid: number,
    osuname: string,
    mode: string,
    osuacc: number,
    osupp: number,
    osurank: number,
    taikoacc: number,
    taikopp: number,
    taikorank: number,
    fruitsacc: number,
    fruitspp: number,
    fruitsrank: number,
    maniaacc: number,
    maniapp: number,
    maniarank: number,
}


export { config, guildSettings, imagesearches, googleSearchItem, ytSearch, dbUser }

