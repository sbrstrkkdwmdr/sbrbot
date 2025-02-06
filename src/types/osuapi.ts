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
//https://osu.ppy.sh/docs/index.html?javascript
//anything using "any" as it's type means that I haven't figured out the type yet (not all types are documented on the API)
//some properties aren't documented on the API, but I've written down everything I've seen so far

//==============================================================================================================================================================================================

export type BeatmapCompact = {
    beatmapset_id: number,
    beatmapset?: BeatmapsetCompact,
    checksum?: string | null,
    difficulty_rating: number,
    failtimes: Failtimes;
    id: number,
    max_combo?: number,
    mode: GameMode,
    status: string,
    total_length: number,
    user_id: number,
    owners: {
        id: number,
        username: string,
    }[],
    version: string,
} & Error;

//==============================================================================================================================================================================================

export type Beatmap = BeatmapCompact & {
    accuracy: number,
    ar: number,
    beatmapset_id: number,
    beatmapset?: Beatmapset,
    bpm?: number | null,
    convert: boolean,
    count_circles: number,
    count_sliders: number,
    count_spinners: number,
    cs: number,
    deleted_at: Timestamp | null,
    drain: number,
    hit_length: number,
    is_scoreable: boolean,
    last_updated: Timestamp,
    mode_int: Ruleset,
    passcount: number,
    playcount: number,
    ranked: number,
    url: string,
} & Error;

//==============================================================================================================================================================================================

export type BeatmapDifficultyAttributes = {
    attributes: {
        aim_difficulty: number,
        approach_rate: number,
        flashlight_difficulty: number,
        max_combo: number,
        overall_difficulty: number,
        slider_factor: number,
        speed_difficulty: number,
        star_rating: number,
    } | {
        star_rating: number,
        max_combo: number,
        stamina_difficulty: number,
        rhythm_difficulty: number,
        colour_difficulty: number,
        approach_rate: number,
        great_hit_window: number,
    } | {
        star_rating: number,
        max_combo: number,
        approach_rate: number,
    } | {
        star_rating: number,
        max_combo: number,
        great_hit_window: number,
        score_multiplier: number,
    };
} & Error;

//==============================================================================================================================================================================================

export type BeatmapPlaycount = {
    beatmap_id: number,
    beatmap: BeatmapCompact | null,
    beatmapset: BeatmapsetCompact | null,
    count: number,
} & Error;

//==============================================================================================================================================================================================

export type BeatmapsetCompact = {
    artist: string,
    artist_unicode: string,
    beatmaps?: Beatmap[],
    converts?: Beatmap[],
    covers: Covers,
    creator: string,
    current_user_attributes?: any,
    description?: {
        description: string,
    },
    discussions?: any,
    events?: any,
    favourite_count: number,
    genre?: {
        id: number,
        name: string,
    },
    has_favourited?: boolean,
    id: number,
    language?: {
        id: number,
        name: string,
    },
    nominations?: {
        current: number,
        required: number,
    },
    nsfw: boolean,
    play_count: number,
    preview_url: string,
    ratings?: number[],
    recent_favourites?: UserCompact[],
    related_users?: UserCompact[] | UserCompact,
    source: string,
    status: string,
    title: string,
    title_unicode: string,
    track_id: number,
    user: UserCompact,
    user_id: number,
    video: boolean,
} & Error;

//==============================================================================================================================================================================================

export type Beatmapset = BeatmapsetCompact & {
    availability: {
        download_disabled: boolean,
        more_information?: string | null,
    };
    beatmaps?: Beatmap[],
    bpm: number,
    can_be_hyped: boolean,
    converts?: Beatmap[],
    creator: string,
    description?: {
        description: string,
    },
    discussion_locked: boolean,
    has_favourited: any,
    hype: {
        current: number,
        required: number,
    },
    is_scoreable: boolean,
    last_updated: Timestamp,
    legacy_thread_url?: string | null,
    nominations?: {
        current: number,
        required: number,
    },
    nominations_summary?: {
        current: number,
        required: number,
    };
    ranked: number,
    ranked_date?: Timestamp | null,
    ratings?: number[],
    source: string,
    storyboard: boolean,
    submitted_date?: Timestamp | null,
    tags: string,
} & Error;

