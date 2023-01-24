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
            'American Samoa', 'Amerika Samoa',
            'Pago Pago', //^ capital
            'Jarvis Island',
            'Kingman Reef',
            'Palmyra Atoll',
            'Midway Islands',
            'Niue', 'Niuē',
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
            'Cook Islands',
            'Avarua District', //^
            'French Polynesia', 'Polynésie française',
            'Papeete', //^ capital
            'Society Islands', //^
            'Tuamotu Islands', //^
            'Austral Islands', //^
            'Johnston Atoll',
            'Tokelau',
            'Nukunonu', //^ capital
            'USA', 'United States of America', 'America', 'Estados Unidos', 'États-Unis', '‘Amelika Hui Pū ‘ia',
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
            'French Polynesia', 'Polynésie française',
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
            'USA', 'United States of America', 'America', 'Estados Unidos', 'États-Unis', '‘Amelika Hui Pū ‘ia',
            'Alaska', //^ 
            'Juneau', //^ capital
            'French Polynesia', 'Polynésie française',
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
            'Canada',
            'British Columbia', //^ //most of
            'Yukon', //^ 
            'Clipperton Island',
            'Mexico', 'México', 'Mēxihco',
            'Baja Calirfornia Norte', //^ 
            'Pitcairn Islands', ' Pitkern Ailen',
            'USA', 'United States of America', 'America', 'Estados Unidos', 'États-Unis', '‘Amelika Hui Pū ‘ia',
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
            'Mexico', 'México', 'Mēxihco',
            'Baja California Sur',//^ 
            'Chihuahua',//^ 
            'Nayarit',//^ 
            'Sinaloa',//^ 
            'Sonora',//^ 
            'USA', 'United States of America', 'America', 'Estados Unidos', 'États-Unis', '‘Amelika Hui Pū ‘ia',
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
            'Belize',
            'Canada',
            'Manitoba',//^ 
            'Saskatchewan',//^ 
            'Ontario', //^ //NW
            'Costa Rica',
            'Easter Island',
            'El Salvador',
            'Galapagos Islands',
            'Guatemala',
            'Honduras',
            'Mexico', 'México', 'Mēxihco',
            'Nicaragua',
            'USA', 'United States of America', 'America', 'Estados Unidos', 'États-Unis', '‘Amelika Hui Pū ‘ia',
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
            'Bahamas',
            'Brazil', 'Brasil',
            'Acre', //^ 
            'Canada',
            'Nunavut',//^ 
            'Ontario', //^ //most of
            'Quebec', //^ //most of
            'Cayman Islands',
            'Colombia',
            'Cuba',
            'Ecuador',
            'Haiti', 'Haïti', 'Ayiti',
            'Jamaica',
            'Navassa Island',
            'Panama', 'Panamá',
            'Peru', 'Perú', 'Piruw',
            'USA', 'United States of America', 'America', 'Estados Unidos', 'États-Unis', '‘Amelika Hui Pū ‘ia',
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
            'Anguilla',
            'Antigua', 'Barbuda', 'Antigua and Barbuda',
            'Aruba',
            'Barbados',
            'Bermuda',
            'Bolivia', 'Buliwya', 'Wuliwya', 'Volívia',
            'Brazil', 'Brasil',
            'Boa Vista',//^ 
            'Campo Grande',//^ 
            'Manaus',//^ 
            'Canada',
            'Labrador',
            'New Brunswick',
            'Nova Scotia',
            'Prince Edward Island',
            'Quebec', //E
            'Chile',
            'Dominica',
            'Dominican Republic', 'República Dominicana',
            'Falkland Islands',
            'Greenland', 'Kalaallit Nunaat', 'Grønland', //W
            'Grenada',
            'Guadeloupe',
            'Guyana',
            'Martinique',
            'Monsterrat',
            'Netherlands Antilles', 'Antilles',
            'Paraguay', 'Paraguái',
            'Puerto Rico',
            'Saint Kitts and Nevis',
            'Saint Lucia',
            'Saint Vincent and the Grenadines',
            'Trinidad and Tobago',
            'Turks and Caicos Islands',
            'U.S. Virgin Islands', 'US Virgin Islands', 'Virgin Islands',
            'Venezuela',
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
            'Argentina',
            'Brazil', 'Brasil',
            'Brasilia',//^ 
            'Rio',//^ 
            'Sao Paulo', 'São Paulo',//^ 
            'Fortaleza',
            'Maceio',
            'Recife',
            'Salvador',
            'French Guiana', 'Guyane',
            'Greenland', 'Kalaallit Nunaat', 'Grønland',//central
            'Guyana',
            'Saint Pierre and Miquelon',
            'Suriname',
            'Uruguay'
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
            'Brazil', 'Brasil',
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
            'Cape Verde', 'Cabo Verde',
            'Greenland', 'Kalaallit Nunaat', 'Grønland', //E
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
            'Burkina Faso',
            'Bouvet Island',
            'Canary Islands',
            'Cote d\'Ivoire', 'Ivory Coast',
            'England',
            'Faroe Islands', 'Føroyar', 'Færøerne',
            'Gambia', 'The Gambia',
            'Ghana', 'Gaana', 'Gana',
            'Greenland', 'Kalaallit Nunaat', 'Grønland', //NE
            'Guernsey',
            'Guinea', 'Guinée', 'Gine',
            'Guinea-Bissau', 'Guiné-Bissau',
            'Iceland', 'Ísland',
            'Ireland', 'Éire',
            'Isle of Man', 'Ellan Vannin',
            'Jersey', 'Jèrri',
            'Liberia',
            'Mali',
            'Mauritania',
            'Northern Ireland',
            'Portugal',
            'Saint Helena',
            'Sao Tome and Principe', 'São Tomé and Príncipe', 'São Tomé e Príncipe',
            'Senegal', 'Sénégal', 'Senegaal',
            'Sierra Leone',
            'Scotland',
            'Togo',
            'United Kingdom', 'UK', 'U.K.', 'Britain', 'Great Britain', 'Y Deyrnas Unedig', 'Unitit Kinrick', 'Rìoghachd Aonaichte', 'Ríocht Aontaithe', 'An Rywvaneth Unys',
            'Wales',
            'Western Sahara'
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
            'Albania', 'Shqipëria', 'Shqiperia',
            'Andorra',
            'Algeria', 'Dzayer', 'ⴷⵣⴰⵢⴻⵔ', 'Al-Jazā\'ir', 'الجزائر',
            'Angola',
            'Austria', 'Österreich', 'Osterreich',
            'Belgium', 'België', 'Belgique', 'Belgien',
            'Benin', 'Bénin',
            'Bosnia And Herzegovina', 'Bosnia', 'Herzegovina', 'Bosna i Hercegovina', 'Босна и Херцеговина',
            'Cameroon', 'Cameroun',
            'Central African Republic', 'CAR', 'Centrafrique', 'Bêafrîka',
            'Chad', 'Tchad', 'Tšād', 'تشاد',
            'Republic of the Congo', 'République du Congo', 'Repubilika ya Kôngo', 'Republíki ya Kongó',
            'Democratic Republic of the Congo', 'DRC', 'République démocratique du Congo', 'Republíki ya Kongó Demokratíki', 'Repubilika ya Kôngo ya Dimokalasi', 'Jamhuri ya Kidemokrasia ya Kongo', //W
            'Croatia', 'Hrvatska',
            'Czech Republic', 'Česká republika', 'Česko',
            'Denmark', 'Danmark',
            'Equatorial Guinea', 'Guinea Ecuatorial', 'Guinée équatoriale', 'Guiné Equatorial',
            'France',
            'Gabon', 'République gabonaise',
            'Germany', 'Deutschland',
            'Gibraltar',
            'Hungary', 'Magyarország',
            'Italy', 'Italia',
            'Kosovo', 'Косово', 'Kosova',
            'Liechtenstein',
            'Luxembourg', 'Lëtzebuerg', 'Luxemburg',
            'Malta',
            'Monaco', 'Múnegu',
            'Montenegro', 'Crna Gora', 'Црна Гора',
            'Morroco', 'Amerruk', 'Elmeɣrib', 'ⴰⵎⵔⵔⵓⴽ', 'ⵍⵎⵖⵔⵉⴱ', 'Al-maɣréb', 'المغرب',
            'Netherlands', 'Nederland', 'Nederlân',
            'Niger',
            'Nigeria', ' Nijeriya', 'Naìjíríyà', 'Nàìjíríà',
            'North Macedonia', 'Severna Makedonija', 'Северна Македонија', 'Maqedonia e Veriut',
            'Norway', 'Norge', 'Noreg', 'Norga', 'Vuodna', 'Nöörje',
            'Poland', 'Polska',
            'San Marino',
            'Serbia', 'Srbija', 'Србија',
            'Slovakia', 'Slovensko',
            'Slovenia', 'Slovenija',
            'Spain', 'España', 'Espanya', 'Espainia', 'Espanha',
            'Sweden', 'Sverige',
            'Switzerland', 'Schweiz', 'Suisse', 'Svizzera', 'Svizra',
            'Tunisia', 'Tunes', 'ⵜⵓⵏⵙ', 'Tūns', 'تونس',
            'Vatican City', 'Civitas Vaticana', 'Città del Vaticano'
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
            'Belarus', 'Bielaruś', 'Беларусь',
            'Botswana',
            'Bulgaria', 'Bălgariya', 'Bălgarija', 'България',
            'Burundi', 'Uburundi',
            'Democratic Republic  of the Congo', 'DRC', //E
            'Cyprus', 'Kypros', 'Κύπρος', 'Kıbrıs',
            'Egypt', 'Misr', 'Masr', 'مصر',
            'Estonia', 'Eesti',
            'Eswatini', 'eSwatini',
            'Finland', 'Suomi',
            'Greece', 'Hellas', 'Ellada', 'Ελλάς', 'Ελλάδα',
            'Israel', 'Yisra\'el', 'ישראל', 'Israʼiyl', 'إسرائيل',
            'Jordan', 'Al-’Urdun', 'الأردن',
            'Latvia', 'Latvija',
            'Lebanon', 'Lubnān', 'لبنان ', 'Liban',
            'Lesotho',
            'Libya', 'ⵍⵉⴱⵢⴰ', 'Lībiyā', 'ليبيا',
            'Lithuania', 'Lietuva',
            'Malawi', 'Malaŵi',
            'Moldova',
            'Mozambique', 'Moçambique',
            'Namibia', 'Namibië',
            'Palestine', 'Filasṭīn', 'فلسطين',
            'Romania', 'România',
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'Kaliningrad', 'Kaliningrad Oblast',
            'Rwanda',
            'South Africa', 'Suid-Afrika', 'iNingizimu Afrika', 'uMzantsi Afrika', 'Afrika-Borwa', 'Afrika Borwa', 'Aforika Borwa', 'Afurika Tshipembe', 'Afrika Dzonga', 'iNingizimu Afrika', 'iSewula Afrika',
            'Sudan', 'As-Sudan', 'السودان',
            'Syria', 'Suriyah', 'سورية',
            'Ukraine', 'Ukrajina', 'Україна',
            'Zambia',
            'Zimbabwe'
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
            'Bahrain', 'Al-Baḥrayn', 'البحرين',
            'Comoros', 'Komori', 'Juzur al-Qamar', 'جزر القمر', 'Comores',
            'Djibouti', 'Jībūtī', 'جيبوتي', 'Djibouti', 'Jabuuti', 'Gabuuti',
            'Eritrea', 'Iritriya', 'إرتريا', 'Ertra', 'ኤርትራ',
            'Ethiopia', 'Ityop\'ia', 'ኢትዮጵያ',
            'Iraq', 'Al-\'Iraq', 'العراق', 'Êraq', 'عێراق',
            'Kenya',
            'Kuwait', 'Dawlat ul-Kuwayt', 'دولة الكويت', 'il-ikwet', 'الكويت',
            'Madagascar', 'Madagasikara',
            'Mayotte',
            'Qatar', 'Qaṭar', 'قطر',
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'Saudi Arabia', 'Al-Mamlaka Al-‘Arabiyyah as Sa‘ūdiyyah', 'المملكة العربية السعودية',
            'Somalia', 'Soomaaliya', 'aş-Şūmāl', 'الصومال',
            'South Sudan', 'Sudan Kusini', 'Paguot Thudän',
            'Tanzania',
            'Turkey', 'Türkiye',
            'Uganda',
            'Yemen', 'Al-Yaman', 'اليمن'
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
            'Iran', 'Īrān', 'ایران'
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
            'Armenia', 'Hayastan', 'Hayastán', 'Հայաստան',
            'Azerbaijan', 'Azərbaycan',
            'Georgia', 'Sak\'art\'velo', 'საქართველო',
            'Mauritius', 'Maurice', 'Moris',
            'Oman', '‘Umān', 'عُمان',
            'Reunion', 'Réunion', 'La Réunion',
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'Seychelles', 'Sesel',
            'United Arab Emirates', 'UAE', 'Al-’Imārat Al-‘Arabiyyah Al-Muttaḥidah', 'الإمارات العربيّة المتّحدة'
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
            'Afghanistan', 'Afghanestan', 'افغانستان',

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
            'British Indian Ocean Territory', //NAO
            'French Southern and Antarctic Lands',
            'Heard Island and McDonald Islands',
            'Kazakhstan', 'Qazaqstan', 'Қазақстан', 'Kazakhstán', 'Казахстан',            //W
            'Maldives', 'Dhivehi Raajje', 'ދިވެހިރާއްޖެ',
            'Pakistan', 'Pākistān', 'پاکستان',
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'Tajikstan', 'Tojikistan', 'Тоҷикистон',
            'Turkmenistan', 'Türkmenistan',
            'Uzbekistan', 'O‘zbekiston', 'Ўзбекистон'
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
            'Sri Lanka', 'Sri Lankā', 'ශ්‍රී ලංකාව', 'இலங்கை'
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
            'Nepal', 'Nepāl', 'नेपाल'
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
            'Bhutan', 'Druk Yul', 'འབྲུག་ཡུལ',
            'British Indian Ocean Territory', //CIA
            'Kazakhstan', 'Qazaqstan', 'Қазақстан', 'Kazakhstán', 'Казахстан', //E
            'Kyrgyzstan', 'Кыргызстан',
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'Bangladesh', 'বাংলাদেশ'
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
            'Cocos Islands',
            'Myanmar', 'Burma', 'Myanma', 'မြန်မာ'
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
            'Cambodia', 'Kămpŭchéa', 'កម្ពុជា',
            'Christmas Island',
            'Indonesia', //W
            'Java',
            'Sumatra',
            'Laos', 'Lao', 'ປະເທດລາວ',
            'Mongolia', 'Mongol Uls', 'Монгол Улс', 'ᠮᠤᠩᠭᠤᠯ ᠤᠯᠤᠰ',
            'Hovd',
            'Uvs',
            'Bayan-Ölgii',
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'Thailand', 'Thai', 'Prathet Thai', 'Ratcha-anachak Thai', 'ไทย', 'ประเทศไทย', 'าชอาณาจักรไทย',
            'Vietnam', 'Việt Nam'
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
            'PST',
            'AWST',
            'Australia',
            'Western Australia', 'WA',
            'Brunei', 'بروني',
            'China', 'Zhōngguó', 'Zhōnghuá Rénmín Gònghéguó', '中国', '中华人民共和国', 'PRC', 'People\'s Republic of China',
            'Hong Kong', 'Heung Gong', '香港',
            'Indonesia', //C
            'Bali',
            'Borneo',
            'Macau', 'Oumún', '澳門', 'Macau',
            'Malaysia',
            'Mongolia', 'Mongol Uls', 'Монгол Улс', 'ᠮᠤᠩᠭᠤᠯ ᠤᠯᠤᠰ',//most of
            'Philippines', 'Pilipinas',
            'Singapore', 'Singapura', 'Xīnjiāpō', '新加坡', 'Singapur', 'சிங்கப்பூர்',
            'Taiwan', 'Zhōnghuá Mínguó', 'Táiwān', '中華民國', '臺灣', '台灣',
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
            'East Timor', 'Timor-Leste', 'Timor Lorosa\'e',
            'Indonesia', //E
            'Malaku',
            'Western New Guinea', 'Papua Niugini', 'Papua Niu Gini',
            'Japan', 'Nihon', 'Nippon', '日本',
            'North Korea', 'Chosŏn', '조선', '朝鮮', 'Bukchosŏn', '북조선',
            'South Korea', 'Hanguk', '한국', '韓國', 'Namhan', '남한',
            'Palau', 'Belau',
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
            'Australia',
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
            'Australia',
            'Australian Capital Territory', 'ACT',
            'New South Wales', 'NSW',
            'Sydney',
            'Queensland', 'QLD',
            'Brisbane',
            'Tasmania', 'TAS',
            'Hobart',
            'Victoria', 'VIC',
            'Melbourne',
            'Federated States of Micronesia', 'Micronesia',
            'Chuuk',
            'Yap',
            'Guam', 'Guåhån',
            'Northern Mariana Islands', 'Notte Mariånas',
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
            'Australia',
            'Norfolk Island', ' Norf\'k Ailen',
            'Federated States of Micronesia', 'Micronesia',
            'Kosrae',
            'Pohnpei',
            'New Caledonia', 'Nouvelle-Calédonie',
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'Solomon Islands', 'Solomon Aelan',
            'Vanuatu'
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
            'Fiji', 'Viti', 'फ़िजी',
            'Kiribati',
            'Gilbert Islands',
            'Marshall Islands', 'Aorōkin Ṃajeḷ',
            'Nauru', 'Naoero',
            'New Zealand', 'Aotearoa',
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'South Pole',
            'Tuvalu',
            'Wake Island',
            'Wallis and Futuna'
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
            'Samoa', 'Sāmoa',
            'Apia', //^
            'New Zealand',
            'Tokelau',
            'Tonga'
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
