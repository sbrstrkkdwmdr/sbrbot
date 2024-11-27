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
 * @source https://en.wikipedia.org/wiki/List_of_capitals_in_the_United_States 
 * @source https://en.wikipedia.org/wiki/Provinces_and_territories_of_Canada
 * @source https://en.wikipedia.org/wiki/List_of_international_airports_by_country
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
            'Avarua', //^ capital
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
            'Hawaii', //^ state
            'Honolulu', //^ state capital
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
            'Alaska', //^ state
            'Juneau', //^ state capital
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
            'British Columbia', //^ province/territory //most of
            'Victoria', //^ province/territory capital
            'Vancouver', //^ major city
            'Yukon', //^ province/territory
            'Clipperton Island',
            'Mexico', 'México', 'Mēxihco', 'MX', 'MEX',
            'Baja California Norte', 'Baja California',//^ 
            'Pitcairn Islands', ' Pitkern Ailen', 'PN', 'PCN',
            'Adamstown', //^ capital
            'USA', 'US', 'United States of America', 'America', 'Estados Unidos', 'États-Unis', '‘Amelika Hui Pū ‘ia',
            'Washington',//^ state
            'Olympia', //^ state capital
            'Idaho (North)', //^ state //north
            'Oregon',//^ state
            'Salem', //^ state capital
            'California',//^ state
            'Sacramento', //^ state capital
            'Los Angeles', //^ major city
            'San Francisco', //^ major city
            'Silicon Valley', //^ part of san francisco
            'Nevada', //^ state
            'Nevada (Eastern)', //^ state
            'Carson City', //^ state capital
            'Las Vegas', //^ major city
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
            'MT',
            'Canada',
            'Alberta',//^ province/territory
            'Edmonton', //^ province/territory capital
            'Calgary', //^ major city
            'British Columbia (Eastern)',//^ province/territory
            'Lloydminster',//^ 
            'Northwest Territories', //^
            'Nunavut (Western)',//^ 
            'Mexico', 'México', 'Mēxihco', 'MX', 'MEX',
            'Baja California Sur',//^ 
            'Nayarit',//^ 
            'Sinaloa',//^ 
            'Sonora',//^ 
            'USA', 'US', 'United States of America', 'America', 'Estados Unidos', 'États-Unis', '‘Amelika Hui Pū ‘ia',
            'North Dakota (SW)', //^state //SW
            'South Dakota (Western)', //^state //W
            'Nebraska (Western)', //^ state//W
            'Kansas (Sherman, Wallace, Greeley and Hamilton)', //^ state//small bit
            'Montana',//^ state
            'Helena', //^ state capital
            'Nevada (Eastern)', //^ state
            'Oregon (Malheur County)', //^ state//small bit
            'Idaho (Southern)', //^state //southern
            'Boise', //^ state capital
            'Wyoming',//^ state
            'Cheyenne', //^ state capital
            'Utah',//^ state
            'Salt Lake', 'Salt Lake City', //^ state capital
            'Colorado',//^ state
            'Denver', //^ state capital
            'Arizona',//^ state
            'Phoenix', //^ state capital
            'New Mexico',//^ state
            'Santa Fe', //^ state capital
            'Albuquerque', //^ major city
            'Texas (El Paso and Hudspeth)', //^ state //El Paso area
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
            'Belmopan', //^
            'Canada',
            'Manitoba',//^ province/territory
            'Winnipeg', //^ province/territory capital
            'Nunavut (Central)',//^ 
            'Saskatchewan',//^ province/territory
            'Regina', //^ province/territory capital
            'Saskatoom', //^ major city
            'Ontario', //^ provincce //NW
            'Ottawa', //^ capital
            'Costa Rica', 'CR', 'CRI',
            'Easter Island',
            'El Salvador', 'SV', 'SLV',
            'Galapagos Islands',
            'Guatemala', 'GT', 'GTH',
            'Guatemala City', 'Ciudad de Guatemala', //^ capital
            'Honduras', 'HN', 'HND',
            'Tegucigalpa', //^ capital
            'Mexico', 'México', 'Mēxihco', 'MX', 'MEX',
            'Mexico City', 'Ciudad de México', 'Āltepētl Mēxihco', //^ capital
            'Aguascalientes', //^
            'Campeche', //^
            'Chiapas', //^
            'Chihuahua',//^ 
            'Coahila', //^
            'Colima', //^
            'Durango', //^
            'Guanajuato', //^
            'Guerrero', //^
            'Hidalgo', //^
            'Jalisco', //^
            'Morelos ', //^
            'Nuevo León ', 'Neuvo Leon',//^
            'Oaxaca', //^
            'Puebla', //^
            'Querétaro ', 'Queretaro', //^
            'San Luis Potosí', //^
            'Tabasco', //^
            'Tamaulipas', //^
            'Tlaxcala', //^
            'Veracruz de Ignacio de la Llave', 'Veracruz', //^
            'Yucatán', 'Yucatan', //^
            'Zacatecas', //^
            'Nicaragua', 'NI', 'NIC',
            'Managua', //^ capital
            'USA', 'US', 'United States of America', 'America', 'Estados Unidos', 'États-Unis', '‘Amelika Hui Pū ‘ia',
            'Wisconsin',//^ state
            'Madison', //^ state capital
            'Illinois',//^ state
            'Springfield', //^ state capital
            'Indiana (Western Corners)', //^ state//SW and NW corners
            'Kentucky (Western)',//^  state//W
            'Tennessee',//^  state//W and central
            'Michigan (Gogebic, Iron, Dickinson, and Menominee)', //^ state (W)
            'Mississippi',//^ state
            'Jackson', //^ state capital
            'Alabama',//^ state
            'Montgomery', //^ state capital
            'Minnesota',//^ state
            'Saint Paul', //^ state capital
            'Iowa',//^ state
            'Des Moines', //^ state capital
            'Missouri',//^ state
            'Jefferson City', //^ state capital
            'Arkansas',//^ state
            'Little Rock', //^ state capital
            'Louisiana',//^ state
            'Baton Rouge', //^ state capital
            'North Dakota',//^  state//N and E
            'Bismark', //^ state capital
            'South Dakota',//^state //E
            'Pierre', //^ state capital
            'Nebraska', //^ state//E and central
            'Lincoln', //^ state capital
            'Kansas',//^ state //most of
            'Topeka', //^ state capital
            'Oklahoma',//^ state
            'Oklahoma City', //^ state capital
            'Texas', //^ state//most of
            'Austin', //^ state capital
            'Houston', //^ major city
            'Florida', //^ state //W
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
            'The Bahamas', 'Bahamas', 'BS', 'BHS',
            'Nassau', //^ capital
            'Brazil', 'Brasil', 'BR', 'BRA',
            'Acre', //^ 
            'Canada',
            'Nunavut (Eastern)',//^ 
            'Ontario', //^ //most of
            'Toronto', //^ province/territory capital
            'Quebec', //^ province/territory //most of
            'Quebec City', //^ province/territory capital
            'Montreal', //^ major city
            'Cayman Islands', 'KY', 'CYM',
            'George Town', //^ capital
            'Colombia', 'CO', 'COL',
            'Bogota', 'Bogotá', //^ capital
            'Cuba', 'CU', 'CUB',
            'Havana', 'La Habana', //^ capital
            'Ecuador', 'EC', 'ECU',
            'Quito', //^ capital
            'Haiti', 'Haïti', 'Ayiti', 'HT', 'HTI',
            'Port-au-Prince', 'Pòtoprens', //^ capital
            'Jamaica', 'JM', 'JAM',
            'Kingston', //^ capital
            'Mexico', 'México', 'Mēxihco', 'MX', 'MEX',
            'Quintana Roo',
            'Navassa Island',
            'Panama', 'Panamá', 'PA', 'PAN',
            'Panama City', 'Ciudad de Panamá', //^ capital
            'Peru', 'Perú', 'Piruw', 'PE', 'PER',
            'Lima', //^ capital
            'USA', 'US', 'United States of America', 'America', 'Estados Unidos', 'États-Unis', '‘Amelika Hui Pū ‘ia',
            'Maine',//^ state 
            'Augusta', //^ state capital
            'New Hampshire',//^ state 
            'Concord', //^ state capital
            'Vermont',//^ state 
            'Montpelier', //^ state capital
            'New York', //^ state 
            'Albany', //^ state capital
            'NYC', 'New York City', //^ major city
            'Massachusetts',//^ state 
            'Boston', //^ state capital
            'Connecticut',//^ state 
            'Hartford', //^ state capital
            'Rhode Island',//^ state 
            'Providence', //^ state capital
            'Michigan', //^state  //excl. few north west
            'Lansing', //^ state capital  
            'Indiana', //^ state //excl. NW and SW corners
            'Indianapolis', //^ state capital            
            'Ohio',//^ state 
            'Columbus', //^ state capital
            'Pennsylvania',//^ state 
            'Harrisburg', //^ state capital
            'New Jersey',//^ state
            'Trenton', //^ state capital
            'Kentucky', //^state //E
            'Frankfort', //^ state capital
            'West Virginia',//^ state
            'Charleston', //^ state capital
            'Virginia',//^ state
            'Richmond', //^ state capital
            'Washington D.C.', 'Washington, D.C.', 'Washington DC',//^ capital
            'Maryland',//^ state
            'Annapolis', //^ state capital
            'Delaware',//^ state
            'Dover', //^ state capital
            'Tennessee (Eastern)', //^state //E
            'Nashville', //^ state capital
            'North Carolina',//^ state
            'Raleigh', //^ state capital
            'Georgia',//^ state
            'Atlanta', //^ state capital
            'South Carolina',//^ state
            'Columbia', //^ state capital
            'Florida',//^ state //excl. W panhandle
            'Tallahassee', //^ state capital
            'Miami', //^ major city
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
            'Saint John\'s', 'St. John\'s', //^ capital
            'Aruba', 'AW', 'ABW',
            'Oranjestad', // ^ capital
            'Barbados', 'BB', 'BRB',
            'Bridgetown', //^ capital
            'Bermuda', 'BM', 'BMU',
            'Hamilton', //^ capital
            'Bolivia', 'Buliwya', 'Wuliwya', 'Volívia', 'BO', 'BOL',
            'La Paz', 'Chuqiyapu', //^ capital
            'Brazil', 'Brasil', 'BR', 'BRA',
            'Boa Vista',//^ 
            'Campo Grande',//^ 
            'Manaus',//^ 
            'Canada',
            'Labrador',//^
            'New Brunswick',//^ province/territory
            'Fredericton', //^ province/territory capital
            'Moncton', //^ major city
            'Nova Scotia',//^ province/territory
            'Halifax', //^ province/territory capital
            'Prince Edward Island',//^ province/territory
            'Charlottetown', //^ province/territory capital
            'Quebec', //^ province/territory //E
            'Chile', 'CL', 'CHL',
            'Santiago', //^ capital
            'Curaçao', 'Curacao', 'Kòrsou',
            'Willemstad', //^ capital
            'Dominica', 'DM', 'DMA',
            'Roseau', //^ capital
            'Dominican Republic', 'República Dominicana', 'DO', 'DOM',
            'Santo Domingo', //^ capital
            'Falkland Islands', 'FK', 'FLK',
            'Stanley', //^ capital
            'Greenland', 'Kalaallit Nunaat', 'Grønland', 'GL', 'GRL', //W
            'Nuuk', 'Godthåb', //^ capital
            'Ittoqqortoormiit',
            'Thule Air Base',
            'Grenada', 'GD', 'GRD',
            'St. George\'s', //^ capital
            'Guadeloupe',
            'Basse-Terre', //^ capital
            'Guyana', 'GY', 'GUY',
            'Georgetown', //^ capital
            'Martinique',
            'Fort-de-France', //^ capital
            'Monsterrat',
            'Brades Estate', //^ capital
            'Netherlands Antilles', 'Antilles', 'AN', 'ANT',
            'Paraguay', 'Paraguái', 'PY', 'PRY',
            'Asuncion', 'Asunción', //^ capital
            'Puerto Rico', 'PR', 'PRI',
            'San Juan', //^ capital
            'Saint Kitts and Nevis', 'KN', 'KNA',
            'Basseterre', //^ capital
            'Saint Lucia', 'LC', 'LCA',
            'Castries', //^ capital
            'Saint Vincent and the Grenadines', 'VC', 'VCT',
            'Kingstown', //^ capital
            'Trinidad and Tobago', 'TT', 'TTO',
            'Port of Spain', //^ capital
            'Turks and Caicos Islands', 'TC', 'TCA',
            'Cockburn Town', //^ capital
            'U.S. Virgin Islands', 'US Virgin Islands', 'Virgin Islands', 'VI', 'VIR',
            'Charlotte Amalie', //^ capital
            'Venezuela', 'VE', 'VEN',
            'Caracas', //^ capital
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
            'St. John\'s', //^ province/territory capital
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
            'Buenos Aires', //^ capital
            'Brazil', 'Brasil', 'BR', 'BRA',
            'Brasilia',//^ capital
            'Rio',//^ 
            'Sao Paulo', 'São Paulo',//^ 
            'Fortaleza',
            'Maceio',
            'Recife',
            'Salvador',
            'French Guiana', 'Guyane',
            'Cayenne', //^ capital
            'Greenland', 'Kalaallit Nunaat', 'Grønland', 'GL', 'GRL',//central
            'Saint Pierre and Miquelon', 'PM', 'SPM',
            'Saint-Pierre', 'Saint Pierre', //^ capital
            'Suriname', 'SR', 'SUR',
            'Paramaribo', //^ capital
            'Uruguay', 'UY', 'URY',
            'Montevideo', //^ capital
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
            'Praia', //^ capital
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
            'Ouagadougou', //^ capital
            'Bouvet Island',
            'Canary Islands',
            'Cote d\'Ivoire', 'Ivory Coast', 'CI', 'CIV',
            'Yamoussoukro', //^ capital
            'Faroe Islands', 'Føroyar', 'Færøerne', 'FO', 'FRO',
            'Torshavn', 'Thorshavn', 'Tórshavn', //^ capital
            'Gambia', 'The Gambia', 'GM', 'GMB',
            'Banjul', //^ capital
            'Ghana', 'Gaana', 'Gana', 'GH', 'GHA',
            'Accra', 'Nkran', //^ capital
            'Greenland', 'Kalaallit Nunaat', 'Grønland', 'GL', 'GRL',//NE
            'Guernsey', 'GG', 'GGY',
            'Saint Peter Port', //^ capital
            'Guinea', 'Guinée', 'Gine', 'GN', 'GIN',
            'Conakry', 'Konakiri', //^ capital
            'Guinea-Bissau', 'Guiné-Bissau', 'GW', 'GNB',
            'Bissau', //^ capital
            'Iceland', 'Ísland', 'IS', 'ISL',
            'Reykjavik', 'Reykjavík', //^ capital
            'Ireland', 'Éire', 'IE', 'IRL',
            'Dublin', 'Baile Átha Cliath', //^ capital
            'Isle of Man', 'Ellan Vannin', 'IM', 'IMN',
            'Douglas', 'Doolish', //^ capital
            'Jersey', 'Jèrri', 'JE', 'JEY',
            'St. Helier', 'Saint Hélier', 'Saint Hélyi', //^ capital
            'Liberia', 'LR', 'LBR',
            'Monrovia', //^ capital
            'Mali', 'ML', 'MLI',
            'Bamako', 'Bamakɔ', //^ capital
            'Mauritania', 'MR', 'MRT',
            'Nouakchott', 'Nwakcuṭ', 'anu ukcuḍ', 'ⵏⵡⴰⴽⵛⵓⵟ', 'ⴰⵏⵓ ⵓⴽⵛⵓⴹ', 'nwakšūṭ', 'أنو ؤكشوض', 'نواكشوط', //^ capital
            'Northern Ireland',
            'Portugal', 'PT', 'PRT',
            'Lisbon', 'Lisboa', //^ capital
            'Saint Helena', 'SH', 'SHN', 'Ascension', 'Tristan da Cunha', 'Saint Helena, Ascension and Tristan da Cunha',
            'Jamestown', //^ capital
            'Sao Tome and Principe', 'São Tomé and Príncipe', 'São Tomé e Príncipe', 'ST', 'STP',
            'São Tomé', 'Sao Tome', //^ capital
            'Senegal', 'Sénégal', 'Senegaal', 'SN', 'SEN',
            'Dakar', 'Ndakaaru', //^ capital
            'Sierra Leone', 'SL', 'SLE',
            'Freetown', //^ capital
            'Togo', 'TG', 'TGO',
            'Lome', 'Lomé', 'Loma', //^ capital
            'United Kingdom', 'UK', 'U.K.', 'Britain', 'Great Britain', 'Y Deyrnas Unedig', 'Unitit Kinrick', 'Rìoghachd Aonaichte', 'Ríocht Aontaithe', 'An Rywvaneth Unys', 'GB', 'GBR',
            'London', 'Llundain', 'Lunnon', 'Lunnainn', 'Londain', 'Loundres', //^ capital
            'England', //^ 
            'Scotland', //^ 
            'Wales', //^ 
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
            'Tirana', //^ capital
            'Andorra', 'AD', 'AND',
            'Andorra la Vella', //^ capital
            'Algeria', 'Dzayer', 'ⴷⵣⴰⵢⴻⵔ', 'Al-Jazā\'ir', 'الجزائر', 'DZ', 'DZA',
            'Algiers', 'ALG', //^ capital
            'AZR', 'AAE', 'BLJ', 'BJA', 'BSK', 'CFK', 'CZL', 'HME', 'GJL', 'ORN', 'QSF', 'TMR', 'TLM', 'xxx', //^ airports
            'Angola', 'AO', 'AGO',
            'Luanda', 'Lwanda', //^ capital
            'Austria', 'Österreich', 'Osterreich', 'AT', 'AUT',
            'Vienna', 'Wien', //^ capital
            'Belgium', 'België', 'Belgique', 'Belgien', 'BE', 'BEL',
            'Brussels', 'Bruxelles', 'Brüssel', //^ capital
            'Benin', 'Bénin', 'BJ', 'BN',
            'Porto-Novo', //^ capital
            'Bosnia And Herzegovina', 'Bosnia', 'Herzegovina', 'Bosna i Hercegovina', 'Босна и Херцеговина', 'BA', 'BIH',
            'Sarajevo', 'Сарајево', //^ capital
            'Cameroon', 'Cameroun', 'CM', 'CMR',
            'Yaounde', 'Yaoundé', //^ capital
            'Central African Republic', 'CAR', 'Centrafrique', 'Bêafrîka', 'CF', 'CAF',
            'Bangui', //^ capital
            'Chad', 'Tchad', 'Tšād', 'تشاد', 'TD', 'TCD',
            'N\'Djamena', 'Ndjjamena', 'Nijāmīnā', 'نجامينا', //^ capital
            'Republic of the Congo', 'République du Congo', 'Repubilika ya Kôngo', 'Republíki ya Kongó', 'CG', 'COG',
            'Brazzaville', 'Balazavile', //^ capital
            'Democratic Republic of the Congo', 'DRC', 'République démocratique du Congo', 'Republíki ya Kongó Demokratíki', 'Repubilika ya Kôngo ya Dimokalasi', 'Jamhuri ya Kidemokrasia ya Kongo', 'CD', 'COD', //W
            'Kinsasha', 'Kinsasa', 'Kinsásá', //^ capital
            'Croatia', 'Hrvatska', 'HR', 'HRV',
            'Zagreb', //^ capital
            'Czech Republic', 'Česká republika', 'Česko', 'CZ', 'CZE',
            'Prague', 'Praha', //^ capital
            'Denmark', 'Danmark', 'DK', 'DNK',
            'Copenhagen', 'København', //^ capital
            'Equatorial Guinea', 'Guinea Ecuatorial', 'Guinée équatoriale', 'Guiné Equatorial', 'GQ', 'GNQ',
            'Malabo', //^ capital
            'France', 'FR', 'FRA',
            'Paris', //^ capital
            'Gabon', 'République gabonaise', 'GA', 'GAB',
            'Libreville', //^ capital
            'Germany', 'Deutschland', 'DE', 'DEU',
            'Berlin', //^ capital
            'Gibraltar', 'GI', 'GIB',
            'Hungary', 'Magyarország', 'HU', 'HUN',
            'Budapest', //^ capital
            'Italy', 'Italia', 'IT', 'ITA',
            'Rome', 'Roma', //^ capital
            'Kosovo', 'Косово', 'Kosova', 'XK', 'XKX',
            'Pristina', 'Prishtinë', 'Priština', 'Приштина', //^ capital
            'Liechtenstein', 'LI', 'LIE',
            'Vaduz', //^ capital
            'Luxembourg', 'Lëtzebuerg', 'Luxemburg', 'LU', 'LUX',
            'Malta', 'MT', 'MLT',
            'Valletta', 'Il-Belt Valletta', //^ capital
            'Monaco', 'Múnegu', 'MC', 'MCO',
            'Montenegro', 'Crna Gora', 'Црна Гора', 'ME', 'MNE',
            'Podgorica', 'Подгорица', //^ capital
            'Morocco', 'Amerruk', 'Elmeɣrib', 'ⴰⵎⵔⵔⵓⴽ', 'ⵍⵎⵖⵔⵉⴱ', 'Al-maɣréb', 'المغرب', 'MA', 'MAR',
            'Rabat', 'Errbaṭ', 'ⵔⵔⴱⴰⵟ', 'Ar-ribaaṭ', 'الرباط', //^ capital
            'AGA', 'CMN', 'FEZ', 'RAK', 'NDR', 'OUD', 'RBA', 'TNG', 'TTU', 'VIL', 'EUN', //^ airport
            'Netherlands', 'Nederland', 'Nederlân', 'NL', 'NLD',
            'Amsterdam', //^ capital
            'Niger', 'NE', 'NER',
            'Niamey', //^ capital
            'Nigeria', ' Nijeriya', 'Naìjíríyà', 'Nàìjíríà', 'NG', 'NGA',
            'Abuja', 'Àbújá', //^ capital
            'North Macedonia', 'Severna Makedonija', 'Северна Македонија', 'Maqedonia e Veriut', 'MK', 'MKD',
            'Skopje', 'Скопје', 'Shkup', //^ capital
            'Norway', 'Norge', 'Noreg', 'Norga', 'Vuodna', 'Nöörje', 'NO', 'NOR',
            'Oslo', //^ capital
            'Poland', 'Polska', 'PL', 'POL',
            'Warsaw', 'Warszawa', //^ capital
            'San Marino', 'SM', 'SMR',
            'Serbia', 'Srbija', 'Србија', 'RS', 'SRB',
            'Belgrade', 'Beograd', 'Београд', //^ capital
            'Slovakia', 'Slovensko', 'SK', 'SVK',
            'Philipsburg', //^ capital
            'Slovenia', 'Slovenija', 'SI', 'SVN',
            'Ljubljana', //^ capital
            'Spain', 'España', 'Espanya', 'Espainia', 'Espanha', 'ES', 'ESP',
            'Madrid', 'Madril', //^ capital
            'Sweden', 'Sverige', 'SZ', 'SWZ',
            'Stockholm', //^ capital
            'Switzerland', 'Schweiz', 'Suisse', 'Svizzera', 'Svizra', 'SE', 'SWE',
            'Bern', 'Berne', 'Berna', //^ capital
            'Tunisia', 'Tunes', 'ⵜⵓⵏⵙ', 'Tūns', 'تونس', 'TN', 'TUN',
            'Tunis', //^ capital
            'Vatican City', 'Civitas Vaticana', 'Città del Vaticano', 'Holy See', 'VA', 'VAT',
            'Western Sahara', 'EH', 'ESH'
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
            'Minsk', 'Мінск', 'Минск', //^ capital
            'Botswana', 'BW', 'BWA',
            'Gaborone', //^
            'Bulgaria', 'Bălgariya', 'Bălgarija', 'България', 'BG', 'BGR',
            'Sofia', 'Sofiya', 'Sofija', 'София', //^ capital
            'Burundi', 'Uburundi', 'BI', 'BDI',
            'Democratic Republic  of the Congo', 'DRC', //E
            'Cyprus', 'Kypros', 'Κύπρος', 'Kıbrıs', 'CY', 'CYP',
            'Nicosia', 'Lefkosia', 'Λευκωσία', 'Lefkoşa', //^ capital
            'Egypt', 'Misr', 'Masr', 'مصر', 'EG', 'EGY',
            'Cairo', 'Al-Qāhirah', 'القاهرة', //^ capital
            'Alexandria',
            'HBE', 'ALY', 'ATZ', 'ASW', 'CAI', 'SPX', 'AAC', 'DBB', 'HRG', 'LXR', 'RMF', 'MUH', 'SKV', 'SSH', 'HMB', 'TCP', //^ airports
            'Estonia', 'Eesti', 'EE', 'EST',
            'Tallinn', //^ capital
            'Eswatini', 'eSwatini', 'Swaziland',//(former name)
            'Mbabane', //^ capital
            'Finland', 'Suomi', 'FI', 'FIN',
            'Helsinki', 'Helsingfors', //^ capital
            'Aland', 'Åland', 'Ahvenanmaa', //^ (autonomous region)
            'Mariehamn', 'Maarianhamina', //^ capital
            'Greece', 'Hellas', 'Ellada', 'Ελλάς', 'Ελλάδα', 'GR', 'GRC',
            'Athens', 'Athinai', 'Athina', 'Αθήναι', 'Αθήνα', //^ capital
            'Israel', 'Yisra\'el', 'ישראל', 'Israʼiyl', 'إسرائيل', 'IL', 'ISR',
            'Jerusalem', 'Yerushalayim', 'ירושלים', 'Al-Quds', 'القُدس', //^ capital
            'Jordan', 'Al-’Urdun', 'الأردن', 'JO', 'JOR',
            'Amman', '‘Ammān', 'عمان', //^ capital
            'Latvia', 'Latvija', 'LV', 'LVA',
            'Riga', 'Rīga', //^ capital
            'Lebanon', 'Lubnān', 'لبنان ', 'Liban', 'LB', 'LBN',
            'Beirut', 'Bayrut', 'Bayrūt', 'بيروت', 'Beyrouth', //^ capital
            'Lesotho', 'LS', 'LSO',
            'Maseru', //^ capital
            'Libya', 'ⵍⵉⴱⵢⴰ', 'Lībiyā', 'ليبيا', 'LY', 'LBY',
            'Tripoli', 'Ṭrables', 'ⵟⵔⴰⴱⵍⴻⵙ', 'Tarabulus', 'طرابلس', //^ capital
            'BEN', 'SEB', 'TIP', 'MJI', //^ airports
            'Lithuania', 'Lietuva', 'LT', 'LTU',
            'Vilnius', //^ capital
            'Malawi', 'Malaŵi', 'MW', 'MWI',
            'Lilongwe', //^ capital
            'Moldova', 'MD', 'MDA',
            'Chisinau', 'Chișinău', //^ capital
            'Mozambique', 'Moçambique', 'MZ', 'MOZ',
            'Maputo', //^ capital
            'Namibia', 'Namibië', 'NA', 'NAM',
            'Windhoek', 'Windhuk', '/Ae-//Gams', 'Otjomuise', //^ capital
            'Palestine', 'Filasṭīn', 'فلسطين', 'PS', 'PSE',
            'East Jerusalem', 'Al-Quds Al-Sharqit', 'القدس الشرقية', //^ declared capital
            'Ramallah', 'Rāmallāh', 'رام الله', //^ administrative capital
            'Romania', 'România', 'RO', 'ROU',
            'Bucharest', 'București', //^ capital
            'Russia', 'Rossiya', 'Rossiâ', 'Россия', 'RU', 'RUS',
            'Kaliningrad', 'Kaliningrad Oblast', 'KALT', //^
            'Rwanda', 'RW', 'RWA',
            'Kigali', //^ capital
            'South Africa', 'Suid-Afrika', 'iNingizimu Afrika', 'uMzantsi Afrika', 'Afrika-Borwa', 'Afrika Borwa', 'Aforika Borwa', 'Afurika Tshipembe', 'Afrika Dzonga', 'iNingizimu Afrika', 'iSewula Afrika', 'ZA', 'ZAF',
            'Pretoria', 'iPitoli', 'ePitoli', 'Pitoli', 'Pritoriya', 'Tshwane', //^ administrative capital
            'Cape Town', 'Kappstad', 'iKapa', //^ legislative capital
            'Bloemfontein', 'ǀʼAuxa ǃXās', 'Mangaung', //^ judicial capital
            'Sudan', 'As-Sudan', 'السودان', 'SD', 'SDN',
            'Khartoum', 'Al-Khartûm', 'الخرطوم', //^ capital
            'KRT', 'PZU', //^ airport
            'Syria', 'Suriyah', 'سورية', 'SY', 'SYR',
            'Damascus', 'Dimashq', 'Ash-Sham', 'دمشق', 'الشام ', //^ capital
            'Ukraine', 'Ukrajina', 'Україна', 'UA', 'UKR',
            'Kyiv', 'Kyjiv', 'Київ', //^ capital
            'Zambia', 'ZM', 'ZMB',
            'Lusaka', //^ capital
            'Zimbabwe', 'ZW', 'ZWE',
            'Harare', //^ capital
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
            'Manama', 'Al-Manāmah', 'المنامة', //^ capital
            'Comoros', 'Komori', 'Juzur al-Qamar', 'جزر القمر', 'Comores', 'KM', 'COM',
            'Moroni', 'موروني', //^ capital
            'Djibouti', 'Jībūtī', 'جيبوتي', 'Djibouti', 'Jabuuti', 'Gabuuti', 'DJ', 'DJI',
            'Eritrea', 'Iritriya', 'إرتريا', 'Ertra', 'ኤርትራ', 'ER', 'ERI',
            'Asmara', 'Asmaraa', 'أسمرا', 'Asmära', 'አሥመራ', //^ capital
            'Ethiopia', 'Ityop\'ia', 'ኢትዮጵያ', 'ET', 'ETH',
            'Addis Ababa', 'Addis Abäba', 'አዲስ አበ', //^ capital
            'Iraq', 'Al-\'Iraq', 'العراق', 'Êraq', 'عێراق', 'IQ', 'IRQ',
            'Baghdad', 'بغداد', 'Bexda', 'بەغدا',
            'Kenya', 'KE', 'KEN',
            'Nairobi', //^ capital
            'Kuwait', 'Dawlat ul-Kuwayt', 'دولة الكويت', 'il-ikwet', 'الكويت', 'KW', 'KWT',
            'Kuwait City', 'Madiinat ul-Kuwayt', 'مدينة الكويت', 'id-diira', 'الديرة', //^ capital
            'Madagascar', 'Madagasikara', 'MG', 'MDG',
            'Antananarivo', 'Tananarive', //^ capital
            'Mayotte', 'YT', 'MYT',
            'Mamoudzou', 'Momoju', //^ capital
            'Qatar', 'Qaṭar', 'قطر', 'QA', 'QAT',
            'Doha', 'Ad-Dawḥah', 'الدوحة', //^ capital
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'MSK', 'Moscow', 'Москва', 'Moskva', //^ capital
            'Saudi Arabia', 'Al-Mamlaka Al-‘Arabiyyah as Sa‘ūdiyyah', 'المملكة العربية السعودية', 'SA', 'SAU',
            'Riyadh', 'Ar-Riyāḍ', 'الرياض', //^ capital
            'Somalia', 'Soomaaliya', 'aş-Şūmāl', 'الصومال', 'SO', 'SOM',
            'Mogadishu', 'Maqadīshū', 'مقديشو', //^ capital
            'South Sudan', 'Sudan Kusini', 'Paguot Thudän', 'SS', 'SSD',
            'Juba', //^ capital
            'Tanzania', 'TZ', 'TZA',
            'Dodoma', //^ capital
            'Turkey', 'Türkiye', 'TR', 'TUR',
            'Ankara', //^ capital
            'Istanbul', 'Constantinople', //old name //^ major city
            'Uganda', 'UG', 'UGA',
            'Kampala', //^ capital
            'Yemen', 'Al-Yaman', 'اليمن', 'YE', 'YEM',
            'Sana\'a', 'Ṣan‘ā’', 'ﺻﻨﻌﺎﺀ', //^ capital
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
            'Iran', 'Īrān', 'ایران', 'IR', 'IRN',
            'Tehran', 'Tehrān', 'تهران' //^ capital
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
            'Yerevan', 'Երևան', //^ capital
            'Azerbaijan', 'Azərbaycan', 'AZ', 'AZE',
            'Baku', 'Bakı', //^ capital
            'Georgia', 'Sak\'art\'velo', 'საქართველო', 'GE', 'GEO',
            'Tbilisi', 'თბილისი', //^ capital
            'Mauritius', 'Maurice', 'Moris', 'MU', 'MUS',
            'Port Louis', 'Port-Louis', 'Porlwi', //^ capital
            'Oman', '‘Umān', 'عُمان', 'OM', 'OMN',
            'Muscat', 'Masqaṭ', 'مسقط', //^ capital
            'Reunion', 'Réunion', 'La Réunion', 'RE', 'REU',
            'Saint-Denis', 'Saint Denis', //^ capital
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'SAMT', 'Samara', //^
            'Seychelles', 'Sesel', 'SC', 'SYC',
            'Victoria', 'Port Victoria', //^ capital
            'United Arab Emirates', 'UAE', 'Al-’Imārat Al-‘Arabiyyah Al-Muttaḥidah', 'الإمارات العربيّة المتّحدة', 'AE', 'ARE',
            'Abu Dhabi', '‘Abū ẓabī', 'أبوظبي', //^ capital
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
            'Afghanistan', 'Afghanestan', 'افغانستان', 'AF', 'AFG',
            'Kabul', 'كابل', //^ capital

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
            'Male', 'Malé', 'މާލެ', //^ capital
            'Pakistan', 'Pākistān', 'پاکستان', 'PK', 'PAK',
            'Islamabad', 'Islāmabād', 'اسلام‌اباد', //^ capital
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'YEKT', 'Yekaterinburg', //^
            'Tajikstan', 'Tojikistan', 'Тоҷикистон', 'TJ', 'TJK',
            'Dushanbe', 'Душанбе', //^ capital
            'Turkmenistan', 'Türkmenistan', 'TK', 'TKM',
            'Ashgabat', 'Aşgabat', //^ capital
            'Uzbekistan', 'O‘zbekiston', 'Ўзбекистон', 'UZ', 'UZB',
            'Tashkent', 'Toshkent', 'Тошкент', //^ capital
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
            'New Delhi', 'Nôtun Dillī', 'নতুন দিল্লী', 'Navī Dilhī', 'નવી દિલ્હી', 'Naī Dillī', 'नई दिल्ली', 'Navadehalī', 'ನವದೆಹಲಿ', 'Navī Dillī', 'नवी दिल्ली', 'Nyūḍalhi', 'ന്യൂഡല്ഹി', 'नवी दिल्ली', 'Nayã Dillī', 'नयाँ दिल्ली', 'Nūā Dillī', 'ନୂଆ ଦିଲ୍ଲୀ', 'Navĩ Dillī', 'ਨਵੀਂ ਦਿੱਲੀ', 'Navadehalī', 'नवदेहली', 'Pududilli', 'புது தில்லி', 'Krottaḍhillī', 'క్రొత్తఢిల్లీ', //^ capital
            'Sri Lanka', 'Sri Lankā', 'ශ්‍රී ලංකාව', 'இலங்கை', 'LK', 'LKA',
            'Sri Jayawardenapura Kotte', 'ශ්‍රී ජයවර්ධනපුර කෝට්ටේ', 'ஶ்ரீ ஜெயவர்த்தனபுரம் கோட்டை', //^ capital
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
            'Kathmandu', 'Kāṭhamāṇḍaũ', 'काठमाण्डौं', //^ capital
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
            'Thimphu', 'ཐིམ་ཕུ', //^ capital
            'British Indian Ocean Territory', 'IO', 'IOT', //CIA
            'Kazakhstan', 'Qazaqstan', 'Қазақстан', 'Kazakhstán', 'Казахстан', 'KZ', 'KAZ', //E
            'Astana', 'Астана', //^ capital
            'Kyrgyzstan', 'Кыргызстан', 'KG', 'KGZ',
            'Bishkek', 'Бишкек', //^ capital
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'OMSK', 'Omsk', //^
            'Bangladesh', 'বাংলাদেশ', 'BD', 'BGD',
            'Dhaka', 'Dhākā', 'ঢাকা' //^ capital
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
            'West Island', //^ capital
            'Myanmar', 'Burma', 'Myanma', 'မြန်မာ', 'MM', 'MMR',
            'Nay Pyi Taw', 'နေပြည်တော်' //^ capital
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
            'Phnom Penh', 'Phnum Pénh', 'ភ្នំពេញ',
            'Christmas Island', 'CX', 'CXR',
            'Flying Fish Cove', //^ capital
            'Indonesia', 'ID', 'IDN', //W
            'Jakarta', //^ capital
            'Java', //^
            'Sumatra', //^
            'Laos', 'Lao', 'ປະເທດລາວ', 'LA', 'LAO',
            'Vientiane', 'Vieng Chan', 'Wiang Chan', 'Wīang Chan', 'ວຽງຈັນ', //^ capital
            'Mongolia', 'Mongol Uls', 'Монгол Улс', 'ᠮᠤᠩᠭᠤᠯ ᠤᠯᠤᠰ', 'MN', 'MNG',
            'Hovd',
            'Uvs',
            'Bayan-Ölgii',
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'KRAT', 'Krasnoyarsk', //^
            'Thailand', 'Thai', 'Prathet Thai', 'Ratcha-anachak Thai', 'ไทย', 'ประเทศไทย', 'าชอาณาจักรไทย', 'TH', 'THAI',
            'Bangkok', 'Krung Thep', 'Krung Thep Maha Nakhon', 'กรุงเทพฯ', 'กรุงเทพมหานคร', //^ capital
            'Vietnam', 'Việt Nam', 'VN', 'VNM',
            'Hanoi', 'Hà Nội', //^ capital
            'Ho Chi Minh', //^ major city
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
            'Western Australia', 'WA', //^ state
            'Perth', //^ state capital (WA)
            'Brunei', 'بروني', 'BN', 'BRN',
            'Bandar Seri Begawan', 'Bandar', 'باندر سري بڬاون', //^
            'China', 'Zhōngguó', 'Zhōnghuá Rénmín Gònghéguó', '中国', '中华人民共和国', 'PRC', 'People\'s Republic of China', 'CN', 'CHN',
            'Beijing', 'Běijīng', '北京', //^ capital
            'Hong Kong', 'Heung Gong', '香港', 'HK', 'HKG',
            'Indonesia', 'ID', 'IDN', //C
            'Bali',
            'Borneo',
            'Macau', 'Oumún', '澳門', 'Macau', 'MO', 'MAC',
            'Malaysia', 'MY', 'MYS',
            'Kuala Lumpur', //^ capital
            'Mongolia', 'Mongol Uls', 'Монгол Улс', 'ᠮᠤᠩᠭᠤᠯ ᠤᠯᠤᠰ', 'MN', 'MNG', //most of
            'Ulaanbaatar', 'Улаанбаатар', 'ᠤᠯᠠᠭᠠᠨᠪᠠᠭᠠᠲᠤᠷ', //^ capital
            'Philippines', 'Pilipinas', 'PH', 'PHL',
            'Manila', 'Maynila', //^ capital
            'Singapore', 'Singapura', 'Xīnjiāpō', '新加坡', 'Singapur', 'சிங்கப்பூர்', 'SG', 'SGP',
            'Taiwan', 'Republic of China', 'Zhōnghuá Mínguó', 'Táiwān', '中華民國', '臺灣', '台灣', 'TW', 'TWN',
            'Taipei', 'Táiběi', '臺北', '台北', //^ capital
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'IRKT', 'Irkutsk', //^
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
            '+0845',
            'ACWST',
            'Eucla'
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
            'Dili', 'Díli', //^ capital
            'Indonesia', 'ID', 'IDN', //E
            'Malaku',
            'Western New Guinea', 'Papua Niugini', 'Papua Niu Gini', 'PG', 'PNG',
            'Japan', 'Nihon', 'Nippon', '日本', 'JP', 'JPN',
            'Tokyo', '東京', 'とうきょう', 'toukyou', //^ capital
            'North Korea', 'Chosŏn', '조선', '朝鮮', 'Bukchosŏn', '북조선', 'KP', 'PRK',
            'Pyongyang', 'P\'yŏngyang', '평양', '平壌', //^ capital
            'South Korea', 'Hanguk', '한국', '韓國', 'Namhan', '남한', 'KR', 'KOR',
            'Seoul', '서울', //^ capital
            'Palau', 'Belau', 'PW', 'PLW',
            'Ngerulmud', //^ capital
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'YAKT', 'Yakutsk', //^
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
            'Northern Territory', 'NT', //^ territory
            'Darwin', //^ territory capital (NT)
            'South Australia', 'SA', //^ state
            'Adelaide', //^ state capital (SA)
            'Broken Hill', //^ NSW
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
            'Australian Capital Territory', 'ACT', //^ territory
            'Canberra', //^ capital 
            'New South Wales', 'NSW', //^ state
            'Sydney', //^ state capital (NSW)
            'Queensland', 'QLD', //^ state
            'Brisbane', //^ state capital (QLD)
            'Gold Coast', //^ major city
            'Tasmania', 'TAS', //^ state
            'Hobart', //^ state capital (TAS)
            'Victoria', 'VIC', //^ state
            'Melbourne', //^ state capital (VIC)
            'Federated States of Micronesia', 'Micronesia', 'FM', 'FSM',
            'Chuuk',
            'Yap',
            'Guam', 'Guåhån', 'GU', ' GUM',
            'Hagatna', 'Agana', 'Hagåtña', 'Agaña', //^ capital
            'Northern Mariana Islands', 'Notte Mariånas', 'MP', 'MNP',
            'Saipan', //^ capital
            'Papua New Guinea', 'Papua Niugini', 'Papua Niu Gini',
            'Port Moresby', 'Pot Mosbi', //^ capital
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'VLAT', 'Vladivostok', //^
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
            'ACDT',
            'Lord Howe Island',
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
            'Norfolk Island', ' Norf\'k Ailen', //^
            'Kingston', //^ capital
            'Federated States of Micronesia', 'Micronesia', 'FM', 'FSM',
            'Palikir', //^ capital
            'Kosrae',
            'Pohnpei',
            'New Caledonia', 'Nouvelle-Calédonie', 'NC', 'NCL',
            'Noumea', 'Nouméa', //^ capital
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'MAGT', 'Magadan', //^
            'Solomon Islands', 'Solomon Aelan', 'SB', 'SLB',
            'Honiara', 'Honiala', //^ capital
            'Vanuatu', 'VU', 'VUT',
            'Port Vila', 'Port-Vila', //^ capital
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
            'Suva', //^ capital
            'Kiribati', 'KI', 'KIR',
            'Tarawa', //^ capital
            'Gilbert Islands',
            'Marshall Islands', 'Aorōkin Ṃajeḷ', 'MH', 'MHL',
            'Majuro', 'Mājro', //^ capital
            'Nauru', 'Naoero', 'NR', 'NRU',
            'Yaren', //^ capital
            'New Zealand', 'Aotearoa', 'NZ', 'NZL',
            'Wellington', 'Ponoeke', 'Te Whanganui-a-Tara', //^ capital
            'Auckland', //^ major city
            'Russia', 'Rossiya', 'Rossiâ', 'Россия',
            'PETT', 'Kamchatka', //^
            'South Pole',
            'Tuvalu', 'TV', 'TUV',
            'Fungafale', //^ capital
            'Wake Island',
            'Wallis and Futuna', 'WF', 'WLF',
            'Mata Utu', 'Matāʻutu' //^ capital
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
            'Apia', //^ capital
            'New Zealand',
            'Tokelau', 'TK', 'TKL',
            'Tonga', 'TO', 'TON',
            'Nukuʻalofa', //^ capital
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
/**
 * australia -> vic,nsw,tas,sa, lord howe isl. 
 * nz
 * namibia, egypt, morocco
 * eu excl. russia and belarus
 * syria, iran
 * most of USA, most of canada, mexico, some caribbean isles
 * parts of brazil, chile,  paraguay
 */