export type BeatmapsetSearch = {
    beatmapsets?: Beatmapset[],
    cursor: Cursor,
    cursor_string: CursorString,
    total: number,
    error: any,
    search: any,
    recommended_difficulty: any,
} & Error;

//==============================================================================================================================================================================================

export type BeatmapsetDiscussion = {
    beatmap?: BeatmapCompact | null,
    beatmap_id?: number | null,
    beatmapset?: BeatmapsetCompact | null,
    beatmapset_id: number,
    can_be_resolved: boolean,
    can_grant_kudosu: boolean,
    created_at: Timestamp,
    current_user_attributes: CurrentUserAttributes,
    deleted_at?: Timestamp | null,
    deleted_by_id?: number | null,
    id: number,
    kudosu_denied: boolean,
    last_post_at: Timestamp,
    message_type: MessageType,
    parent_id?: number | null,
    posts?: BeatmapsetDiscussionPost[] | null,
    resolved: boolean,
    starting_post?: BeatmapsetDiscussionPost | null,
    timestamp?: number | null,
    updated_at: Timestamp,
    user_id: number,
} & Error;

export type BeatmapsetDiscussionPost = {
    beatmapset_discussion_id: number,
    created_at: Timestamp,
    deleted_at?: Timestamp | null,
    deleted_by_id?: number | null,
    id: number,
    last_editor_id?: number | null,
    message: string,
    system: boolean,
    updated_at: Timestamp,
    user_id: number,
} & Error;

export type BeatmapsetDiscussionVote = {
    beatmapset_discussion_id: number,
    created_at: Timestamp,
    id: number,
    score: number,
    updated_at: Timestamp,
    user_id: number,
} & Error;

//==============================================================================================================================================================================================

/**
 * T is either Score or LegacyScore
 */
export type BeatmapScores<T> = {
    scores: T[],
    userScore: T | null,
} & Error;

//==============================================================================================================================================================================================

export type BeatmapUserScore = {
    position: number,
    score: Score,
} | any
    & Error;

//==============================================================================================================================================================================================

export type Build = {
    created_at: Timestamp,
    display_version: string,
    id: number,
    update_stream?: UpdateStream | null,
    users: number,
    version?: string | null,
    changelog_entries?: ChangelogEntry[],
    versions?: Versions;
} & Error;

//==============================================================================================================================================================================================

export type ChangelogEntry = {
    category: string,
    created_at?: Timestamp | null,
    github_pull_request_id?: number | null,
    github_url?: string,
    github_user?: GithubUser,
    id?: number | null,
    major: boolean,
    message?: string,
    message_html?: string,
    repository?: string | null,
    title?: string | null,
    type: string,
    url?: string | null,
} & Error;

//==============================================================================================================================================================================================

export type ChatChannel = {
    channel_id: number,
    current_user_attributes?: CurrentUserAttributes | null,
    name: string,
    description?: string | null,
    icon: string,
    type: 'PUBLIC' | 'PRIVATE' | 'MULTIPLAYER' | 'SPECTATOR' | 'TEMPORARY' | 'PM' | 'GROUP',
    last_read_id?: number | null,
    last_message_id?: number | null,
    recent_messages?: ChatMessage[] | null,
    moderated: boolean,
    users?: number[] | null,
} & Error;

//==============================================================================================================================================================================================

export type ChatMessage = {
    message_id: number,
    sender_id: number,
    channel_id: number,
    timestamp: Timestamp,
    content: string,
    is_action: boolean,
    sender: UserCompact;
} & Error;

//==============================================================================================================================================================================================

export type Comment = {
    commentable_id: number,
    commentable_type: string,
    created_at: Timestamp,
    deleted_at?: Timestamp | null,
    edited_at?: Timestamp | null,
    edited_by_id?: number | null,
    id: number,
    legacy_name?: string | null,
    message?: string | null,
    message_html?: string | null,
    parent_id?: number | null,
    pinned: boolean,
    replies_count: number,
    updated_at: Timestamp,
    user_id: number,
    votes_count: number,
} & Error;

