
export function noUser(name: string) {
    return `Error - could not find user "${name}"`;
}

export const genError = `Bot skill issue - something went wrong.`;

export const apiError = `Something went wrong with the osu! api.`;

export const osuTrackApiError = `Something went wrong with the osu!track api.`;

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
            mostplayed: 'Could not find the user\'s most played beatmaps',
            rsact: 'Could not find the user\'s recent activity'
        },
        rankings: 'Could not fetch rankings',
        datamissing: 'Missing data',
        map: {
            lb: 'Could not find leaderboards for [ID]',
            m: 'Could not find beatmap [ID]',
            m_uk: 'Could not find the requested beatmap',
            ms: 'Could not find beatmapset [ID]',
            search: 'Beatmap search failed',
            search_nf: 'No beatmaps found with args "[INPUT]"',
            setonly: 'No beatmaps found in beatmapset [ID]',
            strains: 'Could not calculate map\'s strains',
            strains_graph: 'Could not produce strains graph',
            unranked: 'Beatmap is unranked',
            url: 'Invalid URL given',
        },
        score: {
            nf: 'Could not find the requested score',
            wrong: 'Score is invalid/unsubmitted and cannot be parsed',
            nd: 'Could not find score data for [SID] in [MODE]'
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
            map: 'Could not find the [ID]\'s scores on beatmap [MID]',
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
        }
    },
    admin: {
        channel: {
            msid: 'Invalid channel id'
        }
    }
};