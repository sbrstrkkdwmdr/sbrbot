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

//==============================================================================================================================================================================================

export type BeatmapCompact = {
    beatmapset_id: number,
    difficulty_rating: number,
    id: number,
    mode: string,
    status: string,
    total_length: number,
    user_id: number,
    version: string,
    beatmapset?: BeatmapsetCompact,
    checksum?: string,
    failtimes: Failtimes
    max_combo?: number,
} & Error

//==============================================================================================================================================================================================

export type Beatmap = BeatmapCompact & {
    accuracy: number,
    ar: number,
    beatmapset_id: number,
    beatmapset?: Beatmapset,
    bpm: number,
    convert: boolean,
    count_circles: number,
    count_sliders: number,
    count_spinners: number,
    cs: number,
    deleted_at: Timestamp,
    drain: number,
    hit_length: number,
    is_scoreable: boolean,
    last_updated: Timestamp,
    mode_int: number,
    passcount: number,
    playcount: number,
    ranked: number,
    url: string,
} & Error

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
    }
} & Error

//==============================================================================================================================================================================================

export type BeatmapPlaycount = {
    beatmap_id: number,
    beatmap?: BeatmapCompact,
    beatmapset?: BeatmapsetCompact,
    count: number,
} & Error

//==============================================================================================================================================================================================

export type BeatmapsetCompact = {
    artist: string,
    artist_unicode: string,
    beatmaps?: BeatmapCompact[],
    converts?: BeatmapCompact[],
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
} & Error

//==============================================================================================================================================================================================

export type Beatmapset = BeatmapsetCompact & {
    availability: {
        download_disabled: boolean,
        more_information?: string,
    }
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
    nominations?: {
        current: number,
        required: number,
    },
    nominations_summary?: {
        current: number,
        required: number,
    }
    ranked: number,
    ranked_date?: Timestamp,
    ratings?: number[],
    source: string,
    storyboard: boolean,
    submitted_date: Timestamp,
    tags: string,
} & Error

//==============================================================================================================================================================================================

export type BeatmapsetDiscussion = {
    beatmap?: BeatmapCompact,
    beatmap_id?: number,
    beatmapset?: BeatmapsetCompact,
    beatmapset_id?: number,
    can_be_resolved: boolean,
    can_grant_kudosu: boolean,
    created_at: Timestamp,
    current_user_attributes: CurrentUserAttributes,
    deleted_at?: Timestamp,
    deleted_by_id?: number,
    id: number,
    kudosu_denied: boolean,
    last_post_at: Timestamp,
    message_type: MessageType,
    parent_id?: number,
    posts?: BeatmapsetDiscussionPost[],
    resolved: boolean,
    starting_post?: BeatmapsetDiscussionPost,
    timestamp?: number,
    updated_at: Timestamp,
    user_id: number,
} & Error

export type BeatmapsetDiscussionPost = {
    beatmapset_discussion_id: number,
    created_at: Timestamp,
    deleted_at?: Timestamp,
    deleted_by_id?: number,
    id: number,
    last_editor_id?: number,
    message: string,
    system: boolean,
    updated_at: Timestamp,
    user_id: number,
} & Error

export type BeatmapsetDiscussionVote = {
    beatmapset_discussion_id: number,
    created_at: Timestamp,
    id: number,
    score: number,
    updated_at: Timestamp,
    user_id: number,
} & Error

//==============================================================================================================================================================================================

export type BeatmapScores = {
    scores: Score[],
    userScore?: Score,
} & Error

//==============================================================================================================================================================================================

export type BeatmapUserScore = {
    position: number,
    score: Score,
} | any
    & Error

//==============================================================================================================================================================================================

export type Build = {
    created_at: Timestamp,
    display_version: string,
    id: number,
    update_stream?: UpdateStream,
    users: number,
    version?: string,
    changelog_entries?: ChangelogEntry[],
    versions: Versions
} & Error

//==============================================================================================================================================================================================

export type ChangelogEntry = {
    category: string,
    created_at?: Timestamp,
    github_pull_request_id?: number,
    github_url?: string,
    github_user?: GithubUser,
    id?: number,
    major: boolean,
    message?: string,
    message_html?: string,
    repository?: string,
    title?: string,
    type: string,
    url?: string,
} & Error

//==============================================================================================================================================================================================

export type ChatChannel = {
    channel_id: number,
    current_user_attributes: CurrentUserAttributes,
    name: string,
    description?: string,
    icon: string,
    type: 'PUBLIC' | 'PRIVATE' | 'MULTIPLAYER' | 'SPECTATOR' | 'TEMPORARY' | 'PM' | 'GROUP',
    last_read_id?: number,
    last_message_id?: number,
    recent_messages?: ChatMessage[],
    moderated: boolean,
    users?: number[],
} & Error