export const hasDaylight: {
    start: string,
    end: string,
    check: (date: Date) => boolean,
    includes: string[],
}[] = [
        //template 
        // {
        //     start: 'x Sunday in March',
        //     end: 'x Sunday in October',
        //     includes: [],
        //     check: ((date) => {
        //         if (true) {
        //             return true;
        //         }
        //         return false;
        //     })
        // },
        //southern hemisphere
        {
            start: 'First Sunday in October',
            end: 'First Sunday in April',
            includes: [
                'Australian Capital Territory', 'ACT', //^ territory
                'Canberra', //^ capital 
                'Victoria', 'VIC',
                'Melbourne', //^
                'New South Wales', 'NSW',
                'Sydney', //^
                'Tasmania', 'TAS',
                'Hobart', //^
                'South Australia', 'SA',
                'Adelaide',
                'Lord Howe Island',
                'Norfolk Island', ' Norf\'k Ailen', //^
                'Kingston', //^ capital
            ],
            check: ((date) => {
                if (isPastDayOfWeek(date, 0) && isDateBetweenMonths(date, 10, 4)) {
                    if (date.getMonth() == 10 && isPastDayOfWeek(date, 0)) {
                        return true;
                    } else if (date.getMonth() == 4 && isLastDayOfWeekMonth(date, 0)) {
                        return true;
                    } else if (date.getMonth() !== 10 && date.getMonth() !== 4) {
                        return true;
                    }
                }
                return false;
            })
        },
        {
            start: 'Last Sunday in October',
            end: 'First Sunday in March',
            includes: [
                'Paraguay', 'Paraguái', 'PY', 'PRY',
                'Asuncion', 'Asunción', //^ capital
            ],
            check: ((date) => {
                if (isDateBetweenMonths(date, 10, 4)) {
                    if (date.getMonth() == 10 && isPastDayOfWeek(date, 0)) {
                        return true;
                    } else if (date.getMonth() == 4 && isLastDayOfWeekMonth(date, 0)) {
                        return true;
                    } else if (date.getMonth() !== 10 && date.getMonth() !== 4) {
                        return true;
                    }
                }
                return false;
            })
        },
        {
            start: 'First Sunday in October',
            end: 'Last Sunday in March',
            includes: [
                'New Zealand', 'Aotearoa', 'NZ', 'NZL',
                'Wellington', 'Ponoeke', 'Te Whanganui-a-Tara', //^ capital
                'Auckland', //^ major city
                'Chatham Islands',
                'Tokelau', 'TK', 'TKL',
            ],
            check: ((date) => {
                if (isDateBetweenMonths(date, 10, 3)) {
                    if (date.getMonth() == 10 && isPastDayOfWeek(date, 0)) {
                        return true;
                    } else if (date.getMonth() == 3 && isLastDayOfWeekMonth(date, 0)) {
                        return true;
                    } else if (date.getMonth() !== 10 && date.getMonth() !== 3) {
                        return true;
                    }
                }
                return false;
            })
        },
        // northern hemisphere
        {
            start: 'Last Sunday in March',
            end: 'Last Sunday in October',
            includes: [
                'Aland', 'Åland', 'Ahvenanmaa', //^ (autonomous region)
                'Mariehamn', 'Maarianhamina', //^ capital
                'Albania', 'Shqipëria', 'Shqiperia', 'AL', 'ALB',
                'Tirana', //^ capital
                'Andorra', 'AD', 'AND',
                'Andorra la Vella', //^ capital
                'Austria', 'Österreich', 'Osterreich', 'AT', 'AUT',
                'Vienna', 'Wien', //^ capital
                'Belgium', 'België', 'Belgique', 'Belgien', 'BE', 'BEL',
                'Brussels', 'Bruxelles', 'Brüssel', //^ capital
                'Bosnia And Herzegovina', 'Bosnia', 'Herzegovina', 'Bosna i Hercegovina', 'Босна и Херцеговина', 'BA', 'BIH',
                'Sarajevo', 'Сарајево', //^ capital
                'Bulgaria', 'Bălgariya', 'Bălgarija', 'България', 'BG', 'BGR',
                'Sofia', 'Sofiya', 'Sofija', 'София', //^ capital
                'Croatia', 'Hrvatska', 'HR', 'HRV',
                'Zagreb', //^ capital
                'Czech Republic', 'Česká republika', 'Česko', 'CZ', 'CZE',
                'Prague', 'Praha', //^ capital
                'Denmark', 'Danmark', 'DK', 'DNK',
                'Copenhagen', 'København', //^ capital
                'Estonia', 'Eesti', 'EE', 'EST',
                'Tallinn', //^ capital
                'Faroe Islands', 'Føroyar', 'Færøerne', 'FO', 'FRO',
                'Torshavn', 'Thorshavn', 'Tórshavn', //^ capital
                'Finland', 'Suomi', 'FI', 'FIN',
                'Helsinki', 'Helsingfors', //^ capital
                'France', 'FR', 'FRA',
                'Paris', //^ capital
                'Germany', 'Deutschland', 'DE', 'DEU',
                'Berlin', //^ capital
                'Gibraltar', 'GI', 'GIB',
                'Greece', 'Hellas', 'Ellada', 'Ελλάς', 'Ελλάδα', 'GR', 'GRC',
                'Athens', 'Athinai', 'Athina', 'Αθήναι', 'Αθήνα',
                'Ittoqqortoormiit', //greenland
                'Guernsey', 'GG', 'GGY',
                'Saint Peter Port', //^ capital
                'Hungary', 'Magyarország', 'HU', 'HUN',
                'Budapest', //^ capital
                'Ireland', 'Éire', 'IE', 'IRL',
                'Dublin', 'Baile Átha Cliath', //^ capital
                'Isle of Man', 'Ellan Vannin', 'IM', 'IMN',
                'Douglas', 'Doolish', //^ capital
                'Italy', 'Italia', 'IT', 'ITA',
                'Jersey', 'Jèrri', 'JE', 'JEY',
                'St. Helier', 'Saint Hélier', 'Saint Hélyi', //^ capital
                'Kosovo', 'Косово', 'Kosova', 'XK', 'XKX',
                'Pristina', 'Prishtinë', 'Priština', 'Приштина', //^ capital
                'Latvia', 'Latvija', 'LV', 'LVA',
                'Riga', 'Rīga', //^ capital
                'Liechtenstein', 'LI', 'LIE',
                'Vaduz', //^ capital
                'Lithuania', 'Lietuva', 'LT', 'LTU',
                'Vilnius', //^ capital
                'Luxembourg', 'Lëtzebuerg', 'Luxemburg', 'LU', 'LUX',
                'Malta', 'MT', 'MLT',
                'Valletta', 'Il-Belt Valletta', //^ capital
                'Moldova', 'MD', 'MDA',
                'Chisinau', 'Chișinău', //^ capital
                'Monaco', 'Múnegu', 'MC', 'MCO',
                'Montenegro', 'Crna Gora', 'Црна Гора', 'ME', 'MNE',
                'Podgorica', 'Подгорица', //^ capital
                'Netherlands', 'Nederland', 'Nederlân', 'NL', 'NLD',
                'Amsterdam', //^ capital
                'North Macedonia', 'Severna Makedonija', 'Северна Македонија', 'Maqedonia e Veriut', 'MK', 'MKD',
                'Skopje', 'Скопје', 'Shkup', //^ capital
                'Norway', 'Norge', 'Noreg', 'Norga', 'Vuodna', 'Nöörje', 'NO', 'NOR',
                'Oslo', //^ capital
                'Poland', 'Polska', 'PL', 'POL',
                'Warsaw', 'Warszawa', //^ capital
                'Portugal', 'PT', 'PRT',
                'Lisbon', 'Lisboa', //^ capital
                'Romania', 'România', 'RO', 'ROU',
                'Bucharest', 'București', //^ capital
                'San Marino', 'SM', 'SMR',
                'Serbia', 'Srbija', 'Србија', 'RS', 'SRB',
                'Belgrade', 'Beograd', 'Београд', //^ capital
                'Slovakia', 'Slovensko', 'SK', 'SVK',
                'Philipsburg', //^ capital
                'Slovenia', 'Slovenija', 'SI', 'SVN',
                'Ljubljana', //^ capital
                'Spain', 'España', 'Espanya', 'Espainia', 'Espanha', 'ES', 'ESP',
                'Madrid', 'Madril', //^ capital
                'Sweden', 'Sverige', 'SZ', 'SWZ',
                'Stockholm', //^ capital
                'Switzerland', 'Schweiz', 'Suisse', 'Svizzera', 'Svizra', 'SE', 'SWE',
                'Bern', 'Berne', 'Berna', //^ capital
                'Ukraine', 'Ukrajina', 'Україна', 'UA', 'UKR',
                'Kyiv', 'Kyjiv', 'Київ', //^ capital
                'United Kingdom', 'UK', 'U.K.', 'Britain', 'Great Britain', 'Y Deyrnas Unedig', 'Unitit Kinrick', 'Rìoghachd Aonaichte', 'Ríocht Aontaithe', 'An Rywvaneth Unys', 'GB', 'GBR',
                'London', 'Llundain', 'Lunnon', 'Lunnainn', 'Londain', 'Loundres', //^ capital
                'England', //^ 
                'Scotland', //^ 
                'Wales', //^ 
                'Vatican City', 'Civitas Vaticana', 'Città del Vaticano', 'Holy See', 'VA', 'VAT',
                'WET',
                'GMT',
                'CET',
                'EET',
                'MSK'
            ],
            check: ((date) => {
                if (isLastDayOfWeekMonth(date, 0) && isDateBetweenMonths(date, 3, 10)) {
                    return true;
                }
                return false;
            })
        },
        {
            start: 'Second Sunday in March',
            end: 'First Sunday in November',
            includes: [
                'Bermuda', 'BM', 'BMU',
                'Hamilton', //^ capital
                'British Columbia', //^ province/territory //most of
                'Victoria', //^ province/territory capital
                'Vancouver', //^ major city
                'Edmonton', //^ province/territory capital
                'Calgary', //^ major city
                'British Columbia (Eastern)',//^ province/territory
                'Lloydminster',//^ 
                'Manitoba',//^ province/territory
                'Winnipeg', //^ province/territory capital
                'Saskatoom', //^ major city
                'Northwest Territories', //^
                'Ontario', //^ provincce //NW
                'Ottawa', //^ capital
                'Nunavut',//^ 
                'Ontario', //^ //most of
                'Toronto', //^ province/territory capital
                'Quebec', //^ province/territory //most of
                'Quebec City', //^ province/territory capital
                'Montreal', //^ major city
                'Labrador',//^
                'New Brunswick',//^ province/territory
                'Fredericton', //^ province/territory capital
                'Moncton', //^ major city
                'Nova Scotia',//^ province/territory
                'Halifax', //^ province/territory capital
                'Prince Edward Island',//^ province/territory
                'Charlottetown', //^ province/territory capital
                'Quebec', //^ province/territory //E
                'Newfoundland and Labrador', 'Newfoundland',
                'St. John\'s', //^ province/territory capital
                'Cuba', 'CU', 'CUB',
                'Havana', 'La Habana', //^ capital
                'Thule Air Base',
                'Haiti', 'Haïti', 'Ayiti', 'HT', 'HTI',
                'Port-au-Prince', 'Pòtoprens', //^ capital
                'Baja California Norte', 'Baja California',//^ 
                'Chihuahua',//^ 
                'Tamaulipas', //^
                'Nuevo León', 'Nuevo Leon', //^
                'Saint Pierre and Miquelon', 'PM', 'SPM',
                'Saint-Pierre', 'Saint Pierre', //^ capital
                'The Bahamas', 'Bahamas', 'BS', 'BHS',
                'Nassau', //^ capital
                'Turks and Caicos Islands', 'TC', 'TCA',
                'Cockburn Town', //^ capital
                'USA', 'US', 'United States of America', 'America', 'Estados Unidos', 'États-Unis', '‘Amelika Hui Pū ‘ia',
                'Aleutian Islands',
                'Adak', //^ capital
                'Alaska', //^ state
                'Juneau', //^ state capital
                'Washington',//^ state
                'Olympia', //^ state capital
                'Idaho (Northern)', //^ state //north
                'Oregon',//^ state
                'Salem', //^ state capital
                'California',//^ state
                'Sacramento', //^ state capital
                'Los Angeles', //^ major city
                'San Francisco', //^ major city
                'Silicon Valley', //^ part of san francisco
                'Nevada', //^ state
                'Carson City', //^ state capital
                'Las Vegas', //^ major city
                'North Dakota (SW)', //^state //SW
                'South Dakota (Western)', //^state //W
                'Nebraska (Western)', //^ state//W
                'Kansas (Sherman, Wallace, Greeley and Hamilton)', //^ state//small bit
                'Montana',//^ state
                'Helena', //^ state capital
                'Oregon (Malheur County)', //^ state//small bit
                'Idaho (Southern)', //^state //southern
                'Boise', //^ state capital
                'Wyoming',//^ state
                'Cheyenne', //^ state capital
                'Utah',//^ state
                'Salt Lake', 'Salt Lake City', //^ state capital
                'Colorado',//^ state
                'Denver', //^ state capital
                'New Mexico',//^ state
                'Santa Fe', //^ state capital
                'Albuquerque', //^ major city
                'Texas (El Paso and Hudspeth)', //^ state //El Paso area
                'Wisconsin',//^ state
                'Madison', //^ state capital
                'Illinois',//^ state
                'Springfield', //^ state capital
                'Indiana (Western Corners)', //^ state//SW and NW corners
                'Kentucky (Western)',//^  state//W
                'Tennessee',//^  state//W and central
                'Mississippi',//^ state
                'Jackson', //^ state capital
                'Alabama',//^ state
                'Montgomery', //^ state capital
                'Minnesota',//^ state
                'Saint Paul', //^ state capital
                'Iowa',//^ state
                'Des Moines', //^ state capital
                'Missouri',//^ state
                'Jefferson City', //^ state capital
                'Arkansas',//^ state
                'Little Rock', //^ state capital
                'Louisiana',//^ state
                'Baton Rouge', //^ state capital
                'North Dakota',//^  state//N and E
                'Bismark', //^ state capital
                'South Dakota',//^state //E
                'Pierre', //^ state capital 
                'Nebraska', //^ state//E and central
                'Lincoln', //^ state capital
                'Kansas',//^ state //most of
                'Topeka', //^ state capital
                'Oklahoma',//^ state
                'Oklahoma City', //^ state capital
                'Texas', //^ state//most of
                'Austin', //^ state capital
                'Houston', //^ major city
                'Florida (Pan Handle)', //^ state //W
                'Maine',//^ state 
                'Augusta', //^ state capital
                'New Hampshire',//^ state 
                'Concord', //^ state capital
                'Vermont',//^ state 
                'Montpelier', //^ state capital
                'New York', //^ state 
                'Albany', //^ state capital
                'NYC', 'New York City', //^ major city
                'Massachusetts',//^ state 
                'Boston', //^ state capital
                'Connecticut',//^ state 
                'Hartford', //^ state capital
                'Rhode Island',//^ state 
                'Providence', //^ state capital
                'Michigan', //^state  //excl. few north west
                'Michigan (Gogebic, Iron, Dickinson, and Menominee)', //^ state (W)
                'Lansing', //^ state capital  
                'Indiana', //^ state //excl. NW and SW corners
                'Indianapolis', //^ state capital            
                'Ohio',//^ state 
                'Columbus', //^ state capital
                'Pennsylvania',//^ state 
                'Harrisburg', //^ state capital
                'New Jersey',//^ state
                'Trenton', //^ state capital
                'Kentucky', //^state //E
                'Frankfort', //^ state capital
                'West Virginia',//^ state
                'Charleston', //^ state capital
                'Virginia',//^ state
                'Richmond', //^ state capital
                'Washington D.C.', 'Washington, D.C.', 'Washington DC',//^ capital
                'Maryland',//^ state
                'Annapolis', //^ state capital
                'Delaware',//^ state
                'Dover', //^ state capital
                'Tennessee (Eastern)', //^state //E
                'Nashville', //^ state capital
                'North Carolina',//^ state
                'Raleigh', //^ state capital
                'Georgia',//^ state
                'Atlanta', //^ state capital
                'South Carolina',//^ state
                'Columbia', //^ state capital
                'Florida',//^ state //excl. W panhandle
                'Tallahassee', //^ state capital
                'Miami', //^ major city
                'AKST',
                'PST',
                'PT',
                'MST',
                'MT',
                'CST',
                'CT',
                'EST',
                'ET',
            ],
            check: ((date) => {
                if (isDateBetweenMonths(date, 4, 11)) {
                    if (date.getMonth() == 10 && isPastDayOfWeek(date, 0)) {
                        return true;
                    } else if (date.getMonth() == 4 && isDateBeforeOrAfterNthDayOfWeek(date, 0, 2, "before")) {
                        return true;
                    } else if (date.getMonth() !== 11 && date.getMonth() !== 4) {
                        return true;
                    }
                }
                return false;
            })
        },
        {
            start: 'Last Saturday in April',
            end: 'Last Saturday in October',
            includes: [
                'Palestine', 'Filasṭīn', 'فلسطين', 'PS', 'PSE',
                'East Jerusalem', 'Al-Quds Al-Sharqit', 'القدس الشرقية', //^ declared capital
                'Ramallah', 'Rāmallāh', 'رام الله', //^ administrative capital
            ],
            check: ((date) => {
                if (isDateBetweenMonths(date, 4, 10) && isLastDayOfWeekMonth(date, 6)) {
                    return true;
                }
                return false;
            })
        },
        {
            start: 'Last Thursday in March',
            end: 'Last Sunday in October',
            includes: [
                'Lebanon', 'Lubnān', 'لبنان ', 'Liban', 'LB', 'LBN',
                'Beirut', 'Bayrut', 'Bayrūt', 'بيروت', 'Beyrouth', //^ capital
            ],
            check: ((date) => {
                if (isDateBetweenMonths(date, 3, 10)) {
                    if (date.getMonth() == 10 && isPastDayOfWeek(date, 0)) {
                        return true;
                    } else if (date.getMonth() == 3 && isLastDayOfWeekMonth(date, 0)) {
                        return true;
                    } else if (date.getMonth() !== 10 && date.getMonth() !== 3) {
                        return true;
                    }
                }
                return false;
            })
        },
    ];