export type CommentBundle = {
    commentable_meta: CommentableMeta,
    comments: Comment[],
    cursor: Cursor,
    has_more: boolean,
    has_more_id?: number | null,
    included_comments: Comment[],
    pinned_comments?: Comment[] | null,
    sort: string,
    top_level_count?: number | null,
    total?: number | null,
    user_follow: boolean;
    user_votes: number[],
    users: UserCompact[],
} & Error;

export type CommentSort = 'new' | 'old' | 'top'; //& Error

export type CommentableMeta = {
    id: number,
    title: string,
    type: string,
    url: string,
} & Error;

export type CurrentUserAttributes =
/* {
    BeatmapsetDiscusionPermissions: {
        can_destroy: boolean,
        can_reopen: boolean,
        can_moderate_kudosu: boolean,
        can_resolve: boolean,
        vote_score: number,
    },
    ChatChannelUserAttributes: {
        can_message: boolean,
        can_message_error?: string,
        last_read_id: number,
    }
} */ any; //& Error

export type Cursor = CursorString; //& Error

export type CursorString = any & Error;//{}

export type Event = {
    created_at: Timestamp,
    id: number,
    type: EventTypes,
} & Error;

export type ForumPost = {
    created_at: Timestamp,
    deleted_at?: Timestamp | null,
    edited_at?: Timestamp | null,
    edited_by_id?: number | null,
    forum_id: number,
    id: number,
    topic_id: number,
    user_id: number,
} & Error;

export type ForumTopic = {
    created_at: Timestamp,
    deleted_at?: Timestamp | null,
    first_post_id: number,
    forum_id: number,
    id: number,
    is_locked: boolean,
    last_post_id: number,
    poll?: Poll | null,
    post_count: number,
    title: string,
    type: 'normal' | 'sticky' | 'announcement',
    updated_at: Timestamp,
    user_id: number,
} & Error;

export type GameMode = ('osu' | 'taiko' | 'fruits' | 'mania');

export type Ruleset = number;

export enum RulesetEnum {
    osu = 0,
    taiko = 1,
    fruits = 2,
    mania = 3
}

export type GithubUser = {
    display_name: string,
    github_url?: string | null,
    id?: number | null,
    osu_username?: string | null,
    user_id?: number | null,
    user_url?: string | null,
} & Error;

export type Group = {
    colour?: string | null,
    description?: Description;
    has_listing: boolean,
    has_playmodes: boolean,
    id: number,
    identifier: string,
    is_probationary: boolean,
    name: string,
    short_name: string;
} & Error;

export type KudosuHistory = {
    id: number,
    action: string,
    amount: number,
    model: string,
    created_at: Timestamp,
    giver?: Giver | null,
    post: Post,
} & Error;

export type MultiplayerScore = {
    id: number,
    user_id: number,
    room_id: number,
    playlist_item_id: number,
    beatmap_id: number,
    rank: Rank,
    total_score: number,
    accuracy: number,
    max_combo: number,
    mods: Mod[],
    statistics: Statistics,
    passed: boolean,
    position?: number | null,
    scores_around?: MultiplayerScoresAround | null,
    user: User,
} & Error;

export type MultiplayerScores = {
    cursor: MultiplayerScoresCursor,
    params: object, //read https://osu.ppy.sh/docs/index.html?javascript#multiplayerscores for more info
    scores: MultiplayerScore[],
    total?: number | null,
    user_score?: MultiplayerScore,
} & Error;
//params:
//sort, limit, cursor[score_id],cursor[total_score]

export type MultiplayerScoresAround = {
    higher: MultiplayerScores,
    lower: MultiplayerScores,
} & Error;

export type MultiplayerScoresCursor = {
    score_id: number,
    total_score: number,
} & Error;

export type MultiplayerScoresSort = ('score_asc' | 'score_desc') & Error;

