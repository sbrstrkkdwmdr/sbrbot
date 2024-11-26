import * as Discord from 'discord.js';
import { ApplicationCommandOptionType } from 'discord.js';
/**
 * @info Gamemode options
 */
const modeopts: Discord.ApplicationCommandOptionChoiceData<string>[] = [
    { name: 'osu', value: 'osu' },
    { name: 'taiko', value: 'taiko' },
    { name: 'catch', value: 'fruits' },
    { name: 'mania', value: 'mania' }
];
/**
 * @info what to sort plays by
 */
const playsortopts: Discord.ApplicationCommandOptionChoiceData<string>[] = [
    { name: 'Performance points', value: 'pp' },
    { name: 'Score', value: 'score' },
    { name: 'Most recent', value: 'recent' },
    { name: 'Accuracy', value: 'acc' },
    { name: 'Combo', value: 'combo' },
    { name: 'Misses', value: 'miss' },
    { name: 'Rank', value: 'rank' },
];
const skincmdopts: Discord.ApplicationCommandOptionChoiceData<string>[] = [
    { name: 'SaberStrikeCustom', value: '1' },
    { name: 'SaberStrikeCustom[v2]', value: '2' },
    { name: '『SaberStrike [Type X]』', value: '3' },
    { name: 'SaberStrike 『Y』', value: '4' },
    { name: 'SaberStrike 『Z』', value: '5' },
    { name: 'SaberStrike 『0』', value: '6' },
    { name: 'SaberStrike 『1』', value: '7' },
    { name: 'sbr', value: '8' },
    { name: 'prjct. sbr', value: '9' },
    { name: 'SBR UnDefined (UD)', value: '10' },
    { name: 'sbr v11', value: '11' },
    { name: 'Cark_irl', value: 'b1' },
    { name: '@koifish', value: 'b2' },
    { name: 'Kanojo Mizuhara', value: 'b3' },
    { name: "Saber's AMOGUS", value: 'b4' },
    { name: 'SaberStrike『0』_-Levi-_ edit', value: 'b5' },
    { name: 'SaberStrike『Soragaton』', value: 'b6' },
    { name: 'sbr『-hANOJI』', value: 'b7' }
];

const mathcmdopts: Discord.ApplicationCommandOptionChoiceData<string>[] = [
    //{ name: 'Help', value: 'help' },
    { name: 'Square root', value: 'sqrt' },
    { name: 'Square', value: 'square' },
    { name: 'Factorial (!)', value: '!' },
    { name: 'Highest common factor', value: 'hcf' },
    { name: 'Lowest common multiple', value: 'lcm' },
    { name: 'Approach rate with doubletime', value: 'ardt' },
    { name: 'Approach rate if halftime', value: 'arht' },
    { name: 'Circumference of a circle', value: 'circumference' },
    { name: 'Area of a circle', value: 'circlearea' },
    { name: 'Length of the hypotenuse (pythagorus theorem)', value: 'pythag' },
    { name: 'Conversion to scientific notation (significant figures)', value: 'sigfig' },
    { name: 'OD if doubletime', value: 'oddt' },
    { name: 'OD if halftime', value: 'odht' },
    { name: 'OD in milliseconds', value: 'odms' },
    { name: 'Approach rate in milliseconds', value: 'arms' },
    { name: 'Milliseconds to Approach rate', value: 'msar' },
    { name: 'Mod integer to string', value: 'modintstring' }


];

const conversionopts: Discord.ApplicationCommandOptionChoiceData<string>[] = [
    //https://www.ewh.ieee.org/soc/ias/pub-dept/abbreviation.pdf

    //help
    { name: 'Help', value: 'help' },
    { name: 'SI units conversion', value: 'metricprefixes' },

    //temp
    { name: 'Celsius', value: 'c' },
    { name: 'Kelvin', value: 'k' },
    { name: 'Fahrenheit', value: 'f' },
    //3

    //distance
    { name: 'Inches', value: 'in' },
    { name: 'Feet', value: 'ft' },
    { name: 'Metres', value: 'm' },
    { name: 'Miles', value: 'mi' },
    //4

    //time
    { name: 'Seconds', value: 's' },
    { name: 'Minutes', value: 'min' },
    { name: 'Days', value: 'day' },
    { name: 'Hours', value: 'h' },
    { name: 'Years', value: 'year' },
    //5

    //volume

    { name: 'Fluid ounce', value: 'floz' }, //US
    { name: 'Cup', value: 'cup' }, //US
    { name: 'Pint', value: 'pt' }, //US
    { name: 'Litre', value: 'l' }, //100cm^3
    { name: 'Gallon', value: 'gal' }, //US, not imperial

    { name: 'Metres^3', value: 'm3' }, // 10,000vm^3

    //7

    //mass/weight
    { name: 'Grams', value: 'g' },
    { name: 'Ounce', value: 'oz' },
    { name: 'Pound', value: 'lb' },
    { name: 'Metric Tonne', value: 'ton' }
    //4

];