export type dstCountry = {
    name: string,
    territories: string[];
};


//ordered by date start, date end
export const dstForList: {
    start: string,
    end: string,
    includes: (dstCountry| string)[],
}[] = [
        //template 
        // {
        //     start: 'x Sunday in March',
        //     end: 'x Sunday in October',
        //     includes: [],
        //     check: ((date) => {
        //         if (true) {
        //             return true;
        //         }
        //         return false;
        //     })
        // },
        // northern hemisphere
        {
            start: 'Second Sunday in March',
            end: 'First Sunday in November',
            includes: [
                'Bermuda',
                {
                    name: 'Canada',
                    territories: [
                        'British Columbia',
                        'Manitoba',
                        'Northwest Territories',
                        'Ontario (excl. NW)',
                        'Nunavut',
                        'Quebec (excl. E)',
                        'Labrador',
                        'Nova Scotia',
                        'Prince Edward Island',
                        'Newfoundland and Labrador', 'Newfoundland',
                    ]
                },
                'Cuba',
                'Haiti/Ayiti',
                {
                    name: 'Mexico',
                    territories: [
                        'Baja California',
                        'Chihuahua',
                        'Coahuila',
                        'Nuevo León',
                        'Tamaulipas',
                    ]
                },
                'Saint Pierre and Miquelon',
                'The Bahamas',
                'Turks and Caicos Islands',
                {
                    name: 'United States of America/USA',
                    territories: [
                        'Alabama',//^ state
                        'Alaska', //^ state
                        'Aleutian Islands',
                        'Arizona (NW)',
                        'Arkansas',//^ state
                        'California',//^ state
                        'Colorado',//^ state
                        'Connecticut',//^ state 
                        'Delaware',//^ state
                        'Florida',//^ state //excl. W panhandle
                        'Georgia',//^ state
                        'Idaho', //^ state 
                        'Illinois',//^ state
                        'Indiana', //^ state
                        'Iowa',//^ state
                        'Kansas',//^ state 
                        'Kentucky',//^  state
                        'Louisiana',//^ state
                        'Maine',//^ state 
                        'Maryland',//^ state
                        'Massachusetts',//^ state 
                        'Michigan', //^state
                        'Minnesota',//^ state
                        'Mississippi',//^ state
                        'Missouri',//^ state
                        'Montana',//^ state
                        'Nebraska', //^ state
                        'Nevada', //^ state
                        'New Hampshire',//^ state 
                        'New Jersey',//^ state
                        'New Mexico',//^ state
                        'New York', //^ state 
                        'North Carolina',//^ state
                        'North Dakota',//^  state
                        'Ohio',//^ state 
                        'Oklahoma',//^ state
                        'Oregon',//^ state
                        'Pennsylvania',//^ state 
                        'Rhode Island',//^ state 
                        'South Carolina',//^ state
                        'South Dakota',//^state //E
                        'Tennessee',//^  state//W and central
                        'Texas', //^ state//most of
                        'Utah',//^ state
                        'Vermont',//^ state 
                        'Virginia',//^ state
                        'Washington D.C.',
                        'Washington',//^ state
                        'West Virginia',//^ state
                        'Wisconsin',//^ state
                        'Wyoming',//^ state
                    ]
                },
            ],
        },
        {
            start: 'Last Thursday in March',
            end: 'Last Sunday in October',
            includes: [
                'Lebanon/لبنان ', 
            ],
        },
        {
            start: 'Last Sunday in March',
            end: 'Last Sunday in October',
            includes: [
                'Aland Islands/Åland Islands/Ahvenanmaa',
                'Albania/Shqipëria',
                'Andorra',
                'Austria/Österreich',
                'Belgium/België/Belgique/Belgien',
                'Bosnia And Herzegovina/Босна и Херцеговина',
                'Bulgaria/България',
                'Croatia/Hrvatska',
                'Czechia/Czech Republic/Česká republika/Česko',
                'Denmark/Danmark',
                'Estonia/Eesti',
                'Faroe Islands/Føroyar/Færøerne',
                'Finland/Suomi',
                'France',
                'Germany/Deutschland',
                'Greece/Ελλάς/Ελλάδα',
                'Guernsey',
                'Hungary/Magyarország',
                'Ireland/Éire',
                'Isle of Man/Ellan Vannin',
                'Italy/Italia',
                'Jersey/Jèrri',
                'Kosovo/Косово',
                'Latvia/Latvija',
                'Liechtenstein',
                'Lithuania/Lietuva',
                'Luxembourg/Lëtzebuerg/Luxemburg',
                'Malta',
                'Moldova',
                'Monaco/Múnegu',
                'Montenegro/Црна Гора',
                'Netherlands/Nederland/Nederlân',
                'North Macedonia/Северна Македонија',
                'Norway/Norge/Noreg',
                'Poland/Polska',
                'Portugal',
                'Romania/România',
                'San Marino',
                'Serbia/Србија',
                'Slovakia/Slovensko',
                'Slovenia/Slovenija',
                'Spain/España',
                'Sweden/Sverige',
                'Switzerland/Schweiz/Suisse/Svizra',
                'Ukraine/Україна',
                'United Kingdom/UK',
                'Vatican City/Holy See/Città del Vaticano',
            ],
        },
        {
            start: 'Last Saturday in April',
            end: 'Last Saturday in October',
            includes: [
                'Palestine/فلسطين',
            ],
        },
        //southern hemisphere
        {
            start: 'First Sunday in October',
            end: 'Last Sunday in March',
            includes: [
                'New Zealand/Aotearoa',
                'Tokelau'
            ],
        },
        {
            start: 'First Sunday in October',
            end: 'First Sunday in April',
            includes: [
                {
                    name: 'Australia',
                    territories: [
                        'Australian Capital Territory (ACT)',
                        'Victoria (VIC)',
                        'New South Wales (NSW)',
                        'Tasmania (TAS)',
                        'Lord Howe Island',
                        'Norfolk Island/Norf\'k Ailen',
                    ]
                }
            ],
        },
        {
            start: 'Last Sunday in October',
            end: 'First Sunday in March',
            includes: [
                'Paraguay/Paraguái'
            ],
        },
    ];

