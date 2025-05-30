// database and caching
import fs from 'fs';
import * as moment from 'moment';
import * as rosu from 'rosu-pp-js';
import Sequelize from 'sequelize';
import * as stats from 'simple-statistics';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as apitypes from '../types/osuapi.js';
import * as tooltypes from '../types/tools.js';

export async function updateUserStats(user: apitypes.User, mode: string) {
    const allUsers = await helper.vars.userdata.findAll();

    let findname;
    allUsers.find((u) => u._model == null);
    try {
        findname = allUsers.find((u: any) => (u as tooltypes.dbUser).osuname.toLowerCase() == user.username.toLowerCase());
    } catch (error) {

    }
    if (findname) {
        switch (mode) {
            case 'osu':
            default:
                {

                    await helper.vars.userdata.update({
                        osupp: !isNaN(user?.statistics?.pp) ? user?.statistics?.pp : 0,
                        osurank: !isNaN(user?.statistics?.global_rank) ? user?.statistics?.global_rank : 0,
                        osuacc: !isNaN(user?.statistics?.hit_accuracy) ? user?.statistics?.hit_accuracy : 0,
                    }, {
                        where: { osuname: findname.dataValues.osuname }
                    });
                }
                break;
            case 'taiko':
                await helper.vars.userdata.update({
                    taikopp: !isNaN(user?.statistics?.pp) ? user?.statistics?.pp : 0,
                    taikorank: !isNaN(user?.statistics?.global_rank) ? user?.statistics?.global_rank : 0,
                    taikoacc: !isNaN(user?.statistics?.hit_accuracy) ? user?.statistics?.hit_accuracy : 0
                }, {
                    where: { osuname: findname.dataValues.osuname }
                });
                break;
            case 'fruits':
                await helper.vars.userdata.update({
                    fruitspp: !isNaN(user?.statistics?.pp) ? user?.statistics?.pp : 0,
                    fruitsrank: !isNaN(user?.statistics?.global_rank) ? user?.statistics?.global_rank : 0,
                    fruitsacc: !isNaN(user?.statistics?.hit_accuracy) ? user?.statistics?.hit_accuracy : 0
                }, {
                    where: { osuname: findname.dataValues.osuname }
                });
                break;
            case 'mania':
                await helper.vars.userdata.update({
                    maniapp: !isNaN(user?.statistics?.pp) ? user?.statistics?.pp : 0,
                    maniarank: !isNaN(user?.statistics?.global_rank) ? user?.statistics?.global_rank : 0,
                    maniaacc: !isNaN(user?.statistics?.hit_accuracy) ? user?.statistics?.hit_accuracy : 0
                }, {
                    where: { osuname: findname.dataValues.osuname }
                });
                break;
        }
    }
    return;
}

export async function searchUser(searchid: string, findMode: boolean) {
    const findname = await helper.vars.userdata.findOne({ where: { userid: searchid ?? '0' } });
    let user;
    let errorValue;
    let mode;
    if (findname != null) {
        user = findname.get('osuname');
        errorValue = null;
        if (findMode == true) {
            mode = findname.get('mode');
            if (mode.length < 1 || mode == null) {
                mode = 'osu';
            }
        } else {
            mode = 'osu';
        }
        if (typeof user != 'string') {
            errorValue = 'Username is incorrect type';
        }
    } else {
        user = null;
        mode = 'osu';
        errorValue = `no user found with id ${searchid}`;
    }
    const object = {
        username: user,
        gamemode: mode,
        error: errorValue,
    };
    return object;
}

/**
 * similar to searchUser, but it returns ALL data values (excluding pp,acc,rank)
 */
