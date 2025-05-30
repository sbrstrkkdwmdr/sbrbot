import axios from 'axios';
import * as fs from 'fs';
import * as osumodcalc from 'osumodcalculator';
import perf from 'perf_hooks';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as weathertypes from '../types/openmeteoapi.js';
import * as apitypes from '../types/osuapi.js';
import * as countrytypes from '../types/restcountriesapi.js';
import * as tooltypes from '../types/tools.js';
const baseUrl = 'https://osu.ppy.sh/api/v2/';

export function oAuth(): apitypes.OAuth {
    const str = fs.readFileSync(`${helper.vars.path.precomp}/config/osuauth.json`, 'utf-8');
    return JSON.parse(str) as apitypes.OAuth;
}

export async function PostOAuth() {
    return new Promise(async (resolve, reject) => {
        helper.tools.log.stdout('UPDATE TOKEN: https://osu.ppy.sh/oauth/token');
        /**
         * error: 'unsupported_grant_type',
         * error_description: 'The authorization grant type is not supported by the authorization server.',
         * hint: 'Check that all required parameters have been provided',
         * message: 'The authorization grant type is not supported by the authorization server.'
         */
        const newtoken: apitypes.OAuth = (await axios.post('https://osu.ppy.sh/oauth/token',
            `grant_type=client_credentials&client_id=${helper.vars.config.osu.clientId}&client_secret=${helper.vars.config.osu.clientSecret}&scope=public`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            },
        ).catch(err => {
            helper.tools.log.stdout(err);
            return {
                failed: true,
                data: {
                    err,
                }
            };
        })).data;
        if (newtoken?.access_token) {
            fs.writeFileSync(`${helper.vars.path.precomp}/config/osuauth.json`, JSON.stringify(newtoken));
        }
        resolve(true);
    });
}
export async function apiGet(input: tooltypes.apiInput) {
    const oauth = oAuth();
    const before = perf.performance.now();
    let data: tooltypes.apiReturn;
    let datafirst;
    let url = helper.tools.other.appendUrlParamsString(input.url, input.extra ?? []);
    url = encodeURI(url);
    // helper.tools.log.stdout(input.url);
    if (input.tries >= 5) {
        return {
            msTaken: 0,
            apiData: {},
            error: new Error("Exceeded amount of tries"),
        } as tooltypes.apiReturn;
    }
    try {
        helper.tools.log.stdout('OSU API GET: ' + input.url);
        datafirst = (await axios.get(url, {
            headers: {
                Authorization: `Bearer ${oauth.access_token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                "x-api-version": "20220705"
            }
        }).catch(err => {
            if (err?.response?.data?.authentication == 'basic') {
                return {
                    data: {
                        authentication: "basic"
                    }
                };
            } else {
                return {
                    data: { error: null, }
                };
            }
        })
        ).data;
        // helper.tools.log.stdout(datafirst);
    } catch (error) {
        data = {
            msTaken: perf.performance.now() - before,
            apiData: datafirst,
            error
        };
    }
    const after = perf.performance.now();

    try {
        if (datafirst?.authentication) {
            await PostOAuth();
            input.tries ? input.tries = input.tries + 1 : input.tries = 1;
            datafirst = await apiGet(input);
        }
        // if ('error' in datafirst && !input.type.includes('search')) {
        //     throw new Error(helper.vars.errors.apiError);
        // }
        data = {
            msTaken: after - before,
            apiData: datafirst
        };
    } catch (error) {
        data = {
            msTaken: after - before,
            apiData: datafirst,
            error: error ?? 'Unknown error'
        };
        fs.writeFileSync(`${helper.vars.path.main}/cache/errors/osuApi${Date.now()}.json`, JSON.stringify(data, null, 2));
    }
    while (data?.apiData?.apiData) {
        data = data.apiData;
    }
    return data;
}
export async function getUser(name: string | number, mode: string, extra: string[]) {
    const url = baseUrl + `users/${helper.tools.checks.toHexadecimal(name)}/${helper.tools.other.modeValidator(mode)}`;
    return await apiGet({
        url,
        extra
    }) as tooltypes.apiReturn<apitypes.User>;
}
export async function getUserActivity(name: string | number, extra: string[]) {
    const url = baseUrl + `users/${helper.tools.checks.toHexadecimal(name)}/recent_activity?limit=100`;
    return await apiGet({
        url,
        extra
    }) as tooltypes.apiReturn<apitypes.Event[]>;
}
export async function getScoreWithMode(id: string | number, mode: string, extra: string[]) {
    const url = baseUrl + `scores/${helper.tools.other.modeValidator(mode)}/${id}`;
    return await apiGet({
        url,
        extra
    }) as tooltypes.apiReturn<apitypes.Score>;
}
export async function getScore(id: string | number, extra: string[]) {
    const url = baseUrl + `scores/${id}`;
    return await apiGet({
        url,
        extra
    }) as tooltypes.apiReturn<apitypes.Score>;
}
export async function getScoresRecent(id: string | number, mode: string, extra: string[]) {
    const url = baseUrl + `users/${id}/scores/recent?mode=${helper.tools.other.modeValidator(mode)}&limit=100`;
    return await apiGet({
        url,
        extra
    }) as tooltypes.apiReturn<apitypes.Score[]>;
}
export async function getScoresBest(id: string | number, mode: string, extra: string[]) {
    const url = baseUrl + `users/${id}/scores/best?mode=${helper.tools.other.modeValidator(mode)}&limit=100`;
    return await apiGet({
        url,
        extra
    });
}
export async function getScoresFirst(id: string | number, mode: string, extra: string[]) {
    const url = baseUrl + `users/${id}/scores/firsts?mode=${helper.tools.other.modeValidator(mode)}&limit=100`;
    return await apiGet({
        url,
        extra
    }) as tooltypes.apiReturn<apitypes.Score[]>;
}
export async function getScoresPinned(id: string | number, mode: string, extra: string[]) {
    const url = baseUrl + `users/${id}/scores/pinned?mode=${helper.tools.other.modeValidator(mode)}&limit=100`;
    return await apiGet({
        url,
        extra
    }) as tooltypes.apiReturn<apitypes.Score[]>;
}
export async function getUserMapScores(userid: string | number, mapid: number, extra: string[]) {
    const url = baseUrl + `beatmaps/${mapid}/scores/users/${userid}/all?legacy_only=0`;
    return await apiGet({
        url,
        extra
    }) as tooltypes.apiReturn<apitypes.ScoreArrA>;
}
export async function getMapLeaderboard(id: number, mode: string, mods: string, extra: string[]) {
    let url = baseUrl + `beatmaps/${id}/scores?mode=${helper.tools.other.modeValidator(mode)}&limit=100`;
    if (mods) {
        const tempmods = osumodcalc.modHandler(mods, mode as apitypes.GameMode);
        tempmods.forEach(mod => {
            url += `&mods[]=${mod}`;
        });
    }
    return await apiGet({
        url,
        extra
    }) as tooltypes.apiReturn<apitypes.BeatmapScores<apitypes.Score>>;
}
export async function getMapLeaderboardNonLegacy(id: number, mode: string, mods: string, extra: string[]) {
    mode = helper.tools.other.modeValidator(mode);
    let url = baseUrl + `beatmaps/${id}/solo-scores?mode=${mode}&limit=100`;
    if (mods) {
        const tempmods = osumodcalc.modHandler(mods, mode as apitypes.GameMode);
        tempmods.forEach(mod => {
            url += `&mods[]=${mod}`;
        });
    }
    return await apiGet({
        url,
        extra
    }) as tooltypes.apiReturn<apitypes.BeatmapScores<apitypes.Score>>;
}
export async function getMap(id: number | string, extra?: string[]) {
    const url = baseUrl + 'beatmaps/' + id;
    return await apiGet({
        url,
        extra
    }) as tooltypes.apiReturn<apitypes.Beatmap>;
}
export async function getMapSha(md5: string, extra: string[]) {
    const url = baseUrl + `beatmaps/lookup?checksum=${md5}`;
    return await apiGet({
        url,
        extra
    }) as tooltypes.apiReturn<apitypes.Beatmap>;
}
export async function getMapset(id: string | number, extra: string[]) {
    const url = baseUrl + `beatmapsets/${id}`;
    return await apiGet({
        url,
        extra
    }) as tooltypes.apiReturn<apitypes.Beatmapset>;
}
export async function getMapSearch(search: string, extra: string[]) {
    const url = baseUrl + `beatmapsets/search?q=${search}`;
    return await apiGet({
        url,
        extra
    }) as tooltypes.apiReturn<apitypes.BeatmapsetSearch>;
}
export async function getUserMaps(id: number, category: string, extra: string[]) {
    const url = baseUrl + `users/${id}/beatmapsets/${category}?limit=100`;
    return await apiGet({
        url,
        extra
    }) as tooltypes.apiReturn<apitypes.Beatmapset[]>;
}

export async function getUserMostPlayed(id: number, extra: string[]) {
    const url = baseUrl + `users/${id}/beatmapsets/most_played?limit=100`;
    return await apiGet({
        url,
        extra
    }) as tooltypes.apiReturn<apitypes.BeatmapPlayCountArr>;
}
export async function getRankings(mode: string, type: string, extra: string[]) {
    const url = baseUrl + `rankings/${helper.tools.other.modeValidator(mode)}/${type}`;
    return await apiGet({
        url,
        extra
    }) as tooltypes.apiReturn<apitypes.Rankings>;
}

export async function dlMap(mapid: number | string, curCall: number, lastUpdated: Date) {
    const mapFiles = fs.readdirSync(`${helper.vars.path.main}/files/maps`);
    let isFound = false;
    let mapDir = '';
    if (!mapFiles.some(x => x == mapid + '.osu') || !fs.existsSync(`${helper.vars.path.main}/files/maps/` + mapid + '.osu')) {
        const url = `https://osu.ppy.sh/osu/${mapid}`;
        const thispath = `${helper.vars.path.main}/files/maps/${mapid}.osu`;
        mapDir = thispath;
        if (!fs.existsSync(thispath)) {
            fs.mkdirSync(`${helper.vars.path.main}/files/maps/`, { recursive: true });
        }
        helper.tools.log.stdout('DOWNLOAD MAP: ' + url);
        const res = await axios.get(url);
        fs.writeFileSync(thispath, res.data, 'utf-8');
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('w');
            }, 200);
        });
    } else {
        for (let i = 0; i < mapFiles.length; i++) {
            const curmap = mapFiles[i];
            if (curmap.includes(`${mapid}`)) {
                mapDir = `${helper.vars.path.main}/files/maps/${curmap}`;
            }
        }
        isFound = true;
    }
    const fileStat = fs.statSync(mapDir);
    if (fileStat.size < 500) {
        await fs.unlinkSync(mapDir);
        if (!curCall) {
            curCall = 0;
        }
        if (curCall > 3) {
            throw new Error('Map file size is too small. Deleting file...');
        } else {
            return await dlMap(mapid, curCall + 1, lastUpdated);
        }
    }
    if (fileStat.birthtimeMs < lastUpdated.getTime() && isFound == true) {
        await fs.unlinkSync(mapDir);
        return await dlMap(mapid, curCall + 1, lastUpdated);
    }
    return mapDir;
}