const gifopts: Discord.ApplicationCommandOptionChoiceData<string>[] = [
    { name: 'cry about it', value: 'cry about it' },
    { name: 'speaking', value: 'speech bubble' },
    { name: 'chad speaking', value: 'chad speak' },
    { name: 'live reaction', value: 'reaction' },
    { name: 'skill issue', value: 'skill issue' },
    { name: 'no bitches', value: 'no bitches' },
    { name: 'agree', value: 'agree' },
    { name: 'cope harder', value: 'cope' },
    { name: 'disagree', value: 'disagree' },
    { name: 'i dont care', value: 'nocare' },
    { name: 'spelling issue', value: 'misspell' },
    { name: 'compliment', value: 'compliment' },
    { name: 'insult', value: 'insult' },
    { name: 'ratio', value: 'ratio' },
    { name: 'reaction to that information', value: 'reaction to info' }
];


const timezoneopts: Discord.ApplicationCommandOptionChoiceData<string>[] = [
    { name: 'Abidjan (Africa, Côte d’Ivoire/Ivory Coast)', value: 'Africa/Abidjan' },
    { name: 'Accra (Africa, Ghana)', value: 'Africa/Accra' },
    { name: 'Algiers (Africa, Algeria)', value: 'Africa/Algiers' },
    { name: 'Bissau (Africa, Guinea-Bissau)', value: 'Africa/Bissau' },
    { name: 'Cairo (Africa, Egypt)', value: 'Africa/Cairo' },
    { name: 'Casablanca (Africa, Morocco)', value: 'Africa/Casablanca' },
    { name: 'Cueta (Africa, Spain)', value: 'Africa/Ceuta' },
    { name: 'El Aaiun (Africa, Western Sahara)', value: 'Africa/El_Aaiun' },
    { name: 'Johannesburg (Africa, South Africa)', value: 'Africa/Johannesburg' },
    { name: 'Juba (Africa, South Sudan)', value: 'Africa/Juba' },
    { name: 'Khartoum (Africa, Sudan)', value: 'Africa/Khartoum' },
    { name: 'Lagos (Africa, Nigeria)', value: 'Africa/Lagos' },
    { name: 'Maputo (Africa, Mozambique)', value: 'Africa/Maputo' },
    { name: 'Monrovia (Africa, Liberia)', value: 'Africa/Monrovia' },
    { name: 'Nairobi (Africa, Kenya)', value: 'Africa/Nairobi' },
    { name: 'Ndjamena (Africa, Chad)', value: 'Africa/Ndjamena' },
    { name: 'Sao Tome (Africa, São Tomé and Príncipe)', value: 'Africa/Sao_Tome' },
    { name: 'Tripoli (Africa, Libya)', value: 'Africa/Tripoli' },
    { name: 'Tunis (Africa, Tunisia)', value: 'Africa/Tunis' },
    { name: 'Windhoek (Africa, Namibia)', value: 'Africa/Windhoek' },
    //
    //
    //
    { name: 'Adak (America, USA)', value: 'America/Adak' },
    { name: 'Anchorage (America, USA)', value: 'America/Anchorage' },
    { name: 'Araguaina (America, Brazil)', value: 'America/Araguaina' },
    { name: 'Buenos Aires (America, Argentina)', value: 'America/Argentina/Buenos_Aires' },
    { name: 'Catamarca (America, Argentina)', value: 'America/Argentina/Catamarca' },
    { name: 'Cordoba (America, Argentina)', value: 'America/Argentina/Cordoba' },
    { name: 'Jujuy (America, Argentina)', value: 'America/Argentina/Jujuy' },
    { name: 'La Rioja (America, Argentina)', value: 'America/Argentina/La_Rioja' },
    { name: 'Mendoza (America, Argentina)', value: 'America/Argentina/Mendoza' },
    { name: 'Rio Gallegos (America, Argentina)', value: 'America/Argentina/Rio_Gallegos' },
    { name: 'Salta (America, Argentina)', value: 'America/Argentina/Salta' },
    { name: 'San Juan (America, Argentina)', value: 'America/Argentina/San_Juan' },
    { name: 'San Luis (America, Argentina)', value: 'America/Argentina/San_Luis' },
    { name: 'Tucman (America, Argentina', value: 'America/Argentina/Tucuman' },
    { name: 'Ushuaia (America, Argentina)', value: 'America/Argentina/Ushuaia' },
    { name: 'Asunción (America, Paraguay)', value: 'America/Asuncion' },
    { name: 'Atikokan (America, Canada)', value: 'America/Atikokan' },
    { name: 'Bahia Banderas (America, Mexico)', value: 'America/Bahia_Banderas' },
    { name: 'Bahia (America, Brazil)', value: 'America/Bahia' },
    { name: 'Barbados (America, Caribbean)', value: 'America/Barbados' },
    { name: 'Belem (America, Brazil)', value: 'America/Belem' },
    { name: 'Belize (America)', value: 'America/Belize' },
    { name: 'Blanc-Sablon (America, Canada)', value: 'America/Blanc-Sablon' },
    { name: 'Boa Vista (America, Brazil)', value: 'America/Boa_Vista' },
    { name: 'Bogota (America, Colombia)', value: 'America/Bogota' },
    { name: 'Boise (America, USA)', value: 'America/Boise' },
    { name: 'Cambridge Bay (America, Canada)', value: 'America/Cambridge_Bay' },
    { name: 'Campo Grande (America, Brazil)', value: 'America/Campo_Grande' },
    { name: 'Cancun (America, Mexico)', value: 'America/Cancun' },
    { name: 'Caracas (America, Venezuela)', value: 'America/Caracas' },
    { name: 'Cayenne (America, French Guiana)', value: 'America/Cayenne' },
    { name: 'Chicago (America, USA)', value: 'America/Chicago' },
    { name: 'Chihuahua (America, Mexico)', value: 'America/Chihuahua' },
    { name: 'Costa Rica (America)', value: 'America/Costa_Rica' },
    { name: 'Creston (America, Canada)', value: 'America/Creston' },
    { name: 'Cuiaba (America, Brazil)', value: 'America/Cuiaba' },
    { name: 'Curacao (America)', value: 'America/Curacao' },
    { name: 'Danmarkshavn (America, Greenland)', value: 'America/Danmarkshavn' },
    { name: 'Dawson Creek (America, Canada)', value: 'America/Dawson_Creek' },
    { name: 'Dawson (America, Canada)', value: 'America/Dawson' },
    { name: 'Denver (America, USA)', value: 'America/Denver' },
    { name: 'Detroit (America, USA)', value: 'America/Detroit' },
    { name: 'Edmonton (America, Canada)', value: 'America/Edmonton' },
    { name: 'Eirunepe (America, Brazil)', value: 'America/Eirunepe' },
    { name: 'El Salvador (America)', value: 'America/El_Salvador' },
    { name: 'Fort Nelson (America, Canada)', value: 'America/Fort_Nelson' },
    { name: 'Fortaleza (America, Brazil)', value: 'America/Fortaleza' },
    { name: 'Glace Bay (America, Canada)', value: 'America/Glace_Bay' },
    { name: 'Godthåb/Godthaab/Nuuk (America, Greenland)', value: 'America/Godthab' },
    { name: 'Goose Bay (America, Canada)', value: 'America/Goose_Bay' },
    { name: 'Grand Turk (America, Turks and Caicos Islands)', value: 'America/Grand_Turk' },
    { name: 'Guatemala (America)', value: 'America/Guatemala' },
    { name: 'Guayaquil (America, Equador)', value: 'America/Guayaquil' },
    { name: 'Guyana (America)', value: 'America/Guyana' },
    { name: 'Halifax (America)', value: 'America/Halifax' },
    { name: 'Havana (America, Cuba)', value: 'America/Havana' },
    { name: 'Hermosillo (America, Mexico)', value: 'America/Hermosillo' },
    { name: 'Indianapolis (America, USA)', value: 'America/Indiana/Indianapolis' },
    { name: 'Knox (America, USA)', value: 'America/Indiana/Knox' },
    { name: 'Marengo (America, USA)', value: 'America/Indiana/Marengo' },
    { name: 'Petersburg (America, USA)', value: 'America/Indiana/Petersburg' },
    { name: 'Tell City (America, USA)', value: 'America/Indiana/Tell_City' },
    { name: 'Vevay (America, USA)', value: 'America/Indiana/Vevay' },
    { name: 'Vincennes (America, USA)', value: 'America/Indiana/Vincennes' },
    { name: 'Winamac (America, USA)', value: 'America/Indiana/Winamac' },
    { name: 'Inuvik (America, Canada)', value: 'America/Inuvik' },
    { name: 'Iqaluit (America, Canada)', value: 'America/Iqaluit' },
    { name: 'Jamaica (America)', value: 'America/Jamaica' },
    { name: 'Juneau (America, USA)', value: 'America/Juneau' },
    { name: 'Louisville (America, USA)', value: 'America/Kentucky/Louisville' },
    { name: 'Monticello (America, USA)', value: 'America/Kentucky/Monticello' },
    { name: 'La Paz (America, Mexico)', value: 'America/La_Paz' },
    { name: 'Lima (America, Peru)', value: 'America/Lima' },
    { name: 'Los Angeles (America, USA)', value: 'America/Los_Angeles' },
    { name: 'Maceio (America, Brazil)', value: 'America/Maceio' },
    { name: 'Managua (America, Nicaragua)', value: 'America/Managua' },
    { name: 'Manaus (America, Brazil)', value: 'America/Manaus' },
    { name: 'Martinique (America, France)', value: 'America/Martinique' },
    { name: 'Matamoros (America, Mexico)', value: 'America/Matamoros' },
    { name: 'Mazatlan (America, Mexico)', value: 'America/Mazatlan' },
    { name: 'Menominee (America, USA)', value: 'America/Menominee' },
    { name: 'Merida (America, Mexico)', value: 'America/Merida' },
    { name: "Metlakatla (America, USA or Canada idk which they're next to each other)", value: 'America/Metlakatla' },
    { name: 'Mexico City (America, Mexico)', value: 'America/Mexico_City' },
    { name: 'Miquelon (America, Canada)', value: 'America/Miquelon' },
    { name: 'Moncton (America, Canada)', value: 'America/Moncton' },
    { name: 'Monterrey (America, USA)', value: 'America/Monterrey' },
    { name: 'Montevideo (America, Uruguay)', value: 'America/Montevideo' },
    { name: 'Nassau (America, The Bahamas)', value: 'America/Nassau' },
    { name: 'New York (America, USA)', value: 'America/New_York' },
    { name: 'Nipigon (America, Canada)', value: 'America/Nipigon' },
    { name: 'Nome (America, USA)', value: 'America/Nome' },
    { name: 'Noronha (America, Brazil)', value: 'America/Noronha' },
    { name: 'Beulah (America, USA)', value: 'America/North_Dakota/Beulah' },
    { name: 'Center (North Dakota) (America, USA)', value: 'America/North_Dakota/Center' },
    { name: 'New Salem (America, USA)', value: 'America/North_Dakota/New_Salem' },
    { name: 'Ojinaga (America, Mexico)', value: 'America/Ojinaga' },
    { name: 'Panama (America)', value: 'America/Panama' },
    { name: 'Pangnirtung (America, Canada)', value: 'America/Pangnirtung' },
    { name: 'Paramaribo (America, Suriname)', value: 'America/Paramaribo' },
    { name: 'Phoenix (America, USA)', value: 'America/Phoenix' },
    { name: 'Port of Spain (America, Trinidad and Tobago)', value: 'America/Port_of_Spain' },
    { name: 'Port-au-Prince (America, Haiti)', value: 'America/Port-au-Prince' },
    { name: 'Porto Velho (America, Brazil)', value: 'America/Porto_Velho' },
    { name: 'Puerto Rico (America, USA)', value: 'America/Puerto_Rico' },
    { name: 'Punta Arenas (America, Chile)', value: 'America/Punta_Arenas' },
    { name: 'Rainy River (America, Canada)', value: 'America/Rainy_River' },
    { name: 'Rankin Inlet (America, Canada)', value: 'America/Rankin_Inlet' },
    { name: 'Recife (America, Brazil)', value: 'America/Recife' },
    { name: 'Regina (America, Canada)', value: 'America/Regina' },
    { name: 'Resolute (America, Canada)', value: 'America/Resolute' },
    { name: 'Rio Branco (America, Brazil)', value: 'America/Rio_Branco' },
    { name: 'Santarem (America, Brazil)', value: 'America/Santarem' },
    { name: 'Santiago (America, Chile)', value: 'America/Santiago' },
    { name: 'Santo Domingo (America, Domincan Republic)', value: 'America/Santo_Domingo' },
    { name: 'Sao Paulo (America, Brazil)', value: 'America/Sao_Paulo' },
    { name: 'Scoresbysund (America, Greenland)', value: 'America/Scoresbysund' },
    { name: 'Sitka (America, USA)', value: 'America/Sitka' },
    { name: 'St Johns (America, Canada)', value: 'America/St_Johns' },
    { name: 'Swift Current (America, Canada)', value: 'America/Swift_Current' },
    { name: 'Tegucigalpa (America, Honduras)', value: 'America/Tegucigalpa' },
    { name: 'Thule (America, Greenland)', value: 'America/Thule' },
    { name: 'Thunder Bay (America, Canada)', value: 'America/Thunder_Bay' },
    { name: 'Tijuana (America, Mexico)', value: 'America/Tijuana' },
    { name: 'Toronto (America, Canada)', value: 'America/Toronto' },
    { name: 'Vancouver (America, Canada)', value: 'America/Vancouver' },
    { name: 'Whitehorse (America, Canada)', value: 'America/Whitehorse' },
    { name: 'Winnipeg (America, Canada)', value: 'America/Winnipeg' },
    { name: 'Yakutat (America, Alaska)', value: 'America/Yakutat' },
    { name: 'Yellowknife (America, Canada)', value: 'America/Yellowknife' },
    //
    //
    //
    { name: 'Casey (Antartica)', value: 'Antarctica/Casey' },
    { name: 'Davis (Antartica)', value: 'Antarctica/Davis' },
    { name: 'DumontDUrville (Antartica)', value: 'Antarctica/DumontDUrville' }, //https://bugs.chromium.org/p/chromium/issues/detail?id=928068
    { name: 'Macquarie (Antartica)', value: 'Antarctica/Macquarie' },
    { name: 'Mawson (Antartica)', value: 'Antarctica/Mawson' },
    { name: 'Palmer (Antartica)', value: 'Antarctica/Palmer' },
    { name: 'Rothera (Antartica)', value: 'Antarctica/Rothera' },
    { name: 'Syowa (Antartica)', value: 'Antarctica/Syowa' },
    { name: 'Troll (Antartica)', value: 'Antarctica/Troll' },
    { name: 'Vostok (Antartica)', value: 'Antarctica/Vostok' },
    //
    //
    //
    { name: 'Almaty (Asia, Kazakhstan)', value: 'Asia/Almaty' },
    { name: 'Amman (Asia, Jordan)', value: 'Asia/Amman' },
    { name: 'Anadyr (Asia, Russia)', value: 'Asia/Anadyr' },
    { name: 'Aqtau (Asia, Kazakhstan)', value: 'Asia/Aqtau' },
    { name: 'Aqtobe (Asia, Kazakhstan)', value: 'Asia/Aqtobe' },
    { name: 'Ashgabat (Asia, Turkmenistan)', value: 'Asia/Ashgabat' },
    { name: 'Atyrau (Asia, Kazakhstan)', value: 'Asia/Atyrau' },
    { name: 'Baghdad (Asia, Iraq)', value: 'Asia/Baghdad' },
    { name: 'Baku (Asia, Azerbaijan)', value: 'Asia/Baku' },
    { name: 'Bangkok (Asia, Thailand)', value: 'Asia/Bangkok' },
    { name: 'Barnaul (Asia, Russia)', value: 'Asia/Barnaul' },
    { name: 'Beirut (Asia, Lebanon)', value: 'Asia/Beirut' },
    { name: 'Bishkek (Asia, Kyrgyzstan)', value: 'Asia/Bishkek' },
    { name: 'Brunei (Asia)', value: 'Asia/Brunei' },
    { name: 'Chita (Asia, Russia)', value: 'Asia/Chita' },
    { name: 'Choibalsan (Asia, Mongolia)', value: 'Asia/Choibalsan' },
    { name: 'Colombo (Asia, Sri Lanka)', value: 'Asia/Colombo' },
    { name: 'Damascus (Asia, Syria)', value: 'Asia/Damascus' },
    { name: 'Dhaka (Asia, Bangladesh)', value: 'Asia/Dhaka' },
    { name: 'Dili (Asia, Timor-Leste/East Timor)', value: 'Asia/Dili' },
    { name: 'Dubai (Asia, United Arab Emirates)', value: 'Asia/Dubai' },
    { name: 'Dushanbe (Asia, Tajikistan)', value: 'Asia/Dushanbe' },
    { name: 'Famagusta (Asia, Cyprus)', value: 'Asia/Famagusta' },
    { name: 'Gaza (Asia, Palestine)', value: 'Asia/Gaza' },
    { name: 'Hebron (Asia, Palestine)', value: 'Asia/Hebron' },
    { name: 'Ho Chi Minh (Asia, Vietnam)', value: 'Asia/Ho_Chi_Minh' },
    { name: 'Hong Kong (Asia, China)', value: 'Asia/Hong_Kong' },
    { name: 'Hovd/Khovd (Asia, Mongolia)', value: 'Asia/Hovd' },
    { name: 'Irkutsk (Asia, Russia)', value: 'Asia/Irkutsk' },
    { name: 'Jakarta (Asia, Indonesia)', value: 'Asia/Jakarta' },
    { name: 'Jayapura (Asia, Indonesia)', value: 'Asia/Jayapura' },
    { name: 'Jerusalem (Asia, Israel)', value: 'Asia/Jerusalem' },
    { name: 'Kabul (Asia, Afghanistan)', value: 'Asia/Kabul' },
    { name: 'Kamchatka (Asia, Russia)', value: 'Asia/Kamchatka' },
    { name: 'Karachi (Asia, Pakistan)', value: 'Asia/Karachi' },
    { name: 'Kathmandu (Asia, Nepal)', value: 'Asia/Kathmandu' },
    { name: 'Khandyga (Asia, Russia)', value: 'Asia/Khandyga' },
    { name: 'Kolkata (Asia, India)', value: 'Asia/Kolkata' },
    { name: 'Krasnoyarsk (Asia)', value: 'Asia/Krasnoyarsk' },
    { name: 'Kuala Lumpur (Asia)', value: 'Asia/Kuala_Lumpur' },
    { name: 'Kuching (Asia)', value: 'Asia/Kuching' },
    { name: 'Macau (Asia, China)', value: 'Asia/Macau' },
    { name: 'Magadan (Asia)', value: 'Asia/Magadan' },
    { name: 'Makassar (Asia)', value: 'Asia/Makassar' },
    { name: 'Manila (Asia)', value: 'Asia/Manila' },
    { name: 'Nicosia (Asia)', value: 'Asia/Nicosia' },
    { name: 'Novokuznetsk (Asia)', value: 'Asia/Novokuznetsk' },
    { name: 'Novosibirsk (Asia)', value: 'Asia/Novosibirsk' },
    { name: 'Omsk (Asia, Russia)', value: 'Asia/Omsk' },
    { name: 'Oral (Asia, Kazakhstan)', value: 'Asia/Oral' },
    { name: 'Pontianak (Asia)', value: 'Asia/Pontianak' },
    { name: 'Pyongyang (Asia, North Korea)', value: 'Asia/Pyongyang' },
    { name: 'Qatar (Asia)', value: 'Asia/Qatar' },
    { name: 'Qostanay (Asia)', value: 'Asia/Qostanay' }, // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
    { name: 'Qyzylorda (Asia)', value: 'Asia/Qyzylorda' },
    { name: 'Riyadh (Asia)', value: 'Asia/Riyadh' },
    { name: 'Sakhalin (Asia)', value: 'Asia/Sakhalin' },
    { name: 'Samarkand (Asia)', value: 'Asia/Samarkand' },
    { name: 'Seoul (Asia, South Korea)', value: 'Asia/Seoul' },
    { name: 'Shanghai (Asia, China)', value: 'Asia/Shanghai' },
    { name: 'Singapore (Asia)', value: 'Asia/Singapore' },
    { name: 'Srednekolymsk (Asia)', value: 'Asia/Srednekolymsk' },
    { name: 'Taipei (Asia, Taiwan)', value: 'Asia/Taipei' },
    { name: 'Tashkent (Asia)', value: 'Asia/Tashkent' },
    { name: 'Tbilisi (Asia)', value: 'Asia/Tbilisi' },
    { name: 'Tehran (Asia, Iran)', value: 'Asia/Tehran' },
    { name: 'Thimphu (Asia)', value: 'Asia/Thimphu' },
    { name: 'Tokyo (Asia, Japan)', value: 'Asia/Tokyo' },
    { name: 'Tomsk (Asia)', value: 'Asia/Tomsk' },
    { name: 'Ulaanbaatar (Asia)', value: 'Asia/Ulaanbaatar' },
    { name: 'Urumqi (Asia)', value: 'Asia/Urumqi' },
    { name: 'Ust-Nera (Asia)', value: 'Asia/Ust-Nera' },
    { name: 'Vladivostok (Asia)', value: 'Asia/Vladivostok' },
    { name: 'Yakutsk (Asia)', value: 'Asia/Yakutsk' },
    { name: 'Yangon (Asia)', value: 'Asia/Yangon' },
    { name: 'Yekaterinburg (Asia)', value: 'Asia/Yekaterinburg' },
    { name: 'Yerevan (Asia)', value: 'Asia/Yerevan' },
    //
    //
    //
    { name: 'Azores (Atlantic)', value: 'Atlantic/Azores' },
    { name: 'Bermuda (Atlantic)', value: 'Atlantic/Bermuda' },
    { name: 'Canary (Atlantic)', value: 'Atlantic/Canary' },
    { name: 'Cape Verde (Atlantic)', value: 'Atlantic/Cape_Verde' },
    { name: 'Faroe (Atlantic)', value: 'Atlantic/Faroe' },
    { name: 'Madeira (Atlantic)', value: 'Atlantic/Madeira' },
    { name: 'Reykjavik (Atlantic)', value: 'Atlantic/Reykjavik' },
    { name: 'South Georgia (Atlantic)', value: 'Atlantic/South_Georgia' },
    { name: 'Stanley (Atlantic)', value: 'Atlantic/Stanley' },
    //
    //
    //
    { name: 'Adelaide (Australia)', value: 'Australia/Adelaide' },
    { name: 'Brisbane (Australia)', value: 'Australia/Brisbane' },
    { name: 'Broken Hill (Australia)', value: 'Australia/Broken_Hill' },
    { name: 'Currie (Australia)', value: 'Australia/Currie' },
    { name: 'Darwin (Australia)', value: 'Australia/Darwin' },
    { name: 'Eucla (Australia)', value: 'Australia/Eucla' },
    { name: 'Hobart (Australia)', value: 'Australia/Hobart' },
    { name: 'Lindeman (Australia)', value: 'Australia/Lindeman' },
    { name: 'Lord Howe (Australia)', value: 'Australia/Lord_Howe' },
    { name: 'Melbourne (Australia)', value: 'Australia/Melbourne' },
    { name: 'Perth (Australia)', value: 'Australia/Perth' },
    { name: 'Sydney (Australia)', value: 'Australia/Sydney' },
    //
    //
    //
    { name: 'Amsterdam (Europe, The Netherlands)', value: 'Europe/Amsterdam' },
    { name: 'Andorra (Europe)', value: 'Europe/Andorra' },
    { name: 'Astrakhan (Europe, Russia)', value: 'Europe/Astrakhan' },
    { name: 'Athens (Europe, Greece)', value: 'Europe/Athens' },
    { name: 'Belgrade (Europe)', value: 'Europe/Belgrade' },
    { name: 'Berlin (Europe, Germany)', value: 'Europe/Berlin' },
    { name: 'Brussels (Europe)', value: 'Europe/Brussels' },
    { name: 'Bucharest (Europe)', value: 'Europe/Bucharest' },
    { name: 'Budapest (Europe)', value: 'Europe/Budapest' },
    { name: 'Chisinau (Europe)', value: 'Europe/Chisinau' },
    { name: 'Copenhagen (Europe, Denmark)', value: 'Europe/Copenhagen' },
    { name: 'Dublin (Europe)', value: 'Europe/Dublin' },
    { name: 'Gibraltar (Europe)', value: 'Europe/Gibraltar' },
    { name: 'Helsinki (Europe, Finland)', value: 'Europe/Helsinki' },
    { name: 'Istanbul (Europe, Turkey)', value: 'Europe/Istanbul' },
    { name: 'Kaliningrad (Europe)', value: 'Europe/Kaliningrad' },
    { name: 'Kiev (Europe, Ukraine)', value: 'Europe/Kiev' },
    { name: 'Kirov (Europe)', value: 'Europe/Kirov' },
    { name: 'Lisbon (Europe)', value: 'Europe/Lisbon' },
    { name: 'London (Europe, United Kingdom/England)', value: 'Europe/London' },
    { name: 'Luxembourg (Europe)', value: 'Europe/Luxembourg' },
    { name: 'Madrid (Europe, Spain)', value: 'Europe/Madrid' },
    { name: 'Malta (Europe)', value: 'Europe/Malta' },
    { name: 'Minsk (Europe)', value: 'Europe/Minsk' },
    { name: 'Monaco (Europe)', value: 'Europe/Monaco' },
    { name: 'Moscow (Europe, Russia)', value: 'Europe/Moscow' },
    { name: 'Oslo (Europe, Norway)', value: 'Europe/Oslo' },
    { name: 'Paris (Europe, France)', value: 'Europe/Paris' },
    { name: 'Prague (Europe, Czech Republic)', value: 'Europe/Prague' },
    { name: 'Riga (Europe)', value: 'Europe/Riga' },
    { name: 'Rome (Europe, Italy)', value: 'Europe/Rome' },
    { name: 'Samara (Europe, Russia)', value: 'Europe/Samara' },
    { name: 'Saratov (Europe)', value: 'Europe/Saratov' },
    { name: 'Simferopol (Europe)', value: 'Europe/Simferopol' },
    { name: 'Sofia (Europe)', value: 'Europe/Sofia' },
    { name: 'Stockholm (Europe, Sweden)', value: 'Europe/Stockholm' },
    { name: 'Tallinn (Europe)', value: 'Europe/Tallinn' },
    { name: 'Tirane (Europe)', value: 'Europe/Tirane' },
    { name: 'Ulyanovsk (Europe)', value: 'Europe/Ulyanovsk' },
    { name: 'Uzhgorod (Europe)', value: 'Europe/Uzhgorod' },
    { name: 'Vienna (Europe)', value: 'Europe/Vienna' },
    { name: 'Vilnius (Europe)', value: 'Europe/Vilnius' },
    { name: 'Volgograd (Europe)', value: 'Europe/Volgograd' },
    { name: 'Warsaw (Europe, Poland)', value: 'Europe/Warsaw' },
    { name: 'Zaporozhye (Europe)', value: 'Europe/Zaporozhye' },
    { name: 'Zurich (Europe, Switzerland)', value: 'Europe/Zurich' },
    //
    //
    //
    { name: 'Chagos', value: 'Indian/Chagos' },
    { name: 'Christmas', value: 'Indian/Christmas' },
    { name: 'Cocos', value: 'Indian/Cocos' },
    { name: 'Kerguelen', value: 'Indian/Kerguelen' },
    { name: 'Mahe', value: 'Indian/Mahe' },
    { name: 'Maldives', value: 'Indian/Maldives' },
    { name: 'Mauritius', value: 'Indian/Mauritius' },
    { name: 'Reunion', value: 'Indian/Reunion' },
    //
    //
    //
    { name: 'Apia (Pacific)', value: 'Pacific/Apia' },
    { name: 'Auckland (Pacific, New Zealand)', value: 'Pacific/Auckland' },
    { name: 'Bougainville (Pacific)', value: 'Pacific/Bougainville' },
    { name: 'Chatham (Pacific)', value: 'Pacific/Chatham' },
    { name: 'Chuuk (Pacific)', value: 'Pacific/Chuuk' },
    { name: 'Easter (Pacific)', value: 'Pacific/Easter' },
    { name: 'Efate (Pacific)', value: 'Pacific/Efate' },
    { name: 'Enderbury (Pacific)', value: 'Pacific/Enderbury' },
    { name: 'Fakaofo (Pacific)', value: 'Pacific/Fakaofo' },
    { name: 'Fiji (Pacific)', value: 'Pacific/Fiji' },
    { name: 'Funafuti (Pacific)', value: 'Pacific/Funafuti' },
    { name: 'Galapagos (Pacific)', value: 'Pacific/Galapagos' },
    { name: 'Gambier (Pacific)', value: 'Pacific/Gambier' },
    { name: 'Guadalcanal (Pacific)', value: 'Pacific/Guadalcanal' },
    { name: 'Guam (Pacific, USA)', value: 'Pacific/Guam' },
    { name: 'Honolulu (Pacific)', value: 'Pacific/Honolulu' },
    { name: 'Kiritimati (Pacific)', value: 'Pacific/Kiritimati' },
    { name: 'Kosrae (Pacific)', value: 'Pacific/Kosrae' },
    { name: 'Kwajalein (Pacific)', value: 'Pacific/Kwajalein' },
    { name: 'Majuro (Pacific)', value: 'Pacific/Majuro' },
    { name: 'Marquesas (Pacific)', value: 'Pacific/Marquesas' },
    { name: 'Nauru (Pacific)', value: 'Pacific/Nauru' },
    { name: 'Niue (Pacific)', value: 'Pacific/Niue' },
    { name: 'Norfolk (Pacific)', value: 'Pacific/Norfolk' },
    { name: 'Noumea (Pacific)', value: 'Pacific/Noumea' },
    { name: 'Pago Pago (Pacific)', value: 'Pacific/Pago_Pago' },
    { name: 'Palau (Pacific)', value: 'Pacific/Palau' },
    { name: 'Pitcairn (Pacific)', value: 'Pacific/Pitcairn' },
    { name: 'Pohnpei (Pacific)', value: 'Pacific/Pohnpei' },
    { name: 'Port Moresby (Pacific)', value: 'Pacific/Port_Moresby' },
    { name: 'Rarotonga (Pacific)', value: 'Pacific/Rarotonga' },
    { name: 'Tahiti (Pacific)', value: 'Pacific/Tahiti' },
    { name: 'Tarawa (Pacific)', value: 'Pacific/Tarawa' },
    { name: 'Tongatapu (Pacific)', value: 'Pacific/Tongatapu' },
    { name: 'Wake (Pacific)', value: 'Pacific/Wake' },
    { name: 'Wallis (Pacific)', value: 'Pacific/Wallis' }
    //
    //
    //
];