export async function searchUserFull(searchid: string, userdata: any) {
    const findname = await userdata.findOne({ where: { userid: searchid ?? '0' } });
    let user;
    let mode;
    let tz;
    let skin;
    let errorValue;
    let location;
    if (findname != null) {
        user = findname.get('osuname');
        errorValue = null;
        mode = findname.get('mode');
        tz = findname.get('timezone');
        location = findname.get('location');
        skin = findname.get('skin');
        if (mode.length < 1 || mode == null) {
            mode = 'osu';
        }
        if (typeof user != 'string') {
            errorValue = 'Username is incorrect type';
        }
    } else {
        user = null;
        mode = 'osu';
        tz = null;
        skin = null;
        errorValue = `no user found with id ${searchid}`;
    }
    const object = {
        username: user,
        gamemode: mode,
        tz,
        skin,
        location,
        error: errorValue,
    };
    return object;
}


const cacheById = [
    'bmsdata',
    'mapdata',
    'osudata',
    'scoredata',
    'maplistdata',
    'firstscoresdata',
    'pinnedscoresdata',
    'bestscoresdata',
];

/**
 * 
 * @param data
 * @param id command id. if storing a map use the map id/md5 or user id if storing a user
 * @param name 
 */
export function storeFile(data: any, id: string | number, name: string, mode?: apitypes.GameMode, type?: string) {
    mode = helper.tools.other.modeValidator(mode);
    try {
        let path = `${helper.vars.path.main}/cache/commandData/`;
        if (cacheById.some(x => name.includes(x))) {
            switch (true) {
                case (name.includes('mapdata')): {
                    const datamap: apitypes.Beatmap = (data as tooltypes.apiReturn).apiData as any;
                    let status = '';
                    switch (datamap.status) {
                        case 'ranked':
                            status = 'Ranked';
                            break;
                        case 'loved':
                            status = 'Loved';
                            break;
                        case 'approved':
                            status = 'Approved';
                            break;
                        case 'pending':
                            status = 'Pending';
                            break;
                        default: case 'graveyard':
                            status = 'Graveyard';
                            break;
                    }
                    path += `${name.toLowerCase()}${status}${id}.json`;
                } break;
                case (name.includes('bmsdata')): {
                    const datamap: apitypes.Beatmapset = (data as tooltypes.apiReturn).apiData as any;
                    let status = '';
                    switch (datamap.status) {
                        case 'ranked':
                            status = 'Ranked';
                            break;
                        case 'loved':
                            status = 'Loved';
                            break;
                        case 'approved':
                            status = 'Approved';
                            break;
                        case 'pending':
                            status = 'Pending';
                            break;
                        default: case 'graveyard':
                            status = 'Graveyard';
                            break;
                    }
                    path += `${name.toLowerCase()}${status}${id}.json`;
                } break;
                case (name.includes('osudata')): case (name.includes('scoredata')): {
                    path += `${name.toLowerCase()}${id}_${mode ?? 'osu'}.json`;
                } break;
                case (name.includes('maplistdata')): {
                    path += `${name.toLowerCase()}${id}_${type}.json`;
                } break;

                default: {
                    path += `${name.toLowerCase()}${id}.json`;
                } break;
            }
        } else {
            path += `${id}-${name.toLowerCase()}.json`;
        }
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        helper.tools.log.stdout(error);
        return error;
    }
}

/**
 * 
 * @param id command id. If fetching a map use the map id/md5 or user id if fetching a user
 * @param name 
 * @returns 
 */
