import Discord = require('discord.js');
import Sequelize = require('sequelize');
import embedStuff = require('../embed');
type config = {
    token: string,
    prefix: string,
    osuClientID: string,
    osuClientSecret: string,
    osuApiKey: string,
    ownerusers: string[],
    google: {
        apiKey: string,
        engineId: string
    },
    useScreenshotParse: boolean,
    LogApiCalls: boolean,
    LogApiCallsToFile: boolean,
    enableTracking: boolean,
}

type guildSettings = {
    guildid: number,
    guildname: string,
    prefix: string,
    osuParseLinks: boolean,
    osuParseScreenshots: boolean,
    osuParseReplays: boolean,
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
    id: number,
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

type commandType = 'message' | 'interaction' | 'button' | 'link' | 'other'

// type commandObject = any//Discord.Message | Discord.CommandInteraction | Discord.ButtonInteraction
type commandObject = Discord.Message<any> | Discord.ChatInputCommandInteraction<any> | Discord.ButtonInteraction<any>

type overrides = {
    user?: any,
    page?: number,
    mode?: string,
    sort?: embedStuff.scoreSort,
    reverse?: boolean,
    ex?: string | number,
    id?: string | number,
    overwriteModal?: Discord.SelectMenuComponent | Discord.SelectMenuBuilder,
    type?: string,
    commanduser?: Discord.User,
    commandAs: commandType,
} | null

type data = Sequelize.ModelStatic<any>

type commandInput = {
    commandType: commandType,
    obj: commandObject,
    args: string[],
    button?: commandButtonTypes,
    config?: config,
    client?: Discord.Client,
    absoluteID?: number,
    currentDate?: Date,
    overrides?: overrides,
    userdata?: data,
    trackDb?: data,
    guildSettings?: data,
}

type commandButtonTypes = 
'BigLeftArrow' | 'LeftArrow' | 'Search' | 'RightArrow' | 'BigRightArrow' |
'Refresh' | 'Select' | 'Random' |
'DetailEnable' | 'DetailDisable' | 'Detailed' | 'Details'

type osustatscache = {
    osuid: string,
    country: string,
    
    osupp: string,
    osurank: string,
    osuacc: string,

    taikopp: string,
    taikorank: string,
    taikoacc: string,

    fruitspp: string,
    fruitsrank: string,
    fruitsacc: string,

    maniapp: string,
    maniarank: string,
    maniaacc: string,
}

export {
    config,
    guildSettings,
    imagesearches,
    googleSearchItem,
    ytSearch,
    dbUser,
    commandType,
    commandObject,
    overrides,
    data,
    commandInput,
    osustatscache
};

