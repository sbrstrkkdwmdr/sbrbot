export const pages = toFlag([
    'p', 'page'
]);

export const details = toFlag([
    'd', 'details', 'detailed', 'detail'
]);
export const compress = toFlag([
    'c', 'compress', 'compressed'
]);

export const modeosu = toFlag([
    'o', 'osu', 'std', 'standard'
]);
export const modetaiko = toFlag([
    't', 'taiko', 'drum'
]);
export const modefruits = toFlag([
    'f', 'fruits', 'ctb', 'catch', 'catchthebeat'
]);
export const modemania = toFlag([
    'm', 'mania', 'piano', 'vsrg'
]);

export const mapRanked = toFlag([
    'rank', 'ranked'
]);
export const mapNominated = toFlag([
    'nominated', 'bn', 'nom'
]);
export const mapPending = toFlag([
    'pending', 'pend'
]);
export const mapWip = toFlag([
    'wip', 'unfinished', 'workinprogress'
]);
export const mapQualified = toFlag([
    'qual', 'qualify', 'qualified'
]);
export const mapGraveyard = toFlag([
    'grave', 'graveyard', 'graveyarded', 'unranked', 'unrank'
]);
export const mapLove = toFlag([
    'love', 'loved'
]);
export const mapApprove = toFlag([
    'approve', 'approved'
]);
export const mapFavourite = toFlag([
    'favourites', 'favourite', 'fav'
]);
export const mapGuest = toFlag([
    'guest', 'gd'
]);
export const mapMostPlayed = toFlag([
    'most_played', 'mp', 'most', 'mostplayed'
]);

export const filterArtist = toFlag([
    'artist', 'a'
]);

export const filterTitle = toFlag([
    'title', '?'
]);
export const filterVersion = toFlag([
    'version', 'v', 'difficulty', 'diff'
]);
export const filterCreator = toFlag([
    'creator', 'mapper'
]);

export const user = toFlag([
    'u', 'user', 'uid'
]);

export function toFlag(args: string[]) {
    return args.map(x => `-${x}`);
}