export function findFile(id: string | number, name: string, mode?: apitypes.GameMode, type?: string) {
    const path = `${helper.vars.path.cache}/commandData/`;
    if (cacheById.some(x => name.includes(x))) {
        if (fs.existsSync(path + `${name.toLowerCase()}${id}.json`)) {
            return JSON.parse(fs.readFileSync(path + `${name.toLowerCase()}${id}.json`, 'utf-8'));
        }
        if (name.includes('osudata')) {
            if (fs.existsSync(path + `${name.toLowerCase()}${id}_${mode ?? 'osu'}.json`)) {
                return JSON.parse(fs.readFileSync(path + `${name.toLowerCase()}${id}_${mode ?? 'osu'}.json`, 'utf-8'));
            }
        }
        else if (name.includes('mapdata')) {
            if (fs.existsSync(path + `${name.toLowerCase()}Ranked${id}.json`)) {
                return JSON.parse(fs.readFileSync(path + `${name.toLowerCase()}Ranked${id}.json`, 'utf-8'));
            } else if (fs.existsSync(path + `${name.toLowerCase()}Loved${id}.json`)) {
                return JSON.parse(fs.readFileSync(path + `${name.toLowerCase()}Loved${id}.json`, 'utf-8'));
            } else if (fs.existsSync(path + `${name.toLowerCase()}Approved${id}.json`)) {
                return JSON.parse(fs.readFileSync(path + `${name.toLowerCase()}Approved${id}.json`, 'utf-8'));
            } else if (fs.existsSync(path + `${name.toLowerCase()}Graveyard${id}.json`)) {
                return JSON.parse(fs.readFileSync(path + `${name.toLowerCase()}Graveyard${id}.json`, 'utf-8'));
            }
        } else if (name.includes('bmsdata')) {
            if (fs.existsSync(path + `${name.toLowerCase()}Ranked${id}.json`)) {
                return JSON.parse(fs.readFileSync(path + `${name.toLowerCase()}Ranked${id}.json`, 'utf-8'));
            } else if (fs.existsSync(path + `${name.toLowerCase()}Loved${id}.json`)) {
                return JSON.parse(fs.readFileSync(path + `${name.toLowerCase()}Loved${id}.json`, 'utf-8'));
            } else if (fs.existsSync(path + `${name.toLowerCase()}Approved${id}.json`)) {
                return JSON.parse(fs.readFileSync(path + `${name.toLowerCase()}Approved${id}.json`, 'utf-8'));
            } else if (fs.existsSync(path + `${name.toLowerCase()}Graveyard${id}.json`)) {
                return JSON.parse(fs.readFileSync(path + `${name.toLowerCase()}Graveyard${id}.json`, 'utf-8'));
            }
        } else if (name.includes('maplistdata')) {
            if (fs.existsSync(path + `${name.toLowerCase()}${id}_${type}.json`)) {
                return JSON.parse(fs.readFileSync(path + `${name.toLowerCase()}${id}_${type}.json`, 'utf-8'));
            }
        }
        else {
            return {
                'error': 'File requested does not exist'
            };
        }
    } else {
        if (fs.existsSync(path + `${id}-${name.toLowerCase()}.json`)) {
            return JSON.parse(fs.readFileSync(path + `${id}-${name.toLowerCase()}.json`, 'utf-8'));
        } else {
            return {
                'error': 'File requested does not exist'
            };
        }
    }
}

export function getPreviousId(type: 'map' | 'user' | 'score', serverId: string) {
    try {
        const init = JSON.parse(
            fs.readFileSync(`${helper.vars.path.cache}/previous/${type}${serverId}.json`, 'utf-8')) as {
                id: string | false,
                apiData: apitypes.Score,
                mods: string,
                default: boolean,
                mode: apitypes.GameMode,
                last_access: string,
            };
        return init;
    } catch (error) {
        const data: {
            id: string | false,
            apiData: apitypes.Score,
            mods: string;
            default: boolean,
            mode: apitypes.GameMode,
            last_access: string,
        } = {
            id: false,
            apiData: null,
            mods: null,
            default: true,
            mode: 'osu',
            last_access: moment.default.utc().format("YYYY-MM-DD HH:mm:ss.SSS")
        };
        fs.writeFileSync(`${helper.vars.path.cache}/previous/${type}${serverId}.json`, JSON.stringify(data, null, 2));
        return data;
    }
}
export function writePreviousId(type: 'map' | 'user' | 'score', serverId: string, data: {
    id: string,
    apiData: apitypes.Score,
    mods: string,
    mode?: apitypes.GameMode,
    default?: boolean;
}) {
    if (!data.mods || data.mods.length == 0) {
        data.mods = 'NM';
    }
    data['default'] = false;
    data['last_access'] = moment.default.utc().format("YYYY-MM-DD HH:mm:ss.SSS");

    fs.writeFileSync(`${helper.vars.path.cache}/previous/${type}${serverId}.json`, JSON.stringify(data, null, 2));
    return;
}