export function mapImages(mapSetId: string | number) {
    return {
        //smaller res of full/raw
        thumbnail: `https://b.ppy.sh/thumb/${mapSetId}l.jpg`,
        thumbnailLarge: `https://b.ppy.sh/thumb/${mapSetId}l.jpg`,

        //full res of map bg
        full: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/fullsize.jpg`,
        raw: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/raw.jpg`,

        //same width but shorter height
        cover: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/cover.jpg`,
        cover2x: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/cover@2x.jpg`,

        //smaller ver of cover
        card: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/card.jpg`,
        card2x: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/card@2x.jpg`,

        //square
        list: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/list.jpg`,
        list2x: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/list@2x.jpg`,

        //shorter height ver of cover
        slimcover: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/slimcover.jpg`,
        slimcover2x: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/slimcover@2x.jpg`,

    };
}

// weather api

export async function getLocation(name: string) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${name.replaceAll(' ', '+')}&count=10&language=en&format=json`;
    helper.tools.log.stdout('LOCATION: ' + url);
    const data = await axios.get(url)
        .then(x => x.data)
        .catch(err => {
            helper.tools.log.stdout(err);
            return { error: true };
        }
        );


    return data as { results: weathertypes.geoLocale[]; };
}

export async function getWeather(
    latitude: number,
    longitude: number,
    location: weathertypes.geoLocale,
) {

    if (isNaN(latitude) || isNaN(longitude)) {
        return 'error - NaN values given';
    }
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}`
        + "&hourly=temperature_2m,precipitation,rain,pressure_msl,windspeed_10m,windgusts_10m,precipitation_probability,showers,snowfall"
        + "&current_weather=true&forecast_days=3&past_days=2"
        + "&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,precipitation_probability_min,precipitation_probability_mean,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant"
        + `&timezone=${location.timezone}`;
    helper.tools.log.stdout('WEATHER: ' + url);
    const data = await axios.get(url)
        .then(x => x.data)
        .catch(err => {
            helper.tools.log.stdout(err);
            return { error: true, reason: "timeout" };
        });
    return data as weathertypes.weatherData;

}