//==============================================================================================================================================================================================

export type ChatMessage = {
    message_id: number,
    sender_id: number,
    channel_id: number,
    timestamp: Timestamp,
    content: string,
    is_action: boolean,
    sender: UserCompact
} & Error

//==============================================================================================================================================================================================

export type Comment = {
    commentable_id: number,
    commentable_type: string,
    created_at: Timestamp,
    deleted_at?: Timestamp,
    edited_at?: Timestamp,
    edited_by_id?: number,
    id: number,
    legacy_name?: string,
    message?: string,
    message_html?: string,
    parent_id?: number,
    pinned: boolean,
    replies_count: number,
    updated_at: Timestamp,
    user_id: number,
    votes_count: number,
} & Error

export type CommentBundle = {
    commentable_meta: CommentableMeta,
    comments: Comment[],
    cursor: Cursor,
    has_more: boolean,
    has_more_id?: number,
    included_comments: Comment[],
    pinned_comments?: Comment[],
    sort: string,
    top_level_count?: number,
    total?: number,
    user_follow: boolean
    user_votes: number[],
    users: UserCompact[],
} & Error

export type CommentSort = 'new' | 'old' | 'top' & Error

export type CommentableMeta = {
    id: number,
    title: string,
    type: string,
    url: string,
} & Error

export type CurrentUserAttributes = /* {
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
} */ any & Error

export type Cursor = CursorString & Error

export type CursorString = any & Error//{}

export type Event = {
    created_at: Timestamp,
    id: number,
    type: EventType,
} & Error

export type ForumPost = {
    created_at: Timestamp,
    deleted_at?: Timestamp,
    edited_at?: Timestamp,
    edited_by_id?: number,
    forum_id: number,
    id: number,
    topic_id: number,
    user_id: number,
} & Error

export type ForumTopic = {
    created_at: Timestamp,
    deleted_at?: Timestamp,
    first_post_id: number,
    forum_id: number,
    id: number,
    is_locked: boolean,
    last_post_id: number,
    poll?: Poll,
    post_count: number,
    title: string,
    type: 'normal' | 'sticky' | 'announcement',
    updated_at: Timestamp,
    user_id: number,
} & Error

export type GameMode = 'osu' | 'taiko' | 'fruits' | 'mania' & Error

export type GithubUser = {
    display_name: string,
    github_url?: string,
    id?: number,
    osu_username?: string,
    user_id?: number,
    user_url?: string,
} & Error

export type Group = {
    colour?: string,
    has_lsisting: boolean,
    has_playmodes: boolean,
    id: number,
    identifier: string,
    is_probationary: boolean,
    name: string,
    short_name: string
} & Error

export type KudosuHistory = {
    id: number,
    action: string,
    amount: number,
    model: string,
    created_at: Timestamp,
    giver?: Giver,
    post: Post,
} & Error

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
    position?: number,
    scores_around?: MultiplayerScoresAround,
    user: User,
} & Error

export type MultiplayerScores = {
    cursor: MultiplayerScoresCursor,
    params: object, //read https://osu.ppy.sh/docs/index.html?javascript#multiplayerscores for more info
    scores: MultiplayerScore[],
    total?: number,
    user_score?: MultiplayerScore,
} & Error

export type MultiplayerScoresAround = {
    higher: MultiplayerScores,
    lower: MultiplayerScores,
} & Error

export type MultiplayerScoresCursor = {
    score_id: number,
    total_score: number,
} & Error

export type MultiplayerScoresSort = 'score_asc' | 'score_desc' & Error

export type NewsPost = {
    author: string,
    edit_url: string,
    first_image?: string,
    id: number,
    published_at: Timestamp,
    slug: string,
    title: string,
    updated_at: Timestamp,
    content?: string,
    navigation?: Navigation,
    preview?: string,
} & Error

export type Notification = {
    id: number,
    name: string,
    created_at: Timestamp,
    object_type: string,
    object_id: number,
    source_user_id?: number,
    is_read: boolean,
    details: NotificationEvent | object,
} & Error

export type RankingType = 'charts' | 'country' | 'performance' | 'score' & Error

export type Rankings = {
    beatmapsets?: Beatmapset[],
    cursor: Cursor,
    ranking: UserStatistics,
    spotlight?: SpotLight,
    total: number,
} & Error

//==============================================================================================================================================================================================