export function debug(data: any, type: string, name: string, serverId: string, params: string) {
    const pars = params.replaceAll(',', '=');
    if (!fs.existsSync(`${helper.vars.path.cache}/debug/${type}`)) {
        fs.mkdirSync(`${helper.vars.path.cache}/debug/${type}`);
    }
    if (!fs.existsSync(`${helper.vars.path.cache}/debug/${type}/${name}/`)) {
        fs.mkdirSync(`${helper.vars.path.cache}/debug/${type}/${name}`);
    }
    try {
        fs.writeFileSync(`${helper.vars.path.cache}/debug/${type}/${name}/${pars}_${serverId}.json`, JSON.stringify(data, null, 2));
    } catch (error) {
        console.log('Error writing debug file');
        console.log(error);
    }
    return;
}

export function randomMap(type?: 'Ranked' | 'Loved' | 'Approved' | 'Qualified' | 'Pending' | 'WIP' | 'Graveyard') {
    let returnId = 4204;
    let errormsg = null;
    //check if cache exists
    const cache = fs.existsSync(`${helper.vars.path.cache}/commandData`);
    if (cache) {
        let mapsExist = fs.readdirSync(`${helper.vars.path.cache}/commandData`).filter(x => x.includes('mapdata'));
        const maps: tooltypes.apiReturn[] = [];
        if (type) {
            mapsExist = mapsExist.filter(x => x.includes(type));
        }

        for (let i = 0; i < mapsExist.length; i++) {
            if (mapsExist[i].includes('.json')) {
                const dataAsStr = fs.readFileSync(`${helper.vars.path.cache}/commandData/${mapsExist[i]}`, 'utf-8');
                maps.push(JSON.parse(dataAsStr) as tooltypes.apiReturn);
            }
        }
        if (maps.length > 0) {
            try {
                const curmap = maps[Math.floor(Math.random() * maps.length)];
                returnId = curmap?.apiData?.id ?? 4204;
            } catch (error) {
                errormsg = `There was an error while trying to parse the map ID`;
            }
        } else {
            errormsg = `No ${type ?? ''} maps found`;
        }
    } else {
        errormsg = 'No maps found';
    }
    return {
        returnId,
        err: errormsg
    };
}

export function getStoredMaps() {
    const cache = fs.existsSync(`${helper.vars.path.cache}/commandData`);
    if (cache) {
        const mapsExist = fs.readdirSync(`${helper.vars.path.cache}/commandData`).filter(x => x.includes('mapdata'));
        const maps: tooltypes.apiReturn[] = [];

        for (const data of mapsExist) {
            if (data.includes('.json')) {
                const dataAsStr = fs.readFileSync(`${helper.vars.path.cache}/commandData/${data}`, 'utf-8');
                maps.push(JSON.parse(dataAsStr) as tooltypes.apiReturn);
            }
        }
        return maps;
    }
    return [];
}

export function recommendMap(baseRating: number, retrieve: 'closest' | 'random', mode: apitypes.GameMode, maxRange?: number) {
    const maps = getStoredMaps();
    const obj = {
        hasErr: false,
        err: 'unknown',
        mapid: NaN,
        poolSize: 0,
        poolSizePreFilter: 0,
    };
    if (maps.length == 0) {
        obj['hasErr'] = true;
        obj['err'] = 'No maps found in cache';
    }
    if (retrieve == 'random' && !maxRange) {
        obj['hasErr'] = true;
        obj['err'] = 'Maximum range is invalid';
    }
    //sort maps by closest to given base rating
    const sorted = (maps.map(x => x.apiData) as apitypes.Beatmap[])
        .filter(x => x.mode == (mode ?? 'osu'))
        .sort((a, b) =>
            Math.abs(baseRating - a.difficulty_rating)
            - Math.abs(baseRating - b.difficulty_rating)
        );
    if (sorted.length == 0) {
        obj['hasErr'] = true;
        obj['err'] = 'No maps found for the given gamemode';
    }
    else if (retrieve == 'closest') {
        obj['mapid'] = sorted[0].id;
    }
    else if (retrieve == 'random') {
        const filter = sorted.filter(x =>
            (x?.difficulty_rating > baseRating - maxRange && x?.difficulty_rating < baseRating + maxRange)
        );
        if (filter.length > 0) {
            obj['mapid'] = filter[Math.floor(Math.random() * filter.length)].id;
        } else {
            obj['err'] = `No maps within ${maxRange}⭐ of ${baseRating}⭐`;
            obj['hasErr'] = true;
        }
        obj['poolSize'] = filter.length;
        obj['poolSizePreFilter'] = sorted.length;
    }

    return obj;
}


