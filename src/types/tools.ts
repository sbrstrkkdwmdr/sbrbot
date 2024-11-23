import * as bot from './bot.js';
import * as apitypes from './osuapi.js';

export type apiGetStrings =
    //custom
    'custom' |
    'map_get' | 'map' | //beatmap
    'map_get_md5' | //beatmap_lookup
    'mapset_get' | 'mapset' | //beatmapset
    'mapset_search' | //beatmapset search
    'score_get' | //score
    'scores_get_best' | 'osutop' | 'best' | 'osutop_alt' | //user scores best
    'scores_get_first' | 'firsts' | 'firsts_alt' | //user scores first
    'scores_get_pinned' | 'pinned' | 'pinned_alt' | //user scores pinned
    'scores_get_recent' | 'recent' | 'recent_alt' | //user scores recent
    'scores_get_map' | 'maplb' | //scores map
    'user_get' | //user
    'user_get_most_played' | 'most_played' | //user most played
    'user_get_scores_map' | //user scores map
    'user_get_maps' | 'user_get_maps_alt' | //user maps

    //beatmaps
    'beatmap_lookup' | //returns Beatmap
    'beatmap_user_score' | //returns BeatmapUserScore
    'beatmap_user_scores' | //returns Score[]
    'beatmap_scores' | //returns BeatmapScores (CHANGING)
    'beatmaps' | //returns Beatmap[]
    'beatmap' | //returns Beatmap
    'beatmap_attributes' | //returns DifficultyAttributes
    'beatmapset_discussion_posts' | //returns (WIP)
    'beatmapset_discussion_votes' | //returns (WIP)
    'beatmapset_discussions' | //returns (WIP)
    'beatmaps_solo_scores' | //(UNDOCUMENTED) (LAZER ONLY) 
    'beatmaps_solo_scores_token' | //(UNDOCUMENTED) (LAZER ONLY)
    'beatmapset_events' | //returns (UNDOCUMENTED) (WIP)
    'beatmapset_favourites' | //returns (UNDOCUMENTED) (LAZER ONLY)
    'beatmapset_search' | //returns (UNDOCUMENTED)
    'beatmapset_lookup' | //returns Beatmapset (UNDOCUMENTED)
    'beatmapset' | //returns Beatmapset (UNDOCUMENTED)


    //changelog
    'changelog_build' | //returns Build
    'changelog_listing' | //returns {Build[],search{from?:string,limit:number,max_id?:number,stream?:string,to?:string},streams:UpdateStream[]}
    'changelog_build_lookup' | //returns Build (???)

    //chat
    'chat_tdl' |

    //comments
    'comments_tdl' |

    //forums
    'forum_tdl' |

    //home
    'home_tdl' |

    //multiplayer
    'multiplayer_tdl' |

    //news
    'news_tdl' |

    //notifications
    'notifications_tdl' |

    //oauth
    'oauth_tdl' |

    //rankings
    'rankings' | //returns Rankings
    'spotlights' | //returns Spotlights

    //score
    'score' | //returns Score (UNDOCUMENTED)
    'score_download' | //returns `.osr` file (UNDOCUMENTED)

    //users
    'me' | //returns User
    'kudosu' | //returns KudosuHistory[]
    'user_scores' | //returns Score[]
    'user_beatmaps' | //returns Beatmap[] or BeatmapPlaycount[]
    'user_recent_activity' | //returns Event[]
    'user' | //returns User
    'users' | //returns UserCompact[]

    //wiki
    'wiki_tdl' |

    //Websocket
    'notification_connection' |
    'notification_connection_logout' |
    'notification_connection_new' |
    'notification_connection_read';

export type apiInput = {
    url: string,
    extra: string[],
    tries?: number,
};

export type apiReturn<T = any> = {
    msTaken: number,
    apiData: T & apitypes.Error,
    error?: Error,
};

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

export type trackUser = {
    id: number,
    osuid: string,
    guilds: string,
    guildsosu: string,
    guildstaiko: string,
    guildsfruits: string,
    guildsmania: string,
};

export type guildSettings = {
    guildid: number | string,
    guildname: string,
    prefix: string,
    osuParseLinks: boolean,
    osuParseScreenshots: boolean,
    osuParseReplays: boolean,
};