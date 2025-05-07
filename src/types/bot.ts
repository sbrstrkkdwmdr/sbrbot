import Discord from 'discord.js';
import * as apitypes from '../types/osuapi.js';

export type commandInfo = {
    name: string,
    description: string,
    category: 'general' | 'osu_scores' | 'osu_map' | 'osu_profile' | 'osu_track' | 'osu_other' | 'misc' | 'admin';
    usage: string, //name <required arg> [optional arg]
    linkUsage?: string[], // eg. website.com/<page_id>
    aliases: string[],
    examples?: { text: string, description: string; }[],  // "cmd 1", "does x 1 time"
    args?: commandInfoOption[],
};

export type commandInfoOption = {
    name: string,
    description: string,
    type: string, // string, bool, int, etc.
    format: string[],
    options?: string[],
    required: string | boolean,
    defaultValue: string,
};

/**
 * c = new command(input)
 * c.parseArgs();
 * c.execute();
 * args are meant to be a key-value object
 * eg.
 * 
 */

export type args = {
    name: string,
    value: any,
};


export type commandInput = {
    message?: Discord.Message,
    interaction?: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
    args: string[],
    id: number | string,
    date: Date,
    overrides: overrides,
    canReply: boolean,
    type: "message" | "interaction" | "link" | "button" | "other", // "other" is for special cases where arg handling needs to be bypassed eg. scores from scorelist commands
    buttonType?: buttonType;
};

export type overrides = {
    user?: any,
    page?: number,
    mode?: apitypes.GameMode,
    sort?: string,
    reverse?: boolean,
    ex?: string | number,
    id?: string | number,
    overwriteModal?: Discord.SelectMenuComponent | Discord.SelectMenuBuilder,
    type?: string,
    commanduser?: Discord.User | Discord.APIUser,
    commandAs?: "message" | "interaction" | "link" | "button" | "other",
    filterMapper?: string,
    filterMods?: string,
    miss?: true,
} | null;

export type buttonType = 'BigLeftArrow' | 'LeftArrow' | 'Search' | 'RightArrow' | 'BigRightArrow' |
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
    'Time';

export type config = {
    token: string,
    osu: {
        clientId: string,
        clientSecret: string;
    },
    prefix: string,
    owners: string[],
    tenorKey: string,
    enableTracking: boolean,
    logs: {
        console: boolean,
        file: boolean,
    };
};

export type command = (input: commandInput) => Promise<void>;

export type reminder = {
    time: number,
    text: string,
    userID: string,
};

export type scoreSort = 'pp' | 'score' | 'acc' | 'recent' | 'combo' | 'miss' | 'rank' | 'bpm';
export type userSort = 'pp' | 'rank' | 'acc' | 'playcount' | 'level' | 'joindate' | 'countryrank' | 'countrypp' | 'score' | 'score_ranked';
export type mapSort = 'title' | 'artist' |
    'difficulty' | 'status' | 'rating' |
    'fails' | 'plays' |
    'dateadded' | 'favourites' | 'bpm' |
    'cs' | 'ar' | 'od' | 'hp' | 'length';
export type ubmFilter = 'favourite' | 'graveyard' | 'loved' | 'pending' | 'ranked' | 'nominated' | 'guest' | 'most_played';
export type ubmSort = 'title' | 'artist' |
    'difficulty' | 'status' |
    'fails' | 'plays' |
    'dateadded' | 'favourites' | 'bpm' |
    'cs' | 'ar' | 'od' | 'hp' | 'length';