export async function userStatsCache(user: apitypes.UserStatistics[] | apitypes.User[], mode: apitypes.GameMode, type: 'Stat' | 'User') {
    switch (type) {
        case 'Stat': {
            user = user as apitypes.UserStatistics[];
            for (let i = 0; i < user.length; i++) {
                const curuser = user[i];
                if (!(curuser?.pp || !curuser?.global_rank)) {
                    break;
                }
                let findname = await helper.vars.statsCache.findOne({
                    where: {
                        osuid: curuser.user.id
                    }
                });
                if (findname as any == Promise<{ pending; }>) {
                    findname = null;
                }
                if (typeof findname == 'undefined' || !findname) {
                    await helper.vars.statsCache.create({
                        osuid: curuser.user.id,
                        country: curuser.user.country_code,
                        [mode + 'pp']: curuser.pp,
                        [mode + 'rank']: curuser.global_rank,
                        [mode + 'acc']: curuser.hit_accuracy
                    }).catch(e => {
                        console.log(e);
                    });
                } else {
                    await helper.vars.statsCache.update({
                        [mode + 'pp']: curuser.pp,
                        [mode + 'rank']: curuser.global_rank,
                        [mode + 'acc']: curuser.hit_accuracy
                    },
                        {
                            where: { osuid: curuser.user.id }
                        }).catch(e => {
                            console.log(e);
                        });
                }
            }
        } break;
        case 'User': {
            user = user as apitypes.User[];
            for (let i = 0; i < user.length; i++) {
                const curuser = user[i];
                if (!(
                    curuser.id ||
                    curuser?.statistics?.pp ||
                    curuser?.statistics?.global_rank ||
                    curuser?.statistics?.hit_accuracy
                )) {
                    continue;
                }
                let findname = await helper.vars.statsCache.findOne({
                    where: {
                        osuid: curuser.id
                    }
                });
                if (findname as any == Promise<{ pending; }>) {
                    findname = null;
                }

                if (typeof findname == 'undefined' || !findname) {
                    await helper.vars.statsCache.create({
                        osuid: `${curuser.id}`,
                        country: `${curuser.country_code}`,
                        [mode + 'pp']: `${curuser?.statistics?.pp ?? NaN}`,
                        [mode + 'rank']: `${curuser?.statistics?.global_rank ?? NaN}`,
                        [mode + 'acc']: `${curuser?.statistics?.hit_accuracy ?? NaN}`
                    });
                } else {
                    await helper.vars.statsCache.update({
                        [mode + 'pp']: `${curuser?.statistics?.pp ?? NaN}`,
                        [mode + 'rank']: `${curuser?.statistics?.global_rank ?? NaN}`,
                        [mode + 'acc']: `${curuser?.statistics?.hit_accuracy ?? NaN}`
                    },
                        {
                            where: { osuid: `${curuser.id}` }
                        });
                }
            }
        } break;
    }
    try {
        await userStatsCacheFix(mode);
    } catch (error) {

    }
}

