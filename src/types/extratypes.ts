import * as Discord from 'discord.js';
import Sequelize from 'sequelize';
import * as embedStuff from '../embed.js';
import * as osuapitypes from '../types/osuApiTypes.js';

export type config = {
    important: {
        token: string,
        dbd_license: string,
        redirect_uri: string,
        client_secret: string,
        client_id: string,
    },
    prefix: string,
    osuClientID: string,
    osuClientSecret: string,
    osuApiKey: string,
    ownerusers: string[],
    google: {
        apiKey: string,
        engineId: string;
    },
    useScreenshotParse: boolean,
    LogApiCalls: boolean,
    LogApiCallsToFile: boolean,
    enableTracking: boolean,
    storeCommandLogs: boolean,
    useEmojis: {
        gamemodes: boolean,
        scoreGrades: boolean,
        mods: boolean,
    };
};

export type guildSettings = {
    guildid: number | string,
    guildname: string,
    prefix: string,
    osuParseLinks: boolean,
    osuParseScreenshots: boolean,
    osuParseReplays: boolean,
};

export type imagesearches = {
    kind: string,
    url: {
        type: string,
        template: string;
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
            cx: string;
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
            cx: string;
            searchType: string,
        }[];
    },
    context: {
        title: string;
    },
    searchInformation: {
        searchTime: number,
        formattedSearchTime: string,
        totalResults: string,
        formattedTotalResults: string;
    },
    items: googleSearchItem[];
};

export type googleSearchItem = {
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
        thumbnailWidth: number;
    };
};

export type ytSearch = {
    all?: ytSearchItem[],
    videos?: ytSearchVideo[],
    live?: ytSearchLive[],
    playlists?: ytSearchPlaylist[],
    lists?: ytSearchList[],
    channels?: ytSearchChannel[],
    accounts?: ytSearchAccount[],
};

export type ytSearchItem = ytSearchVideo | ytSearchChannel;
export type ytSearchVideo = {
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
        timestamp: string;
    },
    ago: string,
    views: number,
    author: {
        name: string,
        url: string,
    };
};

export type ytSearchPlaylist = {
    type: string,
};

export type ytSearchChannel = {
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
};

export type ytSearchLive = any;//{}

export type ytSearchAccount = any;

export type ytSearchList = any;//{}


export type dbUser = {
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
};

export type commandType = 'message' | 'interaction' | 'button' | 'link' | 'other';

// type commandObject = any//Discord.Message | Discord.CommandInteraction | Discord.ButtonInteraction
export type commandObject = Discord.Message<any> | Discord.ChatInputCommandInteraction<any> | Discord.ButtonInteraction<any>;

export type overrides = {
    user?: any,
    page?: number,
    mode?: osuapitypes.GameMode,
    sort?: embedStuff.scoreSort,
    reverse?: boolean,
    ex?: string | number,
    id?: string | number,
    overwriteModal?: Discord.SelectMenuComponent | Discord.SelectMenuBuilder,
    type?: string,
    commanduser?: Discord.User,
    commandAs?: commandType,
    filterMapper?: string,
    filterMods?: string,
    miss?: true,
} | null;

export type data = Sequelize.ModelStatic<any>;

export type commandInput = {
    commandType: commandType,
    obj: commandObject,
    args: string[],
    canReply: boolean,
    button?: commandButtonTypes,
    config?: config,
    client?: Discord.Client,
    absoluteID?: number | string,
    currentDate?: Date,
    overrides?: overrides,
    userdata?: data,
    trackDb?: data,
    guildSettings?: data,
};

export type commandButtonTypes =
    'BigLeftArrow' | 'LeftArrow' | 'Search' | 'RightArrow' | 'BigRightArrow' |
    'Refresh' | 'Select' | 'Random' |
    'DetailEnable' | 'DetailDisable' | 'Detailed' | 'Details' |
    'DetailDefault' | 'DetailMore' | 'DetailLess' |
    'Detail0' | 'Detail1' | 'Detail2' | 'Detail3' |
    'DetailN1' |
    'Graph' |
    'SearchMenu' | 'Sort' | 'SortMenu' |
    'Map' | 'Leaderboard' |
    'User' |
    'Scores' |
    'Weather' |
    'Time'
    ;

export type osustatscache = {
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
};

export type osuCmdStyle =
    'A' | //default
    'C' | //compressed    
    'E' | //expanded
    'L' | //default list    
    'LE' | //expanded list   
    'LC' | //compressed list
    'S' | //score    
    'SC' | //score compressed
    'SE' | //score expanded
    'M' | //map
    'MC' | //map compressed
    'ME' |//map expanded
    'MP' | //map pp calc
    'P' | // profile
    'PE' | // profile expanded
    'PC' | // profile compressed
    'G'; // graph

export type replay = {
    gameMode: number,
    gameVersion: number,
    beatmapMD5: string,
    playerName: string,
    replayMD5: string,
    number_300s: number,
    number_100s: number,
    number_50s: number,
    gekis: number,
    katus: number,
    misses: number,
    score: number,
    max_combo: number,
    perfect_combo: number,
    mods: number,
    life_bar: string,
    timestamp: string,
    replay_length: number,
    replay_data: {
        timeSinceLastAction: number,
        x: number,
        y: number,
        keyPressedBitWise: number,
        keysPressed: {
            K1: boolean,
            K2: boolean,
            M1: boolean,
            M2: boolean;
        };
    }[],
    raw_replay_data: string;
};

export type SortedScore = {
    index: number,
    score: osuapitypes.Score;
};

export type reminder = {
    time: number,
    text: string,
    userID: string,
};