export function weatherCodeToString(code: number) {
    let string = 'Clear';
    let icon = '';
    switch (code) {
        case 0: default:
            string = 'Clear sky';
            icon = '☀';
            break;
        case 1:
            string = 'Mostly clear';
            icon = '🌤';
            break;
        case 2:
            string = 'Partly Cloudy';
            icon = '⛅';
            break;
        case 3:
            string = 'Overcast';
            icon = '☁';
            break;
        case 45:
            string = 'Fog';
            icon = '🌁';
            break;
        case 48:
            string = 'Fog'; //wtf is deposting rime fog
            icon = '🌁';
            break;
        case 51:
            string = 'Light drizzle';
            icon = '🌧';
            break;
        case 53:
            string = 'Moderate drizzle';
            icon = '🌧';
            break;
        case 55:
            string = 'Heavy drizzle';
            icon = '🌧';
            break;
        case 56:
            string = 'Light freezing drizzle';
            icon = '🌧';
            break;
        case 57:
            string = 'Heavy freezing drizzle';
            icon = '🌧';
            break;
        case 61:
            string = 'Light rain';
            icon = '🌧';
            break;
        case 63:
            string = 'Moderate rain';
            icon = '🌧';
            break;
        case 65:
            string = 'Heavy rain';
            icon = '🌧';
            break;
        case 66:
            string = 'Light freezing rain';
            icon = '🌧';
            break;
        case 67:
            string = 'Heavy freezing rain';
            icon = '🌧';
            break;
        case 71:
            string = 'Light snow';
            icon = '❄';
            break;
        case 73:
            string = 'Moderate snow';
            icon = '❄';
            break;
        case 75:
            string = 'Heavy snow';
            icon = '❄';
            break;
        case 77:
            string = 'Snow grains';
            icon = '❄';
            break;
        case 80:
            string = 'Light showers';
            icon = '🌧';
            break;
        case 81:
            string = 'Moderate showers';
            icon = '🌧';
            break;
        case 82:
            string = 'Heavy showers';
            icon = '🌧';
            break;
        case 85:
            string = 'Light snow showers';
            icon = '❄';
            break;
        case 86:
            string = 'Heavy snow showers';
            icon = '❄';
            break;
        case 95:
            string = 'Thunderstorms';
            icon = '⛈';
            break;
        case 96:
            string = 'Thunderstorms and light hail';
            icon = '⛈';
            break;
        case 99:
            string = 'Thunderstorms and heavy hail';
            icon = '⛈';
            break;
    }
    return {
        string, icon
    };

}