export type NewsPost = {
    author: string,
    edit_url: string,
    first_image?: string | null,
    id: number,
    published_at: Timestamp,
    slug: string,
    title: string,
    updated_at: Timestamp,
    content?: string,
    navigation?: Navigation,
    preview?: string,
} & Error;

export type Notification = {
    id: number,
    name: string,
    created_at: Timestamp,
    object_type: string,
    object_id: number,
    source_user_id?: number | null,
    is_read: boolean,
    details: NotificationEvent | object,
} & Error;

export type RankingType = ('charts' | 'country' | 'performance' | 'score') & Error;

export type Rankings = {
    beatmapsets?: Beatmapset[],
    cursor: Cursor,
    ranking: UserStatistics[],
    spotlight?: SpotLight | null,
    total: number,
} & Error;

//==============================================================================================================================================================================================

export type ScoreLegacy = {
    accuracy: number,
    beatmap?: Beatmap,
    beatmapset?: Beatmapset,
    best_id: number,
    created_at: Timestamp,
    id: number,
    match?: any,
    max_combo: number,
    mode_int: Ruleset,
    mode: GameMode,
    mods: string[],
    passed: boolean,
    perfect: boolean,
    pp: number,
    preserve?: boolean,
    processed?: boolean,
    rank_country?: string | number,
    rank_global?: string | number,
    rank: Rank,
    replay: boolean,
    room_id?: number,
    ruleset_id?: Ruleset,
    score: number,
    scores_around?: MultiplayerScoresAround,
    statistics: Statistics,
    type?: string,
    user_id: number,
    current_user_attributes?: {
        pin: boolean,
    };
    user?: UserCompact,
    weight?: {
        percentage: number,
        pp: number,
    },
} & Error;

export type Score = {
    accuracy: number,
    beatmap_id?: number,
    beatmap?: Beatmap,
    beatmapset?: Beatmapset,
    best_id?: number,
    build_id?: number,
    classic_total_score: number,
    current_user_attributes?: {
        pin: boolean,
    };
    ended_at: Timestamp,
    has_replay: boolean,
    id: number,
    is_perfect_combo: boolean,
    legacy_perfect: boolean;
    legacy_score_id: number;
    legacy_total_score: number;
    max_combo: number,
    maximum_statistics: ScoreStatistics;
    mods: Mod[],
    passed: boolean,
    playlist_item_id: number,
    pp?: number,
    position?: number,
    preserve: boolean,
    processed: boolean,
    rank: Rank,
    rank_country?: string | number,
    rank_global?: string | number,
    room_id?: number,
    ruleset_id: number,
    scores_around?: MultiplayerScoresAround,
    started_at: Timestamp,
    statistics: ScoreStatistics;
    total_score: number;
    type: string,
    user_id: number,
    user?: UserCompact,
    weight?: {
        percentage: number,
        pp: number,
    },
};

//==============================================================================================================================================================================================

export type SpotLight = {
    end_date: Timestamp,
    id: number,
    mode_specific: boolean,
    participant_count?: number | null,
    name: string,
    start_date: Timestamp,
    type: string,
} & Error;

export type SpotLights = {
    spotlights: SpotLight[];
} & Error;

/**
 * iso 8601 date
 * ${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss}+${hh}:${mm}
 * year-month-dayThour-minute-second+hour:minute
 * eg. 2019-09-05T06:31:20+00:00
*/
export type Timestamp = `${number}-${number}-${number}T${number}:${number}:${number}${'+' | '-'}${number}:${number}`; //& Error

export type UpdateStream = {
    display_name?: string | null,
    id: number,
    is_featured: boolean,
    name: string,
    latest_build?: Build | null,
    user_count?: number,
} & Error;

//==============================================================================================================================================================================================

