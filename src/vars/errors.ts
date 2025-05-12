
export function noUser(name: string) {
    return `Error - could not find user "${name}"`;
}

export const genError = `Bot skill issue - something went wrong.`;

export const apiError = `Something went wrong with the osu! api.`;

export const osuTrackApiError = `Something went wrong with the osu!track api.`;

export const timeout = `The connection timed out`;

export const paramFileMissing = `This command has expired and the buttons can no longer be used.\nCommands will automatically expire after 24h of not being used.`;

export function anyError() {
    const errs = [
        'Bot is having a skill issue lol.',
        'Error - AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        'Error - something went wrong.',
        'Error - ????????!?!??!',
    ];

    return errs[Math.floor(Math.random() * errs.length)];
}

/**
 * @owo suck my balls
 * @returns {string}
 */
export const uErr = {
    osu: {
        profile: {
            user: 'Could not find user [ID]',
            user_msp: 'No previous user id found in this guild',
            mostplayed: 'Could not find the user\'s most played beatmaps',
            rsact: 'Could not find the user\'s recent activity',
            nf: 'Could not find the requested user'
        },
        rankings: 'Could not fetch rankings',
        datamissing: 'Missing data',
        rsact: 'Could not fetch recent activity',
        map: {
            lb: 'Could not find leaderboards for [ID]',
            m: 'Could not find beatmap [ID]',
            m_msp: 'No previous map id found in this guild',
            m_uk: 'Could not find the requested beatmap',
            ms: 'Could not find beatmapset [ID]',
            ms_md5: 'Could not find beatmap with the hash [ID]',
            search: 'Beatmap search failed',
            search_nf: 'No beatmaps found with args "[INPUT]"',
            setonly: 'No beatmaps found in beatmapset [ID]',
            strains: 'Could not calculate map\'s strains',
            strains_graph: 'Could not produce strains graph',
            unranked: 'Beatmap is unranked',
            url: 'Invalid URL given',
            group_nf: 'Could not find [TYPE] beatmaps'
        },
        score: {
            nf: 'Could not find the requested score',
            wrong: 'Score is invalid/unsubmitted and cannot be parsed',
            nd: 'Could not find score data for [SID] in [MODE]',
            msp: 'No previous score id found in this guild',
            ms: 'Missing arg <SCORE ID>'
        },
        scores: {
            pinned: 'Could not find the [ID]\'s pinned scores',
            pinned_ms: '[ID] has no pinned scores',
            best: 'Could not find the [ID]\'s top scores',
            best_ms: '[ID] has no top scores',
            recent: 'Could not find the [ID]\'s recent scores',
            recent_ms: '[ID] has no recent [MODE] scores',
            first: 'Could not find the [ID]\'s #1 scores',
            first_ms: '[ID] has no #1 scores',
            map: 'Could not find [ID]\'s scores on beatmap [MID]',
            map_ms: '[ID] has no scores on beatmap [MID]',
        },
        performance: {
            mapMissing: 'Could not find the .osu file for beatmap [ID]',
            crash: 'Could not calculate the map\'s pp'
        },
        set: {
            mode: 'Invalid mode given',
        },
        tracking: {
            channel_ms: 'The current server/guild does not have a tracking channel',
            nullUser: 'Missing <user> argument',
            channel_wrong: 'You can only use this command in <#[CHID]>',
        }
    },
    admin: {
        channel: {
            msid: 'Invalid channel id'
        },
        purge: {
            msc: 'Missing arg [COUNT]',
            unf: 'Could not find user with id [ID]',
            fail: 'There was an error trying to delete [COUNT] message(s)',
            failTime: 'You cannot purge messages over 14 days old'
        }
    },
    weather: {
        api: "Something went wrong with the open-meteo api",
        locateNF: "The requested location was not found",
        wrongCoords: "Something went wrong with the open-meteo api (NaN coordinates)",
        input_ms: "Missing <region> argument",
        stormNF: "Data for [SID] was not found"
    },
    country: {
        api: 'Something went wrong with the RESTcountries api',
        nf: 'The country [ID] was not found. Maybe try other names/params',
        ms: 'Missing <search> argument'
    },
    arg: {
        ms: 'Missing arg [ID]',
        type: 'arg [ID] is the wrong type',
        nf: 'Could not find arg [ID]',
        inaccess: 'Could not find [TYPE] with id [ID]'
    },
    conv: {
        input: 'Input is an invalid type',
        output: 'Output is an invalid type'
    }
};