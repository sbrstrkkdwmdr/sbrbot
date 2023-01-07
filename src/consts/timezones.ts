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
            'UTC-12',
            'UTC-12:00',
            'GMT-12',
            'GMT-12:00',
            '-12'
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 11,
        aliases: [
            'UTC-11',
            'UTC-11:00',
            'GMT-11',
            'GMT-11:00',
            '-11',
            'SST'
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 10,
        aliases: [
            'UTC-10',
            'UTC-10:00',
            'GMT-10',
            'GMT-10:00',
            '-10',
            'HST'
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 9.5,
        aliases: [
            'UTC-0930',
            'UTC-09:30',
            'GMT-0930',
            'GMT-09:30',
            '-0930',
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 9,
        aliases: [
            'UTC-9',
            'UTC-09:00',
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
            'UTC-8',
            'UTC-08:00',
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
            'UTC-7',
            'UTC-07:00',
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
            'UTC-6',
            'UTC-06:00',
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
            'UTC-5',
            'UTC-05:00',
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
            'UTC-4',
            'UTC-04:00',
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
            'UTC-330',
            'UTC-03:30',
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
            'UTC-3',
            'UTC-03:00',
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
            'UTC-2',
            'UTC-02:00',
            'GMT-2',
            'GMT-02:00',
            '-0230',
            'NDT'
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 2,
        aliases: [
            'UTC-2',
            'UTC-02:00',
            'GMT-2',
            'GMT-02:00',
            '-02'
        ]
    },
    {
        offsetDirection: '-',
        offsetHours: 1,
        aliases: [
            'UTC-1',
            'UTC-01:00',
            'GMT-1',
            'GMT-01:00',
            '-01'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 0,
        aliases: [
            'UTC',
            'UTC-0',
            'UTC-00:00',
            'UTC+0',
            'UTC+00:00',
            'GMT',
            'GMT-0',
            'GMT-00:00',
            'GMT+0',
            'GMT+00:00',
            'WET'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 1,
        aliases: [
            'UTC+1',
            'UTC+01:00',
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
            'UTC+2',
            'UTC+02:00',
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
            'UTC+3',
            'UTC+03:00',
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
            'UTC+330',
            'UTC+03:30',
            'GMT+330',
            'GMT+03:30',
            '+0330',
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 4,
        aliases: [
            'UTC+4',
            'UTC+04:00',
            'GMT+4',
            'GMT+04:00',
            '+04'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 4.5,
        aliases: [
            'UTC+430',
            'UTC+04:30',
            'GMT+430',
            'GMT+04:30',
            '+0430'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 5,
        aliases: [
            'UTC+5',
            'UTC+05:00',
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
            'UTC+530',
            'UTC+05:30',
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
            'UTC+6',
            'UTC+06:00',
            'GMT+6',
            'GMT+06:00',
            '+06'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 6.5,
        aliases: [
            'UTC+630',
            'UTC+06:30',
            'GMT+630',
            'GMT+06:30',
            '+0630'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 7,
        aliases: [
            'UTC+7',
            'UTC+07:00',
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
            'UTC+8',
            'UTC+08:00',
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
            'UTC+845',
            'UTC+08:45',
            'GMT+845',
            'GMT+08:45',
            '+0845'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 9,
        aliases: [
            'UTC+9',
            'UTC+09:00',
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
            'UTC+930',
            'UTC+09:30',
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
            'UTC+10',
            'UTC+10:00',
            'GMT+10',
            'GMT+10:00',
            'AEST',
            'ChST'
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 10.5,
        aliases: [
            'UTC+1030',
            'UTC+10:30',
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
            'UTC+11',
            'UTC+11:00',
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
            'UTC+12',
            'UTC+12:00',
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
            'UTC+1245',
            'UTC+12:45',
            'GMT+1245',
            'GMT+12:45',
            '+1245',
        ]
    },
    {
        offsetDirection: '+',
        offsetHours: 13,
        aliases: [
            'UTC+13',
            'UTC+13:00',
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
            'UTC+14',
            'UTC+14:00',
            'GMT+14',
            'GMT+14:00',
            '+14'
        ]
    },
];