export async function userStatsCacheFix(mode: apitypes.GameMode) {
    const users = await helper.vars.statsCache.findAll();
    const actualusers: {
        pp: string,
        rank: string,
        acc: string,
        uid: string;
    }[] = [];
    for (let i = 0; i < users.length; i++) {
        const curuser = {
            pp: users[i].dataValues[`${mode}pp`],
            rank: users[i].dataValues[`${mode}rank`],
            acc: users[i].dataValues[`${mode}acc`],
            uid: users[i].dataValues.osuid
        };
        actualusers.push(curuser);
    }

    actualusers.sort((a, b) => (+b.pp) - (+a.pp));

    for (let i = 0; i < actualusers.length; i++) {
        const curuser = actualusers[i];
        let givenrank = curuser.rank;
        //if user doesn't have a rank, make it null
        if (typeof curuser.pp == 'undefined' || !curuser.pp) {
            givenrank = null;
        }
        await helper.vars.statsCache.update({
            [`${mode}pp`]: curuser.pp,
            [`${mode}rank`]: givenrank,
            [`${mode}acc`]: curuser.acc,
        }, {
            where: { osuid: curuser.uid }
        }).catch(e => {
            console.log(e);
        });
    }
}

export async function getRankPerformance(type: 'pp->rank' | 'rank->pp', value: number, mode: apitypes.GameMode): Promise<{
    value: number,
    isEstimated: boolean,
}> {
    const users = await helper.vars.statsCache.findAll();
    let pprankarr: { pp: number, rank: number; }[] = [];
    for (let i = 0; i < users.length; i++) {
        const curuser = users[i].dataValues;
        if (!(isNaN(+curuser[`${mode ?? 'osu'}pp`]) || typeof curuser[`${mode ?? 'osu'}pp`] == 'undefined' || !curuser[`${mode ?? 'osu'}pp`] ||
            isNaN(+curuser[`${mode ?? 'osu'}rank`]) || typeof curuser[`${mode ?? 'osu'}rank`] == 'undefined' || !curuser[`${mode ?? 'osu'}rank`]
            //||   +curuser[`${mode ?? 'osu'}rank`] < 5
        )) {
            pprankarr.push({
                pp: +curuser[`${mode ?? 'osu'}pp`],
                rank: +curuser[`${mode ?? 'osu'}rank`]
            });
        }
    }
    let data: number[][] = [];
    //find if a value is in the dataset then use it otherwise use predict
    const tempChecking = pprankarr.filter((x) => {
        switch (type) {
            case 'pp->rank': {
                //pp within 10
                return (helper.tools.calculate.isWithinPercentage(+x.pp, +x.pp * 0.000001, +value) || helper.tools.calculate.isWithinValue(+x.pp, 1, +value)) ?? false;
            } break;
            case 'rank->pp': {
                //rank within 1%
                return helper.tools.calculate.isWithinPercentage(+x.rank, 1, +value) ?? false;
            } break;
        }
    });
    if (tempChecking.length > 0) {
        const rankData = helper.tools.calculate.stats(tempChecking.map(x => x.rank));
        const ppData = helper.tools.calculate.stats(tempChecking.map(x => x.pp));
        switch (type) {
            case 'pp->rank': {
                return { value: rankData.median ?? rankData.mean, isEstimated: false };
            } break;
            case 'rank->pp': {
                return { value: ppData.median ?? ppData.mean, isEstimated: false };
            } break;
        }
    }
    pprankarr = pprankarr.filter(x => x.rank > 5);
    switch (type) {
        case 'pp->rank': {
            data = pprankarr.map(x => [x.pp, Math.log10(x.rank)]);
            const line = stats.linearRegressionLine(stats.linearRegression(data));
            return { value: (10 ** line(value)), isEstimated: true };
            //log y
        }
            break;
        case 'rank->pp': {
            data = pprankarr.map(x => [Math.log10(x.rank), x.pp]);
            const line = stats.linearRegressionLine(stats.linearRegression(data));
            return { value: line(Math.log10(value)), isEstimated: true };
            //log x
        }
            break;
    }
}