/**
 * converts an angle to a wind direction (north, north east, north east east whatever)
 * @returns direction the wind is coming from 
*/
export function windToDirection(angle: number, reverse?: boolean) {
    //thank you chatGPT

    // Define an array of wind directions in clockwise order
    const directions = [
        { name: 'North', travels: 'South', emoji: '⬇', short: 'N', },
        { name: 'North-Northeast', travels: 'South-Southwest', emoji: '↙', short: 'NNE', },
        { name: 'Northeast', travels: 'Southwest', emoji: '↙', short: 'NE', },
        { name: 'East-Northeast', travels: 'West-Southwest', emoji: '↙', short: 'ENE', },
        { name: 'East', travels: 'West', emoji: '⬅', short: 'E', },
        { name: 'East-Southeast', travels: 'West-Northwest', emoji: '↖', short: 'ESE', },
        { name: 'Southeast', travels: 'Northwest', emoji: '↖', short: 'SE', },
        { name: 'South-Southeast', travels: 'North-Northwest', emoji: '↖', short: 'SSE', },
        { name: 'South', travels: 'North', emoji: '⬆', short: 'S', },
        { name: 'South-Southwest', travels: 'North-Northeast', emoji: '↗', short: 'SSW', },
        { name: 'Southwest', travels: 'Northeast', emoji: '↗', short: 'SW', },
        { name: 'West-Southwest', travels: 'East-Northeast', emoji: '↗', short: 'WSW', },
        { name: 'West', travels: 'East', emoji: '➡', short: 'W', },
        { name: 'West-Northwest', travels: 'East-Southeast', emoji: '↘', short: 'WNW', },
        { name: 'Northwest', travels: 'Southeast', emoji: '↘', short: 'NW', },
        { name: 'North-Northwest', travels: 'South-Southeast', emoji: '↘', short: 'NNW', },
        { name: 'North', travels: 'South', emoji: '⬇', short: 'N', },
        { name: 'North-Northeast', travels: 'South-Southwest', emoji: '↙', short: 'NNE', },
        { name: 'Northeast', travels: 'Southwest', emoji: '↙', short: 'NE', },
        { name: 'East-Northeast', travels: 'West-Southwest', emoji: '↙', short: 'ENE', },
        { name: 'East', travels: 'West', emoji: '⬅', short: 'E', },
        { name: 'East-Southeast', travels: 'West-Northwest', emoji: '↖', short: 'ESE', },
        { name: 'Southeast', travels: 'Northwest', emoji: '↖', short: 'SE', },
        { name: 'South-Southeast', travels: 'North-Northwest', emoji: '↖', short: 'SSE', },
        { name: 'South', travels: 'North', emoji: '⬆', short: 'S', },
        { name: 'South-Southwest', travels: 'North-Northeast', emoji: '↗', short: 'SSW', },
        { name: 'Southwest', travels: 'Northeast', emoji: '↗', short: 'SW', },
        { name: 'West-Southwest', travels: 'East-Northeast', emoji: '↗', short: 'WSW', },
        { name: 'West', travels: 'East', emoji: '➡', short: 'W', },
        { name: 'West-Northwest', travels: 'East-Southeast', emoji: '↘', short: 'WNW', },
        { name: 'Northwest', travels: 'Southeast', emoji: '↘', short: 'NW', },
        { name: 'North-Northwest', travels: 'South-Southeast', emoji: '↘', short: 'NNW', },
    ];

    // Normalize the angle to the range 0 to 359 degrees
    const normalizedAngle = (angle % 360 + 360) % 360;

    // Calculate the index corresponding to the wind direction
    const index =
        reverse == true ? Math.floor(normalizedAngle / 22.5) + directions.length / 4 :
            Math.floor(normalizedAngle / 22.5);

    // Retrieve the wind direction from the array
    return directions[index];
}