//

const osutopOpts: Discord.ApplicationCommandOptionData[] = [

    {
        name: 'user',
        description: 'The user to display the plays of',
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
    },
    {
        name: 'mode',
        description: 'The mode to display the plays of',
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
        choices: modeopts
    },
    {
        name: 'sort',
        description: 'What to sort plays by',
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
        choices: playsortopts
    },
    {
        name: 'reverse',
        description: 'If true, plays will be displayed in reverse',
        type: Discord.ApplicationCommandOptionType.Boolean,
        required: false,
    },
    {
        name: 'page',
        description: 'The page to display',
        type: Discord.ApplicationCommandOptionType.Integer,
        required: false,
        minValue: 1,
        maxValue: 20
    },
    {
        name: 'mapper',
        description: 'Filter plays to show maps from this mapper',
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
    },
    {
        name: 'mods',
        description: 'Filter plays to show only plays with these mods',
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
    },
    {
        name: 'detailed',
        description: 'Show all details',
        type: Discord.ApplicationCommandOptionType.Boolean,
        required: false,
    },
    {
        name: 'parse',
        description: 'Parse the score with the specified index',
        type: Discord.ApplicationCommandOptionType.Integer,
        required: false,
    },
    {
        name: 'filter',
        description: 'Show scores with maps that match this filter',
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
    }

];

