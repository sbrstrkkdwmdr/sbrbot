//https://restcountries.com/#endpoints-all
export type countryData = {
    name: {
        common: string,
        official: string,
        nativeName: languageList,
    };
    tld: string[],
    cca2: string,
    ccn3: string,
    cca3: string,
    cioc: string,
    independent: boolean,
    status: string,
    unMember: boolean,
    currencies: currencies[],
    idd: {
        root: string,
        suffixes: string[],
    },
    capital: string[],
    altSpellings: string[],
    region: string,
    subregion: string,
    languages: languageList,
    translations: languageList,
    latlng: number[],
    landlocked: boolean,
    borders: string[];
    area: number,
    demonyms: languageList,
    flag: string,
    maps: {
        googleMaps: string,
        openStreetMaps: string,
    },
    population: number,
    gini: object,
    fifa: string,
    car: {
        signs: string[],
        side: "right" | "left";
    },
    timezones: string[],
    continents: string[],
    flags: {
        png: string,
        svg: string,
        alt: string;
    },
    coatOfArms: {
        png: string,
        svg: string;
    },
    startOfWeek: string,
    capitalInfo: {
        latlng: number[];
    },
    postalCode: {
        format: string,
        regex: string;
    };
};

export type countryDataErr = {
    status: number,
    message: string;
};

