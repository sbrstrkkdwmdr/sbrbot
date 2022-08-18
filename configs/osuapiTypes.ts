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

type BeatmapCompact = {
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
    failtimes: {
        fail: number[],
        exit: number[],
    },
    max_combo?: number,
}

//==============================================================================================================================================================================================

type Beatmap = BeatmapCompact & {
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
}

//==============================================================================================================================================================================================

type BeatmapDifficultyAttributes = {
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
}

//==============================================================================================================================================================================================

type BeatmapPlaycount = {
    beatmap_id: number,
    beatmap?: BeatmapCompact,
    beatmapset?: BeatmapsetCompact,
    count: number,
}

//==============================================================================================================================================================================================

type BeatmapsetCompact = {
    artist: string,
    artist_unicode: string,
    beatmaps?: BeatmapCompact[],
    converts?: BeatmapCompact[],
    covers: {
        cover: string,
        'cover@2x': string,
        card: string,
        'card@2x': string,
        list: string,
        'list@2x': string,
        slimcover: string,
        'slimcover@2x': string,
    },
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
}

//==============================================================================================================================================================================================

type Beatmapset = BeatmapsetCompact & {
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
}

//==============================================================================================================================================================================================

type BeatmapsetDiscussion = {
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
}

type BeatmapsetDiscussionPost = {
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
}

type BeatmapsetDiscussionVote = {
    beatmapset_discussion_id: number,
    created_at: Timestamp,
    id: number,
    score: number,
    updated_at: Timestamp,
    user_id: number,
}

//==============================================================================================================================================================================================

type BeatmapScores = {
    scores: Score[],
    userScore?: Score,
}

//==============================================================================================================================================================================================

type BeatmapUserScore = {
    position: number,
    score: Score,
} | any

//==============================================================================================================================================================================================

type Build = {
    created_at: Timestamp,
    display_version: string,
    id: number,
    update_stream?: UpdateStream,
    users: number,
    version?: string,
    changelog_entries?: ChangelogEntry[],
    versions: Versions
}

//==============================================================================================================================================================================================

type ChangelogEntry = {
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
}

//==============================================================================================================================================================================================

type ChatChannel = {
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
}

//==============================================================================================================================================================================================

type ChatMessage = {
    message_id: number,
    sender_id: number,
    channel_id: number,
    timestamp: Timestamp,
    content: string,
    is_action: boolean,
    sender: UserCompact
}

//==============================================================================================================================================================================================

type Comment = {
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
}

type CommentBundle = {
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
}

type CommentSort = 'new' | 'old' | 'top'

type CommentableMeta = {
    id: number,
    title: string,
    type: string,
    url: string,
}

type CurrentUserAttributes = /* {
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
} */ any

type Cursor = CursorString//{}

type CursorString = any//{}

type Event = {
    created_at: Timestamp,
    id: number,
    type: EventType,
}

type ForumPost = {
    created_at: Timestamp,
    deleted_at?: Timestamp,
    edited_at?: Timestamp,
    edited_by_id?: number,
    forum_id: number,
    id: number,
    topic_id: number,
    user_id: number,
}

type ForumTopic = {
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
}

type GameMode = 'osu' | 'taiko' | 'fruits' | 'mania'

type GithubUser = {
    display_name: string,
    github_url?: string,
    id?: number,
    osu_username?: string,
    user_id?: number,
    user_url?: string,
}

type Group = {
    colour?: string,
    has_lsisting: boolean,
    has_playmodes: boolean,
    id: number,
    identifier: string,
    is_probationary: boolean,
    name: string,
    short_name: string
}

type KudosuHistory = {}

type MultiplayerScore = {}

type MultiplayerScores = {}

type MultiplayerScoresAround = {}

type MultiplayerScoresCursor = {}

type MultiplayerScoresSort = {}

type NewsPost = {}

type Notification = {}

type RankingType = {}

//==============================================================================================================================================================================================

type Score = {
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
    mods: number,
    passed: boolean,
    perfect: boolean,
    pp: number,
    rank_country?: string,
    rank_global?: string | number,
    rank: string,
    replay: string,
    score: number,
    statistics: {
        count_100: number,
        count_300: number,
        count_50: number,
        count_geki: number,
        count_katu: number,
        count_miss: number
    },
    user_id: number,
    user?: UserCompact,
    weight?: {
        percentage: number,
        pp: number,
    },
}

//==============================================================================================================================================================================================

type SpotLight = {}

type SpotLights = {}

type Timestamp = string
//iso 8601 date
//ie 2019-09-05T06:31:20+00:00

type UpdateStream = {}

//==============================================================================================================================================================================================

type UserCompact = {
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
}

//==============================================================================================================================================================================================

type User = UserCompact & {
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
    title?: string,
    title_url?: string,
    twitter?: string,
    website?: string,
}

//==============================================================================================================================================================================================

type UserGroup = {}

type UserSilence = {}

type UserStatistics = {}

type WikiPage = {}

//api shit

type Error = {
    error: string,
} | {
    authentication: string,
}

type OAuth = {
    access_token: string,
    expires_in: number,
    token_type: string,
}

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

//user
type ProfilePage = 'me' | 'recent_activity' | 'beatmaps' | 'historical' | 'kudosu' | 'top_ranks' | 'medals';


export {
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
};

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