const playArrayOpts: Discord.ApplicationCommandOptionData[] = [
    {
        name: 'user',
        description: 'The user to display the plays of',
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
    },
    {
        name: 'mode',
        description: 'The mode to display the plays of',
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
        choices: modeopts
    },
    {
        name: 'sort',
        description: 'What to sort plays by',
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
        choices: playsortopts
    },
    {
        name: 'reverse',
        description: 'If true, plays will be displayed in reverse',
        type: Discord.ApplicationCommandOptionType.Boolean,
        required: false,
    },
    {
        name: 'page',
        description: 'The page to display',
        type: Discord.ApplicationCommandOptionType.Integer,
        required: false,
        minValue: 1,
        maxValue: 20
    },
    {
        name: 'mapper',
        description: 'Filter plays to show maps from this mapper',
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
    },
    {
        name: 'mods',
        description: 'Filter plays to show only plays with these mods',
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
    },
    {
        name: 'parse',
        description: 'Parse the score with the specified index',
        type: Discord.ApplicationCommandOptionType.Integer,
        required: false,
    },
    {
        name: 'filter',
        description: 'Show scores with maps that match this filter',
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
    }
];

const useridsortopts: Discord.ApplicationCommandOptionData[] = [
    {
        name: 'user',
        description: 'The user to display the top plays of',
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
    },
    {
        name: 'id',
        description: 'the map id',
        required: false,
        type: ApplicationCommandOptionType.Number,
    },
    {
        name: 'sort',
        description: 'The sort to display the top plays of',
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
        choices: playsortopts
    },
    {
        name: 'reverse',
        description: 'If true, the top plays will be displayed in reverse',
        type: Discord.ApplicationCommandOptionType.Boolean,
        required: false,
    },
    {
        name: 'page',
        description: 'The page to display the top plays of',
        type: Discord.ApplicationCommandOptionType.Integer,
        required: false,
        minValue: 1,
        maxValue: 20
    },
    {
        name: 'parse',
        description: 'Parse the score with the specified index',
        type: Discord.ApplicationCommandOptionType.Integer,
        required: false,
    },
];

