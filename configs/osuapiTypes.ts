//compare
//firsts = userdata, scoredata[]
//leaderboard = mapdata, scoredata[]
//map = mapdata
//osu = userdata
//osutop = userdata, scoredata[]
//pinned = userdata, scoredata[]
//rs = userdata, scoredata[],
//scores = userdata, scoredata[], mapdata

//types using osu api v2 2022-08-18
//these are all custom names
type hitstats = {
    statistics: {
        count_100: number | null,
        count_300: number | null,
        count_50: number | null,
        count_geki: number | null,
        count_katu: number | null,
        count_miss: number | null
    },
}
type beatmapData = {

}
type beatmapDataCompact = {

}
type userData = {

}
type userDataCompact = {
    avatar_url: string | null,
    country_code: string | null,
    default_group: string | null,
    id: number | null,
    is_active: boolean | null,
    is_bot: boolean | null,
    is_deleted: boolean | null,
    is_online: boolean | null,
    is_supporter: boolean | null,
    last_visit: string | null,
    pm_friends_only: boolean | null,
    profile_colour: any | null,
    username: string | null,
}
type scoreData = {
    accuracy: number | null,
    best_id: number | null,
    created_at: string | null,
    id: number | null,
    max_combo: number | null,
    mode: string | null,
    mode_int: number | null,
    mods: string[],
    passed: boolean | null,
    perfect: boolean | null,
    pp: number | null,
    rank: string | null,
    replay: boolean | null,
    score: number | null,
    hitstats,
    user_id: number | null
    current_user_attributes: {
        pin: boolean | null
    },
    beatmapDataCompact,
    beatmapsetDataCompact,
    userDataCompact
}
type scoreDataCompact = {

}
type replayData = {

}
type beatmapsetData = {

}
type beatmapsetDataCompact = {
    artist: string | null,
    artist_unicode: string | null,
    covers: {
        cover: string | null,
        'cover@2x': string | null,
        card: string | null,
        'card@2x': string | null,
        list: string | null,
        'list@2x': string | null,
        slimcover: string | null,
        'slimcover@2x': string | null,
    },
    creator: string | null,
    favourite_count: number | null,
    hype: number | null,
    id: number | null,
    nsfw: boolean | null,
    offset: number | null,
    play_count: number | null,
    preview_url: string | null,
    source: string | null,
    spotlight: boolean | null,
    status: string | null,
    title: string | null,
    title_unicode: string | null,
    track_id: number | null,
    user_id: number | null,
    video: boolean | null,
}
type mapAttributeData = {

}
