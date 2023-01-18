export type timezone = {
    offsetDirection: '+' | '-';
    offsetHours: number,
    aliases: string[];
};

export const timezones: timezone[] = [
    {
        offsetDirection: '-',
        offsetHours: 12,
        aliases: [
            'UTC-12:00',
            'UTC-12',
            'GMT-12',
            'GMT-12:00',
            '-12'
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
            'Pacific/Midway',
            'Midway Islands',
            'Pacific/Niue',
            'Niue',
            'Pacific/Samoa',
            'US/Samoa',
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
            'America/Adak',
            'Aleutian Islands',
            'America/Atka',
            'Pacific/Honolulu',
            'Hawaii'
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
            'AKST'
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
            'PST'
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
            'MST'
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
            'MDT'
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
            'EST'
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
            'AST'
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
            'NST'
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
            'ADT'
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
            'NDT'
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
            '-02'
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
            '-01'
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
            'WET'
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
            'IST'
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
            'IST'
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
            'MSK'
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
            '+04'
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
            '+0430'
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
            'PKT'
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
            'IST'
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
            '+06'
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
            '+0630'
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
            'JST'
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
            'ACST'
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
            'Brisbane',
            'Sydney',
            'Melbourne',
            'Hobart',
            'ChST'
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
            'AEDT'
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
            'NZST'
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
            'NZDT'
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
            '+14'
        ]
    },
];