//thanks chat gpt
/**
 * 
 * @param date cur date
 * @param targetWeekday 0 = sun, 1 = mon etc.
 * @returns 
 */
function isPastDayOfWeek(date: Date, targetWeekday: number) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysToAdd = (targetWeekday - firstDayWeekday + 7) % 7;
    const targetDate = new Date(date.getFullYear(), date.getMonth(), 1 + daysToAdd);
    return date > targetDate;
}

function isLastDayOfWeekMonth(date: Date, targetWeekday: number) {
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const lastDayWeekday = lastDayOfMonth.getDay(); // Sunday=0, Monday=1, ..., Saturday=6

    return lastDayWeekday === targetWeekday && date.getDate() === lastDayOfMonth.getDate();
}

function isDateBeforeOrAfterNthDayOfWeek(date: Date, targetWeekday: number, nthOccurrence: number, comparison: "before" | "after") {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const daysToAdd = (targetWeekday - firstDayOfMonth.getDay() + 7) % 7 + (nthOccurrence - 1) * 7;

    const targetDate = new Date(date.getFullYear(), date.getMonth(), 1 + daysToAdd);

    if (comparison === "before") {
        return date < targetDate;
    } else if (comparison === "after") {
        return date > targetDate;
    } else {
        throw new Error("Invalid comparison type. Use 'before' or 'after'.");
    }
}

/**
 *  january = 1
 */
function isDateBetweenMonths(date: Date, startMonth: number, endMonth: number) {
    const inputMonth = date.getMonth() + 1;
    if (startMonth <= endMonth) {
        return startMonth <= inputMonth && inputMonth <= endMonth;
    } else {
        return inputMonth >= startMonth || inputMonth <= endMonth;
    }
}