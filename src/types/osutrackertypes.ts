export interface User {
    name: string,
    id: string,
    url: string,
    country: string,
    pp: string,
    rank: string,
    acc: string,
    plays: string,
    level: number,
    range: string,
    joined: number,
    currentTop: Score[],
    farm: number,
    averageLength: number,
    averageObjects: number,
}

export interface UserPlays {
    name: string,
    id: string,
    date: number,
    added: Score[],
    removed: Score[], 
}

export interface UserStat {
    rank: string,
    pp: string,
    plays: string,
    acc: string,
    player: string,
    date: number,
    id: string,
}

export interface Contributor {
    name: string
    pp: number
}

export interface Country {
    name: string,
    abbreviation: string,
    contributors: Contributor[],
    acc: number,
    pp: string,
    farm: number,
    scoresCurrent: Score[],
    range: string,
    playerWeighted: number,
}
export interface CountryPlayer {
    name: string
    pp: string
}

export interface CountryPlayers {
    name: string,
    date: number,
    listPlayers: CountryPlayer[],
    mark: number,
}
export interface CountryPlays {
    name: string,
    date: number,
    added: Score[],
    removed: Score[]
}
export interface CountryStat {
    name: string,
    date: number,
    pp: string,
    acc: number,
    playerWeighting: number,
}
export interface HistoricTopPlayerPoint {
    name: string,
    pp: number
}

export interface HistoricTop {
    year: number,
    month: string,
    monthNumber: number,
    top: HistoricTopPlayerPoint[]
}

export interface MapperCount {
    mapper: string,
    count: number
}

export interface SetCount {
    setId: string,
    count: number
}

export interface ModCount {
    mods: string[]
    count: number
}

export interface OverallStats {
    mapperCount: MapperCount[],
    setCount: SetCount[],
    userStats: {
        range: number,
        acc: number,
        plays: number,
        timeJoined: number,
        farm: number,
        topPlay: string,
        pp: number,
        level: number,
        lengthPlay: number,
        objectsPlay: number,
        modsCount: ModCount[],
    },
    countryStats: {
        range: number,
        farm: number,
        pp: number,
        acc: number,
        lengthPlay: number,
        objectsPlay: number,
        modsCount: ModCount[],
    },
}

export interface Score {
    name: string,
    id: string,
    setId: string,
    mods: string[],
    pp: string,
    missCount: string,
    acc: number,
    mapper: string,
    length: string,
    objects: number,
    player?: string
}

export interface Beatmap {
    id: string,
    setId: string,
    name: string,
    maxCombo: string,
    objects: number,
    starRating: string,
    length: string,
    mapper: string,
}