export type Score = {
    accuracy: number,
    beatmap?: BeatmapCompact,
    beatmapset?: BeatmapsetCompact,
    best_id: number,
    created_at: Timestamp,
    id: number,
    match?: any,
    max_combo: number,
    mode_int: number,
    mode: string,
    mods: Mod[],
    passed: boolean,
    perfect: boolean,
    pp: number,
    rank_country?: string,
    rank_global?: string | number,
    rank: string,
    replay: string,
    score: number,
    statistics: Statistics,
    user_id: number,
    user?: UserCompact,
    weight?: {
        percentage: number,
        pp: number,
    },
} & Error

//==============================================================================================================================================================================================

export type SpotLight = {
    end_date: Timestamp,
    id: number,
    mode_specific: boolean,
    participant_coount?: number,
    name: string,
    start_date: Timestamp,
    type: string,
} & Error

export type SpotLights = {
    spotlights: SpotLight[]
} & Error

export type Timestamp = string & Error
//iso 8601 date
//ie 2019-09-05T06:31:20+00:00

export type UpdateStream = {
    display_name?: string | null,
    id: number,
    is_featured: boolean,
    name: string,
    latest_build?: Build | null,
    user_count?: number,
} & Error

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
    last_visit: string,
    pm_friends_only: boolean,
    profile_colour: any,
    username: string,
    account_history?: ''
} & Error

//==============================================================================================================================================================================================

export type User = UserCompact & {
    cover?: {
        custom_url: string,
        url: string,
        id: number,
    },
    cover_url: string,
    country?: string,
    discord?: string,
    has_supported: boolean,
    interests?: string,
    join_date: Timestamp,
    kudosu: {
        available: number,
        total: number,
    },
    location?: string,
    max_blocks: number,
    max_friends: number,
    occupation?: string,
    playmode: GameMode,
    playstyle: string[],
    post_count: number,
    profile_order: ProfilePage[],
    statistics?: UserStatistics,
    title?: string,
    title_url?: string,
    twitter?: string,
    website?: string,
} & Error

//==============================================================================================================================================================================================

export type UserGroup = {
    playmodes: string[] | null,
} & Error

export type UserSilence = {
    id: number,
    user_id: number,
} & Error

export type UserStatistics = {
    grade_counts: {
        a: number,
        s: number,
        sh: number,
        ss: number,
        ssh: number
    } | {
        a: number,
        s: number,
        sh: number,
        x: number,
        xh: number,
    },
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
    global_rank: number | null,
    ranked_score: number,
    replays_watched_by_others: number,
    total_hits: number,
    total_score: number,
    user: UserCompact,
} & Error

export type WikiPage = {
    available_locales: string[],
    layout: string,
    locale: string,
    markdown: string,
    path: string,
    subtitle: string | null,
    tags: string,
    title: string,
} & Error

//api shit

export type Error = {
    error?: string,
    authentication?: string,
}

export type OAuth = {
    access_token: string,
    expires_in: number,
    token_type: string,
} & Error

//mini-types ???

//beatmap
type Failtimes = {
    exit: number[],
    fail: number[],
}
type Covers = {
    cover: string,
    'cover@2x': string,
    card: string,
    'card@2x': string,
    list: string,
    'list@2x': string,
    slimcover: string,
    'slimcover@2x': string,
}
type RankStatus = -2 | -1 | 0 | 1 | 2 | 3 | 4
//graveyard, wip, pending, ranked, approved, qualified, loved

//BeatmapsetDiscussion
type MessageType = 'hype' | 'mapper_note' | 'praise' | 'problem' | 'review' | 'suggestion'

//Build
type Versions = {
    next?: Build,
    previous?: Build
}

//Event
type EventType = EventAchievement |
    EventBeatmapPlaycount | EventBeatmapsetApprove | EventBeatmapsetDelete | EventBeatmapsetRevive | EventBeatmapsetUpdate | EventBeatmapsetUpload |
    EventRank | EventRankLost |
    EventUserSupportAgain | EventUserSupportFirst | EventUserSupportGift |
    EventUsernameChange

type EventBeatmap = {
    title: string,
    url: string
}
type EventUser = {
    username: string,
    url: string
    previousUsername?: string,
}