export type UserCompact = {
    avatar_url: string,
    country_code: string,
    default_group: string,
    id: number,
    is_active: boolean,
    is_bot: boolean,
    is_deleted: boolean,
    is_online: boolean,
    is_supporter: boolean,
    pm_friends_only: boolean,
    profile_colour: string | null,
    username: string,
    account_history?: UserAccountHistory[],
    active_tournament?: ProfileBanner,
    badges?: UserBadge[],
    beatmap_playcounts_count?: number,
    blocks?: any,
    country?: Country,
    cover?: {
        custom_url: string,
        url: string,
        id: number,
    },
    favourite_beatmapset_count?: number,
    follower_count?: number,
    friends?: any,
    graveyard_beatmapset_count?: number,
    groups?: Group[],
    is_restricted?: boolean,
    last_visit?: Timestamp | null,
    loved_beatmapset_count?: number,
    monthly_playcounts?: UserMonthlyPlaycount[],
    page?: any,
    pending_beatmapset_count?: any,
    previous_usernames?: string[],
    rank_history?: any,
    rank_highest?: {
        rank: number,
        updated_at: Timestamp;
    };
    ranked_beatmapset_count?: number,
    replays_watched_counts?: any,
    scores_best_count?: number,
    scores_first_count?: number,
    scores_recent_count?: number,
    statistics?: UserStatistics,
    statstics_rulesets?: UserStatisticsRulesets,
    support_level?: any,
    unread_pm_count?: any,
    user_achievements?: {
        achieved_at: Timestamp,
        achievement_id: number;
    }[],
    user_preferences?: any,
} & Error;

//==============================================================================================================================================================================================

export type User = UserCompact & {
    cover_url: string,
    discord?: string | null,
    has_supported: boolean,
    interests?: string | null,
    join_date: Timestamp,
    kudosu: {
        available: number,
        total: number,
    },
    location?: string | null,
    max_blocks: number,
    max_friends: number,
    occupation?: string | null,
    playmode: GameMode,
    playstyle: string[],
    post_count: number,
    profile_order: ProfilePage[],
    title?: string | null,
    title_url?: string | null,
    twitter?: string | null,
    website?: string | null,
} & Error;

export type ScoreArrALegacy = {
    scores: ScoreLegacy[];
} & Error;

export type ScoreArrA = {
    scores: Score[];
} & Error;


export type BeatmapPlayCountArr = BeatmapPlaycount[] & Error;


//==============================================================================================================================================================================================

export type UserGroup = {
    playmodes: string[] | null,
} & Error;

export type UserSilence = {
    id: number,
    user_id: number,
} & Error;

export type UserStatistics = {
    grade_counts: {
        a: number,
        s: number,
        sh: number,
        ss: number,
        ssh: number;
    } /* | {
        a: number,
        s: number,
        sh: number,
        x: number,
        xh: number,
    } */,
    hit_accuracy: number,
    is_ranked: boolean,
    level: {
        current: number,
        progress: number,
    },
    maximum_combo: number,
    play_count: number,
    play_time: number,
    pp: number,
    country_rank?: number | null,
    global_rank: number | null,
    ranked_score: number,
    replays_watched_by_others: number,
    total_hits: number,
    total_score: number,
    user?: UserCompact,
} & Error;

export type WikiPage = {
    available_locales: string[],
    layout: string,
    locale: string,
    markdown: string,
    path: string,
    subtitle: string | null,
    tags: string,
    title: string,
} & Error;

//api shit

export type Error = {
    error?: string,
    authentication?: string,
};

export type OAuth = {
    access_token: string,
    expires_in: number,
    token_type: string,
} & Error;

//mini-types ???

//beatmap
type Failtimes = {
    exit: number[] | null,
    fail: number[] | null,
};
type Covers = {
    cover: string,
    'cover@2x': string,
    card: string,
    'card@2x': string,
    list: string,
    'list@2x': string,
    slimcover: string,
    'slimcover@2x': string,
};
type RankStatus = -2 | -1 | 0 | 1 | 2 | 3 | 4;
//graveyard, wip, pending, ranked, approved, qualified, loved

//BeatmapsetDiscussion
type MessageType = 'hype' | 'mapper_note' | 'praise' | 'problem' | 'review' | 'suggestion';

//Build
type Versions = {
    next?: Build,
    previous?: Build;
};

//Event

export type Achievement = {
    icon_url?: string,
    id: number,
    name?: string,
    grouping?: string,
    ordering?: number,
    slug: string,
    description?: string,
    mode?: GameMode,
    instructions: string;
};