export type languageList = {
    aar?: langName | string | langDemonym,
    abk?: langName | string | langDemonym,
    afr?: langName | string | langDemonym,
    aka?: langName | string | langDemonym,
    amh?: langName | string | langDemonym,
    ara?: langName | string | langDemonym,
    arg?: langName | string | langDemonym,
    asm?: langName | string | langDemonym,
    ava?: langName | string | langDemonym,
    ave?: langName | string | langDemonym,
    aym?: langName | string | langDemonym,
    aze?: langName | string | langDemonym,
    bak?: langName | string | langDemonym,
    bam?: langName | string | langDemonym,
    bel?: langName | string | langDemonym,
    ben?: langName | string | langDemonym,
    bis?: langName | string | langDemonym,
    bod?: langName | string | langDemonym,
    bos?: langName | string | langDemonym,
    bre?: langName | string | langDemonym,
    bul?: langName | string | langDemonym,
    cat?: langName | string | langDemonym,
    ces?: langName | string | langDemonym,
    cha?: langName | string | langDemonym,
    che?: langName | string | langDemonym,
    chu?: langName | string | langDemonym,
    chv?: langName | string | langDemonym,
    cor?: langName | string | langDemonym,
    cos?: langName | string | langDemonym,
    cre?: langName | string | langDemonym,
    cym?: langName | string | langDemonym,
    dan?: langName | string | langDemonym,
    deu?: langName | string | langDemonym,
    div?: langName | string | langDemonym,
    dzo?: langName | string | langDemonym,
    ell?: langName | string | langDemonym,
    eng?: langName | string | langDemonym,
    epo?: langName | string | langDemonym,
    est?: langName | string | langDemonym,
    eus?: langName | string | langDemonym,
    ewe?: langName | string | langDemonym,
    fao?: langName | string | langDemonym,
    fas?: langName | string | langDemonym,
    fij?: langName | string | langDemonym,
    fin?: langName | string | langDemonym,
    fra?: langName | string | langDemonym,
    fry?: langName | string | langDemonym,
    ful?: langName | string | langDemonym,
    gla?: langName | string | langDemonym,
    gle?: langName | string | langDemonym,
    glg?: langName | string | langDemonym,
    glv?: langName | string | langDemonym,
    grn?: langName | string | langDemonym,
    guj?: langName | string | langDemonym,
    hat?: langName | string | langDemonym,
    hau?: langName | string | langDemonym,
    heb?: langName | string | langDemonym,
    her?: langName | string | langDemonym,
    hin?: langName | string | langDemonym,
    hmo?: langName | string | langDemonym,
    hrv?: langName | string | langDemonym,
    hun?: langName | string | langDemonym,
    hye?: langName | string | langDemonym,
    ibo?: langName | string | langDemonym,
    ido?: langName | string | langDemonym,
    iii?: langName | string | langDemonym,
    iku?: langName | string | langDemonym,
    ile?: langName | string | langDemonym,
    ina?: langName | string | langDemonym,
    ind?: langName | string | langDemonym,
    ipk?: langName | string | langDemonym,
    isl?: langName | string | langDemonym,
    ita?: langName | string | langDemonym,
    jav?: langName | string | langDemonym,
    jpn?: langName | string | langDemonym,
    kal?: langName | string | langDemonym,
    kan?: langName | string | langDemonym,
    kas?: langName | string | langDemonym,
    kat?: langName | string | langDemonym,
    kau?: langName | string | langDemonym,
    kaz?: langName | string | langDemonym,
    khm?: langName | string | langDemonym,
    kik?: langName | string | langDemonym,
    kin?: langName | string | langDemonym,
    kir?: langName | string | langDemonym,
    kom?: langName | string | langDemonym,
    kon?: langName | string | langDemonym,
    kor?: langName | string | langDemonym,
    kua?: langName | string | langDemonym,
    kur?: langName | string | langDemonym,
    lao?: langName | string | langDemonym,
    lat?: langName | string | langDemonym,
    lav?: langName | string | langDemonym,
    lim?: langName | string | langDemonym,
    lin?: langName | string | langDemonym,
    lit?: langName | string | langDemonym,
    ltz?: langName | string | langDemonym,
    lub?: langName | string | langDemonym,
    lug?: langName | string | langDemonym,
    mah?: langName | string | langDemonym,
    mal?: langName | string | langDemonym,
    mar?: langName | string | langDemonym,
    mkd?: langName | string | langDemonym,
    mlg?: langName | string | langDemonym,
    mlt?: langName | string | langDemonym,
    mon?: langName | string | langDemonym,
    mri?: langName | string | langDemonym,
    msa?: langName | string | langDemonym,
    mya?: langName | string | langDemonym,
    nau?: langName | string | langDemonym,
    nav?: langName | string | langDemonym,
    nbl?: langName | string | langDemonym,
    nde?: langName | string | langDemonym,
    ndo?: langName | string | langDemonym,
    nep?: langName | string | langDemonym,
    nld?: langName | string | langDemonym,
    nno?: langName | string | langDemonym,
    nob?: langName | string | langDemonym,
    nor?: langName | string | langDemonym,
    nya?: langName | string | langDemonym,
    oci?: langName | string | langDemonym,
    oji?: langName | string | langDemonym,
    ori?: langName | string | langDemonym,
    orm?: langName | string | langDemonym,
    oss?: langName | string | langDemonym,
    pan?: langName | string | langDemonym,
    pli?: langName | string | langDemonym,
    pol?: langName | string | langDemonym,
    por?: langName | string | langDemonym,
    pus?: langName | string | langDemonym,
    que?: langName | string | langDemonym,
    roh?: langName | string | langDemonym,
    ron?: langName | string | langDemonym,
    run?: langName | string | langDemonym,
    rus?: langName | string | langDemonym,
    sag?: langName | string | langDemonym,
    san?: langName | string | langDemonym,
    sin?: langName | string | langDemonym,
    slk?: langName | string | langDemonym,
    slv?: langName | string | langDemonym,
    sme?: langName | string | langDemonym,
    smo?: langName | string | langDemonym,
    sna?: langName | string | langDemonym,
    snd?: langName | string | langDemonym,
    som?: langName | string | langDemonym,
    sot?: langName | string | langDemonym,
    spa?: langName | string | langDemonym,
    sqi?: langName | string | langDemonym,
    srd?: langName | string | langDemonym,
    srp?: langName | string | langDemonym,
    ssw?: langName | string | langDemonym,
    sun?: langName | string | langDemonym,
    swa?: langName | string | langDemonym,
    swe?: langName | string | langDemonym,
    tah?: langName | string | langDemonym,
    tam?: langName | string | langDemonym,
    tat?: langName | string | langDemonym,
    tel?: langName | string | langDemonym,
    tgk?: langName | string | langDemonym,
    tgl?: langName | string | langDemonym,
    tha?: langName | string | langDemonym,
    tir?: langName | string | langDemonym,
    ton?: langName | string | langDemonym,
    tsn?: langName | string | langDemonym,
    tso?: langName | string | langDemonym,
    tuk?: langName | string | langDemonym,
    tur?: langName | string | langDemonym,
    twi?: langName | string | langDemonym,
    uig?: langName | string | langDemonym,
    ukr?: langName | string | langDemonym,
    urd?: langName | string | langDemonym,
    uzb?: langName | string | langDemonym,
    ven?: langName | string | langDemonym,
    vie?: langName | string | langDemonym,
    vol?: langName | string | langDemonym,
    wln?: langName | string | langDemonym,
    wol?: langName | string | langDemonym,
    xho?: langName | string | langDemonym,
    yid?: langName | string | langDemonym,
    yor?: langName | string | langDemonym,
    zha?: langName | string | langDemonym,
    cho?: langName | string | langDemonym,
    zul?: langName | string | langDemonym,
};

export type langName = {
    official: string,
    common: string,
};
export type langDemonym = {
    f: string,
    m: string,
};

export type currencies = any

export type currency = {
    name: string,
    symbol: string;
};

export type countryDataSearchTypes = 
'all' | 
'name' | 
'fullname' |
'code' |
'codes' |
'currency' |
'demonym' |
'language' |
'capital' | 
'calling' |
'region' | 
'subregion' | 
'translation' 