export type timezone = {
    offsetDirection: '+' | '-';
    offsetHours: number,
    aliases: string[];
};

/**
 * info taken from
 * @source https://wikitravel.org/en/Time_zones
 * @source https://en.wikipedia.org/wiki/List_of_UTC_offsets
 * @source https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#UTC_offset
 * @source https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_and_their_capitals_in_native_languages
 * @source https://countrycode.org/ 
 * finished country codes: A, B, C, D, E, F, G, H, I, J, K, L, M,
 * up to: republic of the congo
 */

//UTC+/-HH:mm
//UTC+/-HH
//GMT+/-HH:mm
//GMT+/-HH
//+/-HH
//xxT
//country
//region
//city
export const timezones: timezone[] = [
    {
        offsetDirection: '-',
        offsetHours: 12,
        aliases: [
            'UTC-12:00',
            'UTC-12',
            'GMT-12',
            'GMT-12:00',
            '-12',
            'Baker Island',
            'Howland Island'
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 11,
        aliases: [
            'UTC-11:00',
            'UTC-11',
            'GMT-11',
            'GMT-11:00',
            '-11',
            'SST',
            'American Samoa', 'Amerika Samoa', 'AS', 'ASM',
            'Pago Pago', //^ capital
            'Jarvis Island',
            'Kingman Reef',
            'Palmyra Atoll',
            'Midway Islands',
            'Niue', 'Niuē', 'NU', 'NIU',
            'Alofi', //^ capital
            'Samoa, Midway'
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 10,
        aliases: [
            'UTC-10:00',
            'UTC-10',
            'GMT-10',
            'GMT-10:00',
            '-10',
            'HST',
            'Cook Islands', 'CK', 'COK',
            'Avarua District', //^
            'French Polynesia', 'Polynésie française', 'PF', 'PYF',
            'Papeete', //^ capital
            'Society Islands', //^
            'Tuamotu Islands', //^
            'Austral Islands', //^
            'Johnston Atoll',
            'Tokelau',
            'Nukunonu', //^ capital
            'USA', 'US', 'United States of America', 'America', 'Estados Unidos', 'États-Unis', '‘Amelika Hui Pū ‘ia',
            'Aleutian Islands',
            'Adak', //^ capital
            'Hawaii',
            'Honolulu', //^ capital
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 9.5,
        aliases: [
            'UTC-09:30',
            'UTC-0930',
            'GMT-0930',
            'GMT-09:30',
            '-0930',
            'French Polynesia', 'Polynésie française', 'PF', 'PYF',
            'Marquesa Islands' //^
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 9,
        aliases: [
            'UTC-09:00',
            'UTC-9',
            'GMT-9',
            'GMT-09:00',
            '-09',
            'HDT',
            'AKST',
            'USA', 'US', 'United States of America', 'America', 'Estados Unidos', 'États-Unis', '‘Amelika Hui Pū ‘ia',
            'Alaska', //^ 
            'Juneau', //^ capital
            'French Polynesia', 'Polynésie française', 'PF', 'PYF',
            'Gambier Islands', //^ 
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 8,
        aliases: [
            'UTC-08:00',
            'UTC-8',
            'GMT-8',
            'GMT-08:00',
            '-08',
            'AKDT',
            'PST',
            'Canada', 'CA', 'CAN',
            'British Columbia', //^ //most of
            'Yukon', //^ 
            'Clipperton Island',
            'Mexico', 'México', 'Mēxihco', 'MX', 'MEX',
            'Baja Calirfornia Norte', //^ 
            'Pitcairn Islands', ' Pitkern Ailen', 'PN', 'PCN',
            'USA', 'US', 'United States of America', 'America', 'Estados Unidos', 'États-Unis', '‘Amelika Hui Pū ‘ia',
            'Washington',//^ 
            'Idaho', //^ //north
            'Oregon',//^ 
            'California',//^ 
            'Nevada'//^ 
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 7,
        aliases: [
            'UTC-07:00',
            'UTC-7',
            'GMT-7',
            'GMT-07:00',
            '-07',
            'PDT',
            'MST',
            'Canada',
            'Alberta',//^ 
            'British Columbia',//^ 
            'Lloydminster',//^ 
            'Mexico', 'México', 'Mēxihco', 'MX', 'MEX',
            'Baja California Sur',//^ 
            'Chihuahua',//^ 
            'Nayarit',//^ 
            'Sinaloa',//^ 
            'Sonora',//^ 
            'USA', 'US', 'United States of America', 'America', 'Estados Unidos', 'États-Unis', '‘Amelika Hui Pū ‘ia',
            'North Dakota', //^ //SW
            'South Dakota', //^ //W
            'Nebraska', //^ //W
            'Kansas', //^ //small bit
            'Montana',//^ 
            'Oregon', //^ //small bit
            'Idaho', //^ //southern
            'Wyoming',//^ 
            'Utah',//^ 
            'Colorado',//^ 
            'Arizona',//^ 
            'New Mexico',//^ 
            'Texas' //^ //El Paso area
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 6,
        aliases: [
            'UTC-06:00',
            'UTC-6',
            'GMT-6',
            'GMT-06:00',
            '-06',
            'CST',
            'MDT',
            'Belize', 'BZ', 'BLZ',
            'Canada',
            'Manitoba',//^ 
            'Saskatchewan',//^ 
            'Ontario', //^ //NW
            'Costa Rica', 'CR', 'CRI',
            'Easter Island',
            'El Salvador', 'SV', 'SLV',
            'Galapagos Islands',
            'Guatemala', 'GT', 'GTH',
            'Honduras', 'HN', 'HND',
            'Mexico', 'México', 'Mēxihco', 'MX', 'MEX',
            'Nicaragua', 'NI', 'NIC',
            'USA', 'US', 'United States of America', 'America', 'Estados Unidos', 'États-Unis', '‘Amelika Hui Pū ‘ia',
            'Wisconsin',//^ 
            'Illinois',//^ 
            'Indiana', //^ //SW and NW corners
            'Kentucky',//^  //W
            'Tennessee',//^  //W and central
            'Mississippi',//^ 
            'Alabama',//^ 
            'Minnesota',//^ 
            'Iowa',//^ 
            'Missouri',//^ 
            'Arkansas',//^ 
            'Louisiana',//^ 
            'North Dakota',//^  //N and E
            'South Dakota',//^ //E
            'Nebraska', //^ //E and central
            'Kansas',//^  //most of
            'Oklahoma',//^ 
            'Texas', //^ //most of
            'Florida', //^ //W
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 5,
        aliases: [
            'UTC-05:00',
            'UTC-5',
            'GMT-5',
            'GMT-05:00',
            '-05',
            'CDT',
            'EST',
            'Bahamas', 'BS', 'BHS',
            'Brazil', 'Brasil', 'BR', 'BRA',
            'Acre', //^ 
            'Canada',
            'Nunavut',//^ 
            'Ontario', //^ //most of
            'Quebec', //^ //most of
            'Cayman Islands', 'KY', 'CYM',
            'Colombia', 'CO', 'COL',
            'Cuba', 'CU', 'CUB',
            'Ecuador', 'EC', 'ECU',
            'Haiti', 'Haïti', 'Ayiti', 'HT', 'HTI',
            'Jamaica', 'JM', 'JAM',
            'Navassa Island',
            'Panama', 'Panamá', 'PA', 'PAN',
            'Peru', 'Perú', 'Piruw', 'PE', 'PER',
            'USA', 'US', 'United States of America', 'America', 'Estados Unidos', 'États-Unis', '‘Amelika Hui Pū ‘ia',
            'Maine',//^ 
            'New Hampshire',//^ 
            'Vermont',//^ 
            'New York',//^ 
            'Massachusetts',//^ 
            'Connecticut',//^ 
            'Rhode Island',//^ 
            'Michigan', //^ //excl. few north west
            'Indiana', //^ //excl. NW and SW corners
            'Ohio',//^ 
            'Pennsylvania',//^ 
            'New Jersey',//^ 
            'Kentucky', //^ //E
            'West Virginia',//^ 
            'Virginia',//^ 
            'Washington D.C.', 'Washington, D.C.', 'Washington DC',//^ 
            'Maryland',//^ 
            'Delaware',//^ 
            'Tennessee', //^ //E
            'North Carolina',//^ 
            'Georgia',//^ 
            'South Carolina',//^ 
            'Florida',//^  //excl. W panhandle
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 4,
        aliases: [
            'UTC-04:00',
            'UTC-4',
            'GMT-4',
            'GMT-04:00',
            '-04',
            'EDT',
            'AST',
            'Anguilla', 'AI', 'AIA',
            'Antigua', 'Barbuda', 'Antigua and Barbuda', 'AG', 'ATG',
            'Aruba', 'AW', 'ABW',
            'Barbados', 'BB', 'BRB',
            'Bermuda', 'BM', 'BMU',
            'Bolivia', 'Buliwya', 'Wuliwya', 'Volívia', 'BO', 'BOL',
            'Brazil', 'Brasil', 'BR', 'BRA',
            'Boa Vista',//^ 
            'Campo Grande',//^ 
            'Manaus',//^ 
            'Canada',
            'Labrador',
            'New Brunswick',
            'Nova Scotia',
            'Prince Edward Island',
            'Quebec', //E
            'Chile', 'CL', 'CHL',
            'Dominica', 'DM', 'DMA',
            'Dominican Republic', 'República Dominicana', 'DO', 'DOM',
            'Falkland Islands', 'FK', 'FLK',
            'Greenland', 'Kalaallit Nunaat', 'Grønland', 'GL', 'GRL', //W
            'Grenada', 'GD', 'GRD',
            'Guadeloupe',
            'Guyana', 'GY', 'GUY',
            'Martinique',
            'Monsterrat',
            'Netherlands Antilles', 'Antilles', 'AN', 'ANT',
            'Paraguay', 'Paraguái', 'PY', 'PRY',
            'Puerto Rico', 'PR', 'PRI',
            'Saint Kitts and Nevis', 'KN', 'KNA',
            'Saint Lucia', 'LC', 'LCA',
            'Saint Vincent and the Grenadines', 'VC', 'VCT',
            'Trinidad and Tobago', 'TT', 'TTO',
            'Turks and Caicos Islands', 'TC', 'TCA',
            'U.S. Virgin Islands', 'US Virgin Islands', 'Virgin Islands', 'VI', 'VIR',
            'Venezuela', 'VE', 'VEN',
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 3.5,
        aliases: [
            'UTC-03:30',
            'UTC-330',
            'GMT-330',
            'GMT-03:30',
            '-0330',
            'NST',
            'Canada',
            'Newfoundland and Labrador', 'Newfoundland',
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 3,
        aliases: [
            'UTC-03:00',
            'UTC-3',
            'GMT-3',
            'GMT-03:00',
            '-03',
            'ADT',
            'Argentina', 'AR', 'ARG',
            'Brazil', 'Brasil', 'BR', 'BRA',
            'Brasilia',//^ 
            'Rio',//^ 
            'Sao Paulo', 'São Paulo',//^ 
            'Fortaleza',
            'Maceio',
            'Recife',
            'Salvador',
            'French Guiana', 'Guyane',
            'Greenland', 'Kalaallit Nunaat', 'Grønland', 'GL', 'GRL',//central
            'Guyana',
            'Saint Pierre and Miquelon', 'PM', 'SPM',
            'Suriname', 'SR', 'SUR',
            'Uruguay', 'UY', 'URY'
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 2.5,
        aliases: [
            'UTC-02:30',
            'UTC-230',
            'GMT-230',
            'GMT-02:30',
            '-0230',
            'NDT',
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 2,
        aliases: [
            'UTC-02:00',
            'UTC-2',
            'GMT-2',
            'GMT-02:00',
            '-02',
            'Brazil', 'Brasil', 'BR', 'BRA',
            'Fernandoi de Noronha', //^ 
            'South Georgia and the South Sandwich Islands', 'South Sandwich Islands',
            'Trindade and Martim Vaz'
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 1,
        aliases: [
            'UTC-01:00',
            'UTC-1',
            'GMT-1',
            'GMT-01:00',
            '-01',
            'Azores',
            'Cape Verde', 'Cabo Verde', 'CV', 'CPV',
            'Greenland', 'Kalaallit Nunaat', 'Grønland', 'GL', 'GRL',//E
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 0,
        aliases: [
            'UTC+00:00',
            'UTC+0',
            'UTC-00:00',
            'UTC-0',
            'UTC',
            'GMT',
            'GMT-00:00',
            'GMT-0',
            'GMT+00:00',
            'GMT+0',
            'WET',
            'Burkina Faso', 'BF', 'BFA',
            'Bouvet Island',
            'Canary Islands',
            'Cote d\'Ivoire', 'Ivory Coast', 'CI', 'CIV',
            'Faroe Islands', 'Føroyar', 'Færøerne', 'FO', 'FRO',
            'Gambia', 'The Gambia', 'GM', 'GMB',
            'Ghana', 'Gaana', 'Gana', 'GH', 'GHA',
            'Greenland', 'Kalaallit Nunaat', 'Grønland', 'GL', 'GRL',//NE
            'Guernsey', 'GG', 'GGY',
            'Guinea', 'Guinée', 'Gine', 'GN', 'GIN',
            'Guinea-Bissau', 'Guiné-Bissau', 'GW', 'GNB',
            'Iceland', 'Ísland', 'IS', 'ISL',
            'Ireland', 'Éire', 'IE', 'IRL',
            'Isle of Man', 'Ellan Vannin', 'IM', 'IMN',
            'Jersey', 'Jèrri', 'JE', 'JEY',
            'Liberia', 'LR', 'LBR',
            'Mali', 'ML', 'MLI',
            'Mauritania', 'MR', 'MRT',
            'Northern Ireland',
            'Portugal', 'PT', 'PRT',
            'Saint Helena', 'SH', 'SHN',
            'Sao Tome and Principe', 'São Tomé and Príncipe', 'São Tomé e Príncipe', 'ST', 'STP',
            'Senegal', 'Sénégal', 'Senegaal', 'SN', 'SEN',
            'Sierra Leone', 'SL', 'SLE',
            'Togo', 'TG', 'TGO',
            'United Kingdom', 'UK', 'U.K.', 'Britain', 'Great Britain', 'Y Deyrnas Unedig', 'Unitit Kinrick', 'Rìoghachd Aonaichte', 'Ríocht Aontaithe', 'An Rywvaneth Unys', 'GB', 'GBR',
            'England',
            'Scotland',
            'Wales',
            'Western Sahara', 'EH', 'ESH'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 1,
        aliases: [
            'UTC+01:00',
            'UTC+1',
            'GMT+1',
            'GMT+01:00',
            '+01',
            'WEST',
            'BST',
            'CET',
            'WAT',
            'IST',
            'Albania', 'Shqipëria', 'Shqiperia', 'AL', 'ALB',
            'Andorra', 'AD', 'AND',
            'Algeria', 'Dzayer', 'ⴷⵣⴰⵢⴻⵔ', 'Al-Jazā\'ir', 'الجزائر', 'DZ', 'DZA',
            'Angola', 'AO', 'AGO',
            'Austria', 'Österreich', 'Osterreich', 'AT', 'AUT',
            'Belgium', 'België', 'Belgique', 'Belgien', 'BE', 'BEL',
            'Benin', 'Bénin', 'BJ', 'BN',
            'Bosnia And Herzegovina', 'Bosnia', 'Herzegovina', 'Bosna i Hercegovina', 'Босна и Херцеговина', 'BA', 'BIH',
            'Cameroon', 'Cameroun', 'CM', 'CMR',
            'Central African Republic', 'CAR', 'Centrafrique', 'Bêafrîka', 'CF', 'CAF',
            'Chad', 'Tchad', 'Tšād', 'تشاد', 'TD', 'TCD',
            'Republic of the Congo', 'République du Congo', 'Repubilika ya Kôngo', 'Republíki ya Kongó', 'CG', 'COG',
            'Democratic Republic of the Congo', 'DRC', 'République démocratique du Congo', 'Republíki ya Kongó Demokratíki', 'Repubilika ya Kôngo ya Dimokalasi', 'Jamhuri ya Kidemokrasia ya Kongo', 'CD', 'COD', //W
            'Croatia', 'Hrvatska', 'HR', 'HRV',
            'Czech Republic', 'Česká republika', 'Česko', 'CZ', 'CZE',
            'Denmark', 'Danmark', 'DK', 'DNK',
            'Equatorial Guinea', 'Guinea Ecuatorial', 'Guinée équatoriale', 'Guiné Equatorial', 'GQ', 'GNQ',
            'France', 'FR', 'FRA',
            'Gabon', 'République gabonaise', 'GA', 'GAB',
            'Germany', 'Deutschland', 'DE', 'DEU',
            'Gibraltar', 'GI', 'GIB',
            'Hungary', 'Magyarország', 'HU', 'HUN',
            'Italy', 'Italia', 'IT', 'ITA',
            'Kosovo', 'Косово', 'Kosova', 'XK', 'XKX',
            'Liechtenstein', 'LI', 'LIE',
            'Luxembourg', 'Lëtzebuerg', 'Luxemburg', 'LU', 'LUX',
            'Malta', 'MT', 'MLT',
            'Monaco', 'Múnegu', 'MC', 'MCO',
            'Montenegro', 'Crna Gora', 'Црна Гора', 'ME', 'MNE',
            'Morocco', 'Amerruk', 'Elmeɣrib', 'ⴰⵎⵔⵔⵓⴽ', 'ⵍⵎⵖⵔⵉⴱ', 'Al-maɣréb', 'المغرب', 'MA', 'MAR',
            'Netherlands', 'Nederland', 'Nederlân', 'NL', 'NLD',
            'Niger', 'NE', 'NER',
            'Nigeria', ' Nijeriya', 'Naìjíríyà', 'Nàìjíríà', 'NG', 'NGA',
            'North Macedonia', 'Severna Makedonija', 'Северна Македонија', 'Maqedonia e Veriut', 'MK', 'MKD',
            'Norway', 'Norge', 'Noreg', 'Norga', 'Vuodna', 'Nöörje', 'NO', 'NOR',
            'Poland', 'Polska', 'PL', 'POL',
            'San Marino', 'SM', 'SMR',
            'Serbia', 'Srbija', 'Србија', 'RS', 'SRB',
            'Slovakia', 'Slovensko', 'SK', 'SVK',
            'Slovenia', 'Slovenija', 'SI', 'SVN',
            'Spain', 'España', 'Espanya', 'Espainia', 'Espanha', 'ES', 'ESP',
            'Sweden', 'Sverige', 'SZ', 'SWZ',
            'Switzerland', 'Schweiz', 'Suisse', 'Svizzera', 'Svizra', 'SE', 'SWE',
            'Tunisia', 'Tunes', 'ⵜⵓⵏⵙ', 'Tūns', 'تونس', 'TN', 'TUN',
            'Vatican City', 'Civitas Vaticana', 'Città del Vaticano', 'VA', 'VAT'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 2,
        aliases: [
            'UTC+02:00',
            'UTC+2',
            'GMT+2',
            'GMT+02:00',
            '+02',
            'CEST',
            'CAT',
            'EET',
            'SAST',
            'IST',
            'Belarus', 'Bielaruś', 'Беларусь', 'BY', 'BLR',
            'Botswana', 'BW', 'BWA',
            'Bulgaria', 'Bălgariya', 'Bălgarija', 'България', 'BG', 'BGR',
            'Burundi', 'Uburundi', 'BI', 'BDI',
            'Democratic Republic  of the Congo', 'DRC', //E
            'Cyprus', 'Kypros', 'Κύπρος', 'Kıbrıs', 'CY', 'CYP',
            'Egypt', 'Misr', 'Masr', 'مصر', 'EG', 'EGY',
            'Estonia', 'Eesti', 'EE', 'EST',
            'Eswatini', 'eSwatini',
            'Finland', 'Suomi', 'FI', 'FIN',
            'Greece', 'Hellas', 'Ellada', 'Ελλάς', 'Ελλάδα', 'GR', 'GRC',
            'Israel', 'Yisra\'el', 'ישראל', 'Israʼiyl', 'إسرائيل', 'IL', 'ISR',
            'Jordan', 'Al-’Urdun', 'الأردن', 'JO', 'JOR',
            'Latvia', 'Latvija', 'LV', 'LVA',
            'Lebanon', 'Lubnān', 'لبنان ', 'Liban', 'LB', 'LBN',
            'Lesotho', 'LS', 'LSO',
            'Libya', 'ⵍⵉⴱⵢⴰ', 'Lībiyā', 'ليبيا', 'LY', 'LBY',
            'Lithuania', 'Lietuva', 'LT', 'LTU',
            'Malawi', 'Malaŵi', 'MW', 'MWI',
            'Moldova', 'MD', 'MDA',
            'Mozambique', 'Moçambique', 'MZ', 'MOZ',
            'Namibia', 'Namibië', 'NA', 'NAM',
            'Palestine', 'Filasṭīn', 'فلسطين', 'PS', 'PSE',
            'Romania', 'România', 'RO', 'ROU',
            'Russia', 'Rossiya', 'Rossiâ', 'Россия', 'RU', 'RUS',
            'Kaliningrad', 'Kaliningrad Oblast',
            'Rwanda', 'RW', 'RWA',
            'South Africa', 'Suid-Afrika', 'iNingizimu Afrika', 'uMzantsi Afrika', 'Afrika-Borwa', 'Afrika Borwa', 'Aforika Borwa', 'Afurika Tshipembe', 'Afrika Dzonga', 'iNingizimu Afrika', 'iSewula Afrika', 'ZA', 'ZAF',
            'Sudan', 'As-Sudan', 'السودان', 'SD', 'SDN',
            'Syria', 'Suriyah', 'سورية', 'SY', 'SYR',
            'Ukraine', 'Ukrajina', 'Україна', 'UA', 'UKR',
            'Zambia', 'ZM', 'ZMB',
            'Zimbabwe', 'ZW', 'ZWE'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 3,
        aliases: [
            'UTC+03:00',
            'UTC+3',
            'GMT+3',
            'GMT+03:00',
            '+03',
            'EEST',
            'IDT',
            'EAT',
            'MSK',
            'Bahrain', 'Al-Baḥrayn', 'البحرين', 'BH', 'BHR',
            'Comoros', 'Komori', 'Juzur al-Qamar', 'جزر القمر', 'Comores', 'KM', 'COM',
            'Djibouti', 'Jībūtī', 'جيبوتي', 'Djibouti', 'Jabuuti', 'Gabuuti', 'DJ', 'DJI',
            'Eritrea', 'Iritriya', 'إرتريا', 'Ertra', 'ኤርትራ', 'ER', 'ERI',
            'Ethiopia', 'Ityop\'ia', 'ኢትዮጵያ', 'ET', 'ETH',
            'Iraq', 'Al-\'Iraq', 'العراق', 'Êraq', 'عێراق', 'IQ', 'IRQ',
            'Kenya', 'KE', 'KEN',
            'Kuwait', 'Dawlat ul-Kuwayt', 'دولة الكويت', 'il-ikwet', 'الكويت', 'KW', 'KWT',
            'Madagascar', 'Madagasikara', 'MG', 'MDG',
            'Mayotte', 'YT', 'MYT',
            'Qatar', 'Qaṭar', 'قطر', 'QA', 'QAT',
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'Saudi Arabia', 'Al-Mamlaka Al-‘Arabiyyah as Sa‘ūdiyyah', 'المملكة العربية السعودية', 'SA', 'SAU',
            'Somalia', 'Soomaaliya', 'aş-Şūmāl', 'الصومال', 'SO', 'SOM',
            'South Sudan', 'Sudan Kusini', 'Paguot Thudän', 'SS', 'SSD',
            'Tanzania', 'TZ', 'TZA',
            'Turkey', 'Türkiye', 'TR', 'TUR',
            'Uganda', 'UG', 'UGA',
            'Yemen', 'Al-Yaman', 'اليمن', 'YE', 'YEM'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 3.5,
        aliases: [
            'UTC+03:30',
            'UTC+330',
            'GMT+330',
            'GMT+03:30',
            '+0330',
            'Iran', 'Īrān', 'ایران', 'IR', 'IRN'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 4,
        aliases: [
            'UTC+04:00',
            'UTC+4',
            'GMT+4',
            'GMT+04:00',
            '+04',
            'Armenia', 'Hayastan', 'Hayastán', 'Հայաստան', 'AM', 'ARM',
            'Azerbaijan', 'Azərbaycan', 'AZ', 'AZE',
            'Georgia', 'Sak\'art\'velo', 'საქართველო', 'GE', 'GEO',
            'Mauritius', 'Maurice', 'Moris', 'MU', 'MUS',
            'Oman', '‘Umān', 'عُمان', 'OM', 'OMN',
            'Reunion', 'Réunion', 'La Réunion', 'RE', 'REU',
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'Seychelles', 'Sesel', 'SC', 'SYC',
            'United Arab Emirates', 'UAE', 'Al-’Imārat Al-‘Arabiyyah Al-Muttaḥidah', 'الإمارات العربيّة المتّحدة', 'AE', 'ARE',
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 4.5,
        aliases: [
            'UTC+04:30',
            'UTC+430',
            'GMT+430',
            'GMT+04:30',
            '+0430',
            'Afghanistan', 'Afghanestan', 'افغانستان', 'AF', 'AFG'

        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 5,
        aliases: [
            'UTC+05:00',
            'UTC+5',
            'GMT+5',
            'GMT+05:00',
            '+05',
            'PKT',
            'British Indian Ocean Territory', 'IO', 'IOT', //NAO
            'French Southern and Antarctic Lands',
            'Heard Island and McDonald Islands',
            'Kazakhstan', 'Qazaqstan', 'Қазақстан', 'Kazakhstán', 'Казахстан', 'KZ', 'KAZ',           //W
            'Maldives', 'Dhivehi Raajje', 'ދިވެހިރާއްޖެ', 'MV', 'MDV',
            'Pakistan', 'Pākistān', 'پاکستان', 'PK', 'PAK',
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'Tajikstan', 'Tojikistan', 'Тоҷикистон', 'TJ', 'TJK',
            'Turkmenistan', 'Türkmenistan', 'TK', 'TKM',
            'Uzbekistan', 'O‘zbekiston', 'Ўзбекистон', 'UZ', 'UZB'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 5.5,
        aliases: [
            'UTC+05:30',
            'UTC+530',
            'GMT+530',
            'GMT+05:30',
            '+0530',
            'IST',
            'India',
            'Bharôt',
            'ভাৰত',
            'Bharôt',
            'ভারত',
            'India', 'Bhārat', 'ભારત', 'Bhārat', 'भारत', 'Bhārata', 'ಭಾರತ', 'Bhārat', 'भारत', 'Bhāratam', 'ഭാരതം', 'Bhārat', 'भारत', 'Bhārat', 'भारत', 'Bhārata', 'ଭାରତ', 'Bhārat', 'ਭਾਰਤ', 'Bhāratam', 'भारतम्', 'Bārata', 'பாரதம்', 'Bhāratadēsam', 'భారత దేశం',
            'IN', 'IND',//^
            'Sri Lanka', 'Sri Lankā', 'ශ්‍රී ලංකාව', 'இலங்கை', 'LK', 'LKA',
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 5.75,
        aliases: [
            'UTC+05:45',
            'UTC+545',
            'GMT+545',
            'GMT+05:45',
            '+0545',
            'Nepal', 'Nepāl', 'नेपाल', 'NP', 'NPL',
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 6,
        aliases: [
            'UTC+06:00',
            'UTC+6',
            'GMT+6',
            'GMT+06:00',
            '+06',
            'Bhutan', 'Druk Yul', 'འབྲུག་ཡུལ', 'BT', 'BTN',
            'British Indian Ocean Territory', 'IO', 'IOT', //CIA
            'Kazakhstan', 'Qazaqstan', 'Қазақстан', 'Kazakhstán', 'Казахстан', 'KZ', 'KAZ', //E
            'Kyrgyzstan', 'Кыргызстан', 'KG', 'KGZ',
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'Bangladesh', 'বাংলাদেশ', 'BD', 'BGD',
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 6.5,
        aliases: [
            'UTC+06:30',
            'UTC+630',
            'GMT+630',
            'GMT+06:30',
            '+0630',
            'Cocos Islands', 'CC', 'CCK',
            'Myanmar', 'Burma', 'Myanma', 'မြန်မာ', 'MM', 'MMR'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 7,
        aliases: [
            'UTC+07:00',
            'UTC+7',
            'GMT+7',
            'GMT+07:00',
            '+07',
            'WIB',
            'Bangladesh',
            'Cambodia', 'Kămpŭchéa', 'កម្ពុជា', 'KH', 'KHM',
            'Christmas Island', 'CX', 'CXR',
            'Indonesia', 'ID', 'IDN', //W
            'Java',
            'Sumatra',
            'Laos', 'Lao', 'ປະເທດລາວ', 'LA', 'LAO',
            'Mongolia', 'Mongol Uls', 'Монгол Улс', 'ᠮᠤᠩᠭᠤᠯ ᠤᠯᠤᠰ', 'MN', 'MNG',
            'Hovd',
            'Uvs',
            'Bayan-Ölgii',
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'Thailand', 'Thai', 'Prathet Thai', 'Ratcha-anachak Thai', 'ไทย', 'ประเทศไทย', 'าชอาณาจักรไทย', 'TH', 'THAI',
            'Vietnam', 'Việt Nam', 'VN', 'VNM'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 8,
        aliases: [
            'UTC+08:00',
            'UTC+8',
            'GMT+8',
            'GMT+08:00',
            '+08',
            'CST',
            'HKT',
            'WITA',
            'PHST',
            'AWST',
            'Australia', 'AU', 'AUS',
            'Western Australia', 'WA',
            'Brunei', 'بروني', 'BN', 'BRN',
            'China', 'Zhōngguó', 'Zhōnghuá Rénmín Gònghéguó', '中国', '中华人民共和国', 'PRC', 'People\'s Republic of China', 'CN', 'CHN',
            'Hong Kong', 'Heung Gong', '香港', 'HK', 'HKG',
            'Indonesia', 'ID', 'IDN', //C
            'Bali',
            'Borneo',
            'Macau', 'Oumún', '澳門', 'Macau', 'MO', 'MAC',
            'Malaysia', 'MY', 'MYS',
            'Mongolia', 'Mongol Uls', 'Монгол Улс', 'ᠮᠤᠩᠭᠤᠯ ᠤᠯᠤᠰ', 'MN', 'MNG', //most of
            'Philippines', 'Pilipinas', 'PH', 'PHL',
            'Singapore', 'Singapura', 'Xīnjiāpō', '新加坡', 'Singapur', 'சிங்கப்பூர்', 'SG', 'SGP',
            'Taiwan', 'Zhōnghuá Mínguó', 'Táiwān', '中華民國', '臺灣', '台灣', 'TW', 'TWN',
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 8.75,
        aliases: [
            'UTC+08:45',
            'UTC+845',
            'GMT+845',
            'GMT+08:45',
            '+0845'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 9,
        aliases: [
            'UTC+09:00',
            'UTC+9',
            'GMT+9',
            'GMT+09:00',
            '+09',
            'WIT',
            'KST',
            'JST',
            'East Timor', 'Timor-Leste', 'Timor Lorosa\'e', 'TL', 'TLS',
            'Indonesia', 'ID', 'IDN', //E
            'Malaku',
            'Western New Guinea', 'Papua Niugini', 'Papua Niu Gini', 'PG', 'PNG',
            'Japan', 'Nihon', 'Nippon', '日本', 'JP', 'JPN',
            'North Korea', 'Chosŏn', '조선', '朝鮮', 'Bukchosŏn', '북조선', 'KP', 'PRK',
            'South Korea', 'Hanguk', '한국', '韓國', 'Namhan', '남한', 'KR', 'KOR',
            'Palau', 'Belau', 'PW', 'PLW',
            'Russia'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 9.5,
        aliases: [
            'UTC+09:30',
            'UTC+930',
            'GMT+930',
            'GMT+09:30',
            '+0930',
            'ACST',
            'Australia', 'AU', 'AUS',
            'Northern Territory', 'NT',
            'South Australia',
            'Broken Hill' //NSW
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 10,
        aliases: [
            'UTC+10:00',
            'UTC+10',
            'GMT+10',
            'GMT+10:00',
            'AEST',
            'ChST',
            'Australia', 'AU', 'AUS',
            'Australian Capital Territory', 'ACT',
            'New South Wales', 'NSW',
            'Sydney',
            'Queensland', 'QLD',
            'Brisbane',
            'Tasmania', 'TAS',
            'Hobart',
            'Victoria', 'VIC',
            'Melbourne',
            'Federated States of Micronesia', 'Micronesia', 'FM', 'FSM',
            'Chuuk',
            'Yap',
            'Guam', 'Guåhån', 'GU', ' GUM',
            'Northern Mariana Islands', 'Notte Mariånas', 'MP', 'MNP',
            'Papua New Guinea',
            'Russia'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 10.5,
        aliases: [
            'UTC+10:30',
            'UTC+1030',
            'GMT+1030',
            'GMT+10:30',
            '+1030',
            'ACDT'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 11,
        aliases: [
            'UTC+11:00',
            'UTC+11',
            'GMT+11',
            'GMT+11:00',
            '+11',
            'AEDT',
            'Australia', 'AU', 'AUS',
            'Norfolk Island', ' Norf\'k Ailen',
            'Federated States of Micronesia', 'Micronesia', 'FM', 'FSM',
            'Kosrae',
            'Pohnpei',
            'New Caledonia', 'Nouvelle-Calédonie', 'NC', 'NCL',
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'Solomon Islands', 'Solomon Aelan', 'SB', 'SLB',
            'Vanuatu', 'VU', 'VUT'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 12,
        aliases: [
            'UTC+12:00',
            'UTC+12',
            'GMT+12',
            'GMT+12:00',
            '+12',
            'NZST',
            'Fiji', 'Viti', 'फ़िजी', 'FJ', 'FJI',
            'Kiribati', 'KI', 'KIR',
            'Gilbert Islands',
            'Marshall Islands', 'Aorōkin Ṃajeḷ', 'MH', 'MHL',
            'Nauru', 'Naoero', 'NR', 'NRU',
            'New Zealand', 'Aotearoa', 'NZ', 'NZL',
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'South Pole',
            'Tuvalu', 'TV', 'TUV',
            'Wake Island',
            'Wallis and Futuna', 'WF', 'WLF'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 12.75,
        aliases: [
            'UTC+12:45',
            'UTC+1245',
            'GMT+1245',
            'GMT+12:45',
            '+1245',
            'New Zealand',
            'Chatham Islands'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 13,
        aliases: [
            'UTC+13:00',
            'UTC+13',
            'GMT+13',
            'GMT+13:00',
            '+13',
            'NZDT',
            'Kiribati',
            'Phoenix Islands',
            'Samoa', 'Sāmoa', 'WS', 'WSM',
            'Apia', //^
            'New Zealand',
            'Tokelau', 'TK', 'TKL',
            'Tonga', 'TO', 'TON'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 14,
        aliases: [
            'UTC+14:00',
            'UTC+14',
            'GMT+14',
            'GMT+14:00',
            '+14',
            'Kiribati Line Islands',
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 15,
        aliases: [
            'UTC+15:00',
            'UTC+15',
            'GMT+15',
            'GMT+15:00',
            '+15',
            'International Date Line',
            'Internation Dateline East',
            'Internation Dateline',
            'Dateline'
        ]
    },
];

export const hasDaylight:{
    offset_normal: number,
    offset_dst: number,
    start: `${number}-${number}`, 
    finish: `${number}-${number}`
    includes: string[],
}[] = [
    {
        offset_normal: 10,
        offset_dst: 11,
        includes: [
            'Victoria', 'VIC',
            'Melbourne',
            'New South Wales', 'NSW',
            'Sydney'
        ],
        start: `10-06`,
        finish: `0-0`
    }
]