type EventAchievement = {
    achievement: any,
    user: EventUser
}
type EventBeatmapPlaycount = {
    beatmap: EventBeatmap,
    count: number,
}
type EventBeatmapsetApprove = {
    approval: string,
    beatmapset: EventBeatmap,
    user: EventUser
}
type EventBeatmapsetDelete = {
    beatmapset: EventBeatmap,
}
type EventBeatmapsetRevive = {
    beatmapset: EventBeatmap,
    user: EventUser
}
type EventBeatmapsetUpdate = EventBeatmapsetRevive
type EventBeatmapsetUpload = EventBeatmapsetRevive
type EventRank = {
    scoreRank: string,
    rank: number,
    mode: GameMode,
    beatmap: EventBeatmap,
    user: EventUser
}
type EventRankLost = {
    mode: GameMode,
    beatmap: EventBeatmap,
    user: EventUser
}
type EventUserSupportAgain = {
    user: EventUser,
}
type EventUserSupportFirst = {
    user: EventUser,
}
type EventUserSupportGift = {
    user: EventUser,
}
type EventUsernameChange = {
    user: EventUser,
}

//forum-topic
type Poll = {
    allow_vote_change: boolean,
    ended_at?: Timestamp,
    hide_incomplete_results: boolean,
    last_vote_at?: Timestamp,
    options: PollOption[],
    started_at: Timestamp,
    title: {
        bbcode: string,
        html: string,
    },
    total_votes_count: number,
}
type PollOption = {
    id: number,
    text: {
        bbcode: string,
        html: string,
    },
    vote_count: number,
}
//Kudosu History
type Giver = {
    url: string,
    username: string,
}
type Post = {
    url?: string,
    title: string,
}

//scores
type Mod = string;
//'NM' | ''

type Rank = 'XH' | 'X' | 'SH' | 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

type Statistics = {
    count_100: number,
    count_300: number,
    count_50: number,
    count_geki: number,
    count_katu: number,
    count_miss: number
}

//newspost
type Navigation = {
    newer?: NewsPost,
    older?: NewsPost,
}

//notification
type NotificationEvent =
    Notification_beatmapset_discussion_lock | Notification_beatmapset_discussion_post_new | Notification_beatmapset_discussion_unlock | Notification_beatmapset_disqualify | Notification_beatmapset_love | Notification_beatmapset_nominate | Notification_beatmapset_qualify | Notification_beatmapset_remove_from_loved
    | Notification_reset_nominations
    | Notification_channel_message | Notification_forum_topic_reply

type Notification_beatmapset_discussion_lock = {
    cover_url: string,
    title: string,
    username: string,
}
type Notification_beatmapset_discussion_post_new = {
    title: string,
    cover_url: string,
    discussion_id: number,
    post_id: number,
    beatmap_id?: number,
    username: string,
}
type Notification_beatmapset_discussion_unlock = {
    cover_url: string,
    title: string,
    username: string,
}
type Notification_beatmapset_disqualify = {
    cover_url: string,
    title: string,
    username: string,
}
type Notification_beatmapset_love = {
    cover_url: string,
    title: string,
    username: string,
}
type Notification_beatmapset_nominate = {
    cover_url: string,
    title: string,
    username: string,
}
type Notification_beatmapset_qualify = {
    cover_url: string,
    title: string,
    username: string,
}
type Notification_beatmapset_remove_from_loved = {
    cover_url: string,
    title: string,
    username: string,
}
type Notification_reset_nominations = {
    cover_url: string,
    title: string,
    username: string,
}
type Notification_channel_message = {
    cover_url: string,
    title: string,
    username: string,
}
type Notification_forum_topic_reply = {
    cover_url: string,
    title: string,
    username?: string,
    post_id: number,
}


//user
type ProfilePage = 'me' | 'recent_activity' | 'beatmaps' | 'historical' | 'kudosu' | 'top_ranks' | 'medals';

/*
export {
    Beatmap,
    BeatmapCompact,
    BeatmapDifficultyAttributes,
    BeatmapPlaycount,
    BeatmapScores,
    BeatmapUserScore,
    Beatmapset,
    BeatmapsetCompact,
    BeatmapsetDiscussion,
    BeatmapsetDiscussionPost,
    BeatmapsetDiscussionVote,
    
    ChangelogEntry,
    Comment,
    CommentBundle,
    CommentableMeta,
    CommentSort,
    
    Score,
    
    User,
    UserCompact,
    
    Error,
    OAuth,
    
    Failtimes,
    Covers,
    RankStatus,
    MessageType,
    /

//done list
/**
    Beatmap,
    BeatmapCompact,
    BeatmapDifficultyAttributes,
    BeatmapsetDiscussion,
    BeatmapsetDiscussionPost,
    BeatmapsetDiscussionVote,
    BeatmapPlaycount,
    BeatmapScores,
    BeatmapUserScore,
    Beatmapset,
    BeatmapsetCompact,
    Score,
    User,
    UserCompact,

    Error,
    OAuth,

    Failtimes,
    Covers,
    RankStatus,
    MessageType,
 */