export type EventType = EventAchievement |
    EventBeatmapPlaycount | EventBeatmapsetApprove | EventBeatmapsetDelete | EventBeatmapsetRevive | EventBeatmapsetUpdate | EventBeatmapsetUpload |
    EventRank | EventRankLost |
    EventUserSupportAgain | EventUserSupportFirst | EventUserSupportGift |
    EventUsernameChange;

export type EventTypes =
    'achievement' |
    'beatmapPlaycount' | 'beatmapsetApprove' | 'beatmapsetDelete' | 'beatmapsetRevive' | 'beatmapsetUpdate' | 'beatmapsetUpload' |
    'rank' | 'rankLost' |
    'userSupportAgain' | 'userSupportFirst' | 'userSupportGift' |
    'usernameChange';

export type EventBeatmap = {
    title: string,
    url: string;
} & Event;
export type EventUser = {
    username: string,
    url: string;
    previousUsername?: string | null,
} & Event;

export type EventAchievement = {
    achievement: Achievement,
    user: EventUser;
} & Event;
export type EventBeatmapPlaycount = {
    beatmap: EventBeatmap,
    count: number,
} & Event;
export type EventBeatmapsetApprove = {
    approval: string,
    beatmapset: EventBeatmap,
    user: EventUser;
} & Event;
export type EventBeatmapsetDelete = {
    beatmapset: EventBeatmap,
} & Event;
export type EventBeatmapsetRevive = {
    beatmapset: EventBeatmap,
    user: EventUser;
} & Event;
export type EventBeatmapsetUpdate = EventBeatmapsetRevive;
export type EventBeatmapsetUpload = EventBeatmapsetRevive;
export type EventRank = {
    scoreRank: string,
    rank: number,
    mode: GameMode,
    beatmap: EventBeatmap,
    user: EventUser;
} & Event;
export type EventRankLost = {
    mode: GameMode,
    beatmap: EventBeatmap,
    user: EventUser;
} & Event;
export type EventUserSupportAgain = {
    user: EventUser,
} & Event;
export type EventUserSupportFirst = {
    user: EventUser,
} & Event;
export type EventUserSupportGift = {
    user: EventUser,
} & Event;
export type EventUsernameChange = {
    user: EventUser,
} & Event;

//forum-topic
type Poll = {
    allow_vote_change: boolean,
    ended_at?: Timestamp | null,
    hide_incomplete_results: boolean,
    last_vote_at?: Timestamp | null,
    options: PollOption[],
    started_at: Timestamp,
    title: {
        bbcode: string,
        html: string,
    },
    total_votes_count: number,
};
type PollOption = {
    id: number,
    text: {
        bbcode: string,
        html: string,
    },
    vote_count?: number | null,
};
//Group
type Description = {
    html: string,
    markdown: string,
};


//Kudosu History
type Giver = {
    url: string,
    username: string,
};
type Post = {
    url?: string | null,
    title: string,
};

//scores
// https://github.com/ppy/osu-web/blob/master/database/mods.json
export type Mod = {
    name?: string,
    acronym: string;
    settings?: {
        retries?: number, // EZ
        speed_change?: number, // HT, DC, DT, NC
        adjust_pitch?: boolean, // HT, DT, WU, WD, AS
        restart?: boolean, // SD, PF, AC
        only_fade_approach_circles?: boolean, //HD
        follow_delay?: number, //FL
        size_multiplier?: number, //FL
        combo_based_size?: boolean, //FL
        minimum_accuracy?: number, //AC
        accuracy_judge_mode?: number, //AC
        seed?: number, //TP, RD
        metronome?: boolean,//TP
        circle_size?: number,//DA
        approach_rate?: number,//DA
        drain_rate?: number,//DA
        overall_difficulty?: number,//DA
        extended_limits?: boolean,//DA
        no_slider_head_accuracy?: boolean, //CL
        classic_note_lock?: boolean, //CL
        always_play_tail_sample?: boolean, //CL
        fade_hit_circle_early?: boolean, //CL
        classic_health?: boolean, //CL
        angle_sharpness?: number, //RD
        reflection?: string, //MR
        strength?: number; //WG
        start_scale?: number, //GR, DF
        initial_rate?: number; //WU, WD, AS
        final_rate?: number; //WU, WD
        spin_speed?: number, //BR
        direction?: string, //BR
        scale?: number, //AD
        style?: string, //AD
        inverse_muting?: boolean, //MU
        enable_metronome?: boolean, //MU
        mute_combo_count?: number, //MU
        affects_hit_sounds?: boolean, //MU
        hidden_combo_count?: number, //NS,
        attraction_strength?: number, //MG
        max_depth?: number, //DP
        show_approach_circles?: boolean, //DP
        max_size_combo_count?: number, //BM
        max_cursor_size?: number, //BM
    };
};
//'NM' | ''