// country api
export async function getCountryData(search: string, type: countrytypes.countryDataSearchTypes) {
    let baseURL = `https://restcountries.com/v3.1/`;
    search = encodeURI(search);
    switch (type) {
        case 'all':
            baseURL += `all`;
            break;
        case 'name': case 'fullname':
            baseURL += `name/${search}`;
            if (type == 'fullname') {
                baseURL += `?fullText=true`;
            }
            break;
        case 'calling': //not yet supported in v3 as of 2023-11-15
            baseURL += `all`;
            break;
        case 'capital':
        case 'currency':
        case 'demonym':
        case 'language':
        case 'region':
        case 'subregion':
        case 'translation':
            baseURL += `${type}/${search}`;
            break;
        case 'code':
            baseURL += `alpha/${search}`;
            break;
        case 'codes':
            baseURL += `alpha?codes=${search}`;
            break;
    }
    let data;
    try {
        helper.tools.log.stdout('COUNTRY: ' + baseURL);
        data = await axios.get(baseURL);
    } catch (err) {
        data = {
            error: err,
        };
    }
    return data;
}

// tenor

export async function getGif(find: string) {
    helper.tools.log.stdout(`GIF: https://g.tenor.com/v2/search?q=${find}&key=REDACTED&limit=50`);
    if (helper.vars.config.tenorKey == 'INVALID_ID') {
        return {
            data: {
                error: "Invalid or missing tenor key",
                results: [],
            }
        };
    };
    const dataf = await axios.get(`https://g.tenor.com/v2/search?q=${find}&key=${helper.vars.config.tenorKey}&limit=50`).catch(err => {
        return {
            data: {
                error: err
            }
        };
    });
    return dataf;
}