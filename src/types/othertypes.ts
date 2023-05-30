
/**
 * https://osustats.respektive.pw/counts/<user_id>
 */
export type osustatsType = {
    beatmaps_amount: number,
    user_id: number,
    username: string,
    country: string,
    top1s: number,
    top1s_rank: number,
    top8s: number,
    top8s_rank: number,
    top15s: number,
    top15s_rank: number,
    top25s: number,
    top25s_rank: number,
    top50s: number,
    top50s_rank: number,
    top100s: number,
    top100s_rank: number,
};

export type geoLocale = {
    id: number,
    name: string,
    latitude: number,
    longitude: number,
    elevation: number,
    feature_code: string,
    country_code: string,
    admin1_id: number,
    admin3_id: number,
    admin4_id: number,
    timezone: string,
    population: number,
    postcodes: string[],
    country_id: number,
    country: string,
    admin1?: string,
    admin2?: string,
    admin3?: string,
    admin4?: string,
};

export type geoResults = { results: geoLocale[]; };


export type weatherData = {
    latitude: number,
    longitude: number,
    generationtime_ms: number,
    utc_offset_seconds: number,
    timezone: string,
    timezone_abbreviation: string,
    elevation: number;
    current_weather?: {
        temperature: number,
        windspeed: number,
        winddirection: number,
        weathercode: number,
        is_day: number,
        time: string
    }
    hourly?: weatherDataTypes,
    hourly_units?: weatherDataUnits
    daily?: weatherDataTypes
    daily_units?: weatherDataUnits,
};

type weatherDataTypes = {
    time?: string[],
    temperature_2m?: string[],
    pressure_msl?: string[],
    windspeed_10m?: string[],
    rain?: string[],
}

type weatherDataUnits = {
    time?: string,
    temperature_2m?: "°C" | string,
    pressure_msl?: string,
    windspeed_10m?: string,
    rain?: string,

}