const useroffsetmodeopts: Discord.ApplicationCommandOptionData[] = [
    {
        name: 'user',
        description: 'the username or id',
        required: false,
        type: ApplicationCommandOptionType.String
    },
    {
        name: 'page',
        description: 'the page to show',
        required: false,
        type: ApplicationCommandOptionType.Number,
    },
    {
        name: 'mode',
        description: 'what mode to show',
        required: false,
        type: ApplicationCommandOptionType.String,
        choices: modeopts
    }
];
const rsopts :Discord.ApplicationCommandOptionData[]= [
    {
        name: 'user',
        description: 'the username or id',
        required: false,
        type: ApplicationCommandOptionType.String
    },
    {
        name: 'page',
        description: 'the page to show',
        required: false,
        type: ApplicationCommandOptionType.Number,
    },
    {
        name: 'mode',
        description: 'what mode to show',
        required: false,
        type: ApplicationCommandOptionType.String,
        choices: modeopts
    },
    {
        name: 'list',
        description: 'Enables list mode',
        required: false,
        type: ApplicationCommandOptionType.Boolean,
    },
    {
        name: 'filter',
        description: 'Show scores with maps that match this filter',
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
    }
];


export { conversionopts, gifopts, mathcmdopts, modeopts, osutopOpts, playArrayOpts, playsortopts, rsopts, skincmdopts, timezoneopts, useridsortopts, useroffsetmodeopts };