export type Rank = 'XH' | 'X' | 'SH' | 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type Statistics = { //legacy score statistics
    count_100: number,
    count_300: number,
    count_50: number,
    count_geki: number,
    count_katu: number,
    count_miss: number;
};

export type ScoreStatistics = {
    perfect?: number, // geki/300+
    great: number, // 300
    good?: number, // katu/200
    ok?: number, // 100
    meh?: number, // 50
    miss?: number, // miss
    small_tick_miss?: number, // katu
    small_tick_hit?: number, // count 50
    legacy_combo_increase?: number, // max stats
};

//newspost
type Navigation = {
    newer?: NewsPost,
    older?: NewsPost,
};

//notification
type NotificationEvent =
    Notification_beatmapset_discussion_lock | Notification_beatmapset_discussion_post_new | Notification_beatmapset_discussion_unlock | Notification_beatmapset_disqualify | Notification_beatmapset_love | Notification_beatmapset_nominate | Notification_beatmapset_qualify | Notification_beatmapset_remove_from_loved
    | Notification_reset_nominations
    | Notification_channel_message | Notification_forum_topic_reply;

type Notification_beatmapset_discussion_lock = {
    cover_url: string,
    title: string,
    username: string,
};
type Notification_beatmapset_discussion_post_new = {
    title: string,
    cover_url: string,
    discussion_id: number,
    post_id: number,
    beatmap_id?: number | null,
    username: string,
};
type Notification_beatmapset_discussion_unlock = {
    cover_url: string,
    title: string,
    username: string,
};
type Notification_beatmapset_disqualify = {
    cover_url: string,
    title: string,
    username: string,
};
type Notification_beatmapset_love = {
    cover_url: string,
    title: string,
    username: string,
};
type Notification_beatmapset_nominate = {
    cover_url: string,
    title: string,
    username: string,
};
type Notification_beatmapset_qualify = {
    cover_url: string,
    title: string,
    username: string,
};
type Notification_beatmapset_remove_from_loved = {
    cover_url: string,
    title: string,
    username: string,
};
type Notification_reset_nominations = {
    cover_url: string,
    title: string,
    username: string,
};
type Notification_channel_message = {
    cover_url: string,
    title: string,
    username: string,
};
type Notification_forum_topic_reply = {
    cover_url: string,
    title: string,
    username?: string | null,
    post_id: number,
};


//user
type UserAccountHistory = {
    description: string | null,
    id: number,
    length: number,
    permanent: boolean,
    timestamp: Timestamp,
    type: 'note' | 'restriction' | 'silence',
};

type ProfileBanner = {
    id: number,
    tournament_id: number,
    image: string;
};

type UserBadge = {
    awarded_at: Timestamp,
    description: string,
    image_url: string,
    url: string,
};

type UserMonthlyPlaycount = {
    start_date: Timestamp,
    count: number,
}; //undocumented so this is all based off debug stuff

type UserStatisticsRulesets = any;/* {

} */

type Country = { code: CountryCode, name: CountryName; };

type CountryCode = string;

type CountryName = string;

type ProfilePage = 'me' | 'recent_activity' | 'beatmaps' | 'historical' | 'kudosu' | 'top_ranks' | 'medals';
