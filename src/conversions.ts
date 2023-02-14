type convVal = {
    name: string,
    names: string[],
    type: 'Temperature' | 'Distance' | 'Volume' | 'Time' | 'Mass' | 'Pressure',
    system: 'Metric' | 'Imperial' | 'N/A',
    calc: {
        to: string,
        names: string[];
        func: (x: number) => number,
        text: string;
    }[];
};

const template: convVal[] = [
    {
        name: 'eee',
        names: ['eee', 'EEE'],
        type: 'Distance',
        system: 'Metric',
        calc: [
            {
                to: 'eee',
                names: ['eee', 'EEE'],
                func: (x) => {
                    return (x);
                },
                text: 'xxx'
            }
        ]
    },
];

/**
 * measurements are converted to a base b4 converting to the actual result ie
 * temperature - celsius
 * distance - metres
 * time - seconds
 * volume - litres
 * mass - grams
 * pressure - pascals
 */
export const values: convVal[] = [
    // Temperature
    {
        name: 'Celsius',
        names: ['Celsius', 'Celcius', 'Centigrade', 'C'],
        type: 'Temperature',
        system: 'Metric',
        calc: [
            {
                to: 'Fahrenheit',
                names: ['Fahrenheit', 'F'],
                func: (x) => {
                    return x * 9 / 5 + 32;
                },
                text: 'x*9/5+32'
            },
            {
                to: 'Kelvin',
                names: ['Kelvin', 'K'],
                func: (x) => {
                    return x + 273.15;
                },
                text: 'x+273.15'
            }
        ]
    },
    {
        name: 'Fahrenheit',
        names: ['Fahrenheit', 'F'],
        type: 'Temperature',
        system: 'Imperial',
        calc: [
            {
                to: 'Celsius',
                names: ['Celsius', 'Celcius', 'Centigrade', 'C'],
                func: (x) => {
                    return (x - 32) * 5 / 9;
                },
                text: '((x)-32)*5/9'
            },
            {
                to: 'Kelvin',
                names: ['Kelvin', 'K'],
                func: (x) => {
                    return (x - 32) * 5 / 9 + 273.15;
                },
                text: '((x)-32)*5/9 + 273.15'
            }
        ]
    },
    {
        name: 'Kelvin',
        names: ['Kelvin', 'K'],
        type: 'Temperature',
        system: 'Metric',
        calc: [
            {
                to: 'Celsius',
                names: ['Celsius', 'Celcius', 'Centigrade', 'C'],
                func: (x) => {
                    return x - 273.15;
                },
                text: 'x-273.15'
            },
            {
                to: 'Fahrenheit',
                names: ['Fahreinheit', 'F'],
                func: (x) => {
                    return (x - 273.15) * 9 / 5 + 32;
                },
                text: '(x-273.15)*9/5+32'
            }
        ]
    },
    // Distance
    {
        name: 'Inch',
        names: ['Inch', 'in'],
        type: 'Distance',
        system: 'Imperial',
        calc: [
            {
                to: 'Inch',
                names: ['Inch', 'in'],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Feet',
                names: ['Feet', 'ft'],
                func: (x) => {
                    return x / 12;
                },
                text: 'x*12'
            },
            {
                to: 'Metre',
                names: ['Metre', 'm', 'Meter'],
                func: (x) => {
                    return x * 0.0254;
                },
                text: 'x*0.0254 '
            },
            {
                to: 'Mile',
                names: ['Mile', 'mi'],
                func: (x) => {
                    return x / 63360;
                },
                text: 'x/63360'
            },
            {
                to: 'Astronomical Unit',
                names: ['Astronomical Unit', 'in'],
                func: (x) => {
                    return x * 0.0254 / 149597870700;
                },
                text: 'x*0.0254/149597870700'
            },
            {
                to: 'Light Year',
                names: ['Light Year', 'LY'],
                func: (x) => {
                    return x * 0.0254 / 9460730472580800;
                },
                text: 'x*0.0254/9460730472580800'
            },
        ]
    },
    {
        name: 'Feet',
        names: ['Feet', 'ft'],
        type: 'Distance',
        system: 'Imperial',
        calc: [
            {
                to: 'Inch',
                names: ['Inch', 'in'],
                func: (x) => {
                    return x * 12;
                },
                text: 'x*12'
            },
            {
                to: 'Feet',
                names: ['Feet', 'ft'],
                func: (x) => {
                    return (x);
                },
                text: 'x'
            },
            {
                to: 'Metre',
                names: ['Metre', 'm', 'Meter'],
                func: (x) => {
                    return x * 0.3048;
                },
                text: 'x*0.3048'
            },
            {
                to: 'Mile',
                names: ['Mile', 'mi'],
                func: (x) => {
                    return x * 5280;
                },
                text: 'x/5280'
            },
            {
                to: 'Astronomical Unit',
                names: ['Astronomical Unit', 'in'],
                func: (x) => {
                    return x * 0.3048 / 149597870700;
                },
                text: 'x*0.3048/149597870700'
            },
            {
                to: 'Light Year',
                names: ['Light Year', 'LY'],
                func: (x) => {
                    return x * 0.3048 / 9460730472580800;
                },
                text: 'x*0.3048/9460730472580800'
            },
        ]
    },
    {
        name: 'Metre',
        names: ['Metre', 'm', 'Meter'],
        type: 'Distance',
        system: 'Metric',
        calc: [
            {
                to: 'Inch',
                names: ['Inch', 'in'],
                func: (x) => {
                    return x / 0.0254;
                },
                text: 'x/0.0254'
            },
            {
                to: 'Feet',
                names: ['Feet', 'ft'],
                func: (x) => {
                    return x / 0.3048;
                },
                text: 'x/0.3048'
            },
            {
                to: 'Mile',
                names: ['Mile', 'mi'],
                func: (x) => {
                    return x / 1609.344;
                },
                text: 'x/1609.344'
            },
            {
                to: 'Astronomical Unit',
                names: ['Astronomical Unit', 'in'],
                func: (x) => {
                    return x / 149597870700;
                },
                text: 'x/149597870700'
            },
            {
                to: 'Light Year',
                names: ['Light Year', 'LY'],
                func: (x) => {
                    return x / 9460730472580800;
                },
                text: 'x/9460730472580800'
            },
        ]
    },
    {
        name: 'Mile',
        names: ['Mile', 'mi'],
        type: 'Distance',
        system: 'Imperial',
        calc: [
            {
                to: 'Inch',
                names: ['Inch', 'in'],
                func: (x) => {
                    return x * 63360;
                },
                text: 'x*63360'
            },
            {
                to: 'Feet',
                names: ['Feet', 'ft'],
                func: (x) => {
                    return x * 5280;
                },
                text: 'x*5280'
            },
            {
                to: 'Metre',
                names: ['Metre', 'm', 'Meter'],
                func: (x) => {
                    return x * 1609.344;
                },
                text: 'x*1609.344'
            },
            {
                to: 'Astronomical Unit',
                names: ['Astronomical Unit', 'in'],
                func: (x) => {
                    return (x);
                },
                text: 'x*1609.344/149597870700'
            },
            {
                to: 'Light Year',
                names: ['Light Year', 'LY'],
                func: (x) => {
                    return (x);
                },
                text: 'x*1609.344/9460730472580800'
            },
        ]
    },
    {
        name: 'Astronomical Units',
        names: ['Astronomical Units', 'AU'],
        type: 'Distance',
        system: 'N/A',
        calc: [
            {
                to: 'Inch',
                names: ['Inch', 'in'],
                func: (x) => {
                    return x * 149597870700 / 0.0254;
                },
                text: 'x*149597870700/0.0254'
            },
            {
                to: 'Feet',
                names: ['Feet', 'ft'],
                func: (x) => {
                    return x * 149597870700 / 0.3048;
                },
                text: 'x*149597870700/0.3048'
            },
            {
                to: 'Metre',
                names: ['Metre', 'm', 'Meter'],
                func: (x) => {
                    return x * 149597870700;
                },
                text: 'x*149597870700'
            },
            {
                to: 'Mile',
                names: ['Mile', 'mi'],
                func: (x) => {
                    return x * 149597870700 / 1609.344;
                },
                text: 'x*149597870700/1609.344'
            },
            {
                to: 'Astronomical Unit',
                names: ['Astronomical Unit', 'in'],
                func: (x) => {
                    return (x);
                },
                text: 'x'
            },
            {
                to: 'Light Year',
                names: ['Light Year', 'LY'],
                func: (x) => {
                    return x * 149597870700 / 9460730472580800;
                },
                text: 'x*149597870700/9460730472580800'
            },
        ]
    },
    {
        name: 'LY',
        names: ['Light Years', 'LY'],
        type: 'Distance',
        system: 'N/A',
        calc: [
            {
                to: 'Inch',
                names: ['Inch', 'in'],
                func: (x) => {
                    return x * 9460730472580800 / 0.0254;
                },
                text: 'x*9460730472580800/0.0254'
            },
            {
                to: 'Feet',
                names: ['Feet', 'ft'],
                func: (x) => {
                    return x * 9460730472580800 / 0.3048;
                },
                text: 'x*9460730472580800/0.3048'
            },
            {
                to: 'Metre',
                names: ['Metre', 'm', 'Meter'],
                func: (x) => {
                    return x * 9460730472580800;
                },
                text: 'x*9460730472580800'
            },
            {
                to: 'Mile',
                names: ['Mile', 'mi'],
                func: (x) => {
                    return x * 9460730472580800 / 1609.344;
                },
                text: 'x*9460730472580800/1609.344'
            },
            {
                to: 'Astronomical Unit',
                names: ['Astronomical Unit', 'in'],
                func: (x) => {
                    return x * 9460730472580800 / 149597870700;
                },
                text: 'x*9460730472580800/149597870700'
            },
            {
                to: 'Light Year',
                names: ['Light Year', 'LY'],
                func: (x) => {
                    return (x);
                },
                text: 'x'
            },
        ]
    },
    // Time
    {
        name: 'Second',
        names: ['Second', 'sec', 's'],
        type: 'Time',
        system: 'Metric',
        calc: [
            {
                to: 'Second',
                names: ['Second', 'sec', 's'],
                func: (x) => {
                    return (x);
                },
                text: 'x'
            },
            {
                to: 'Minute',
                names: ['Minute', 'min',],
                func: (x) => {
                    return x / 60;
                },
                text: 'x/60'
            },
            {
                to: 'Hour',
                names: ['Hour', 'hr'],
                func: (x) => {
                    return x / 3600;
                },
                text: 'x/3600'
            },
            {
                to: 'Day',
                names: ['Day', 'd',],
                func: (x) => {
                    return x / 86400;
                },
                text: 'x/86400'
            },
            {
                to: 'Week',
                names: ['Week', 'wk',],
                func: (x) => {
                    return x / 604800;
                },
                text: 'x/604800'
            },
            {
                to: 'Month',
                names: ['Month', 'mth',],
                func: (x) => {
                    return x / 86400 / 30.437;
                },
                text: 'x/86400/30.437'
            },
            {
                to: 'Year',
                names: ['Year', 'yr',],
                func: (x) => {
                    return x / 86400 / 365.25;
                },
                text: 'x/86400/365.25'
            },
        ]
    },
    {
        name: 'Minute',
        names: ['Minute', 'min'],
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: ['Second', 'sec', 's'],
                func: (x) => {
                    return x * 60;
                },
                text: 'x*60'
            },
            {
                to: 'Minute',
                names: ['Minute', 'min'],
                func: (x) => {
                    return (x);
                },
                text: 'x'
            },
            {
                to: 'Hour',
                names: ['Hour', 'hr'],
                func: (x) => {
                    return x / 60;
                },
                text: 'x/60'
            },
            {
                to: 'Day',
                names: ['Day', 'd'],
                func: (x) => {
                    return x / 1440;
                },
                text: 'x/1440'
            },
            {
                to: 'Week',
                names: ['Week', 'wk',],
                func: (x) => {
                    return x / 10080;
                },
                text: 'x/10080'
            },
            {
                to: 'Month',
                names: ['Month', 'mth'],
                func: (x) => {
                    return x / 1440 / 30.437;
                },
                text: 'x/1440/30.437'
            },
            {
                to: 'Year',
                names: ['Year', 'yr'],
                func: (x) => {
                    return x / 1440 / 365.25;
                },
                text: 'x/1440/365.25'
            },
        ]
    },
    {
        name: 'Hour',
        names: ['Hour', 'hr'],
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: ['Second', 'sec', 's'],
                func: (x) => {
                    return x * 3600;
                },
                text: 'x*3600'
            },
            {
                to: 'Minute',
                names: ['Minute', 'min',],
                func: (x) => {
                    return x * 60;
                },
                text: 'x*60'
            },
            {
                to: 'Hour',
                names: ['Hour', 'hr'],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Day',
                names: ['Day', 'd',],
                func: (x) => {
                    return x / 24;
                },
                text: 'x/24'
            },
            {
                to: 'Week',
                names: ['Week', 'wk',],
                func: (x) => {
                    return x / 168;
                },
                text: 'x/168'
            },
            {
                to: 'Month',
                names: ['Month', 'mth',],
                func: (x) => {
                    return x / 730.0008;
                },
                text: 'x/730.0008'
            },
            {
                to: 'Year',
                names: ['Year', 'yr',],
                func: (x) => {
                    return x / 8766;
                },
                text: 'x/8766'
            },
        ]
    },
    {
        name: 'Day',
        names: ['Day', 'd'],
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: ['Second', 'sec', 's'],
                func: (x) => {
                    return x * 86400;
                },
                text: 'x*86400'
            },
            {
                to: 'Minute',
                names: ['Minute', 'min',],
                func: (x) => {
                    return x * 1440;
                },
                text: 'x*1440'
            },
            {
                to: 'Hour',
                names: ['Hour', 'hr'],
                func: (x) => {
                    return x * 24;
                },
                text: 'x*24'
            },
            {
                to: 'Day',
                names: ['Day', 'd',],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Week',
                names: ['Week', 'wk',],
                func: (x) => {
                    return x / 7;
                },
                text: 'x/7'
            },
            {
                to: 'Month',
                names: ['Month', 'mth',],
                func: (x) => {
                    return x / 30.4167;
                },
                text: 'x/30.4167'
            },
            {
                to: 'Year',
                names: ['Year', 'yr',],
                func: (x) => {
                    return x / 365.25;
                },
                text: 'x/365.25'
            },
        ]
    },
    {
        name: 'Week',
        names: ['Week', 'wk'],
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: ['Second', 'sec', 's'],
                func: (x) => {
                    return x * 604800;
                },
                text: 'x*604800'
            },
            {
                to: 'Minute',
                names: ['Minute', 'min',],
                func: (x) => {
                    return x * 10080;
                },
                text: 'x*10080'
            },
            {
                to: 'Hour',
                names: ['Hour', 'hr'],
                func: (x) => {
                    return x * 168;
                },
                text: 'x*168'
            },
            {
                to: 'Day',
                names: ['Day', 'd',],
                func: (x) => {
                    return x * 7;
                },
                text: 'x*7'
            },
            {
                to: 'Week',
                names: ['Week', 'wk',],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Month',
                names: ['Month', 'mth',],
                func: (x) => {
                    return x / 4.34524;
                },
                text: 'x/4.34524'
            },
            {
                to: 'Year',
                names: ['Year', 'yr',],
                func: (x) => {
                    return x / 52.1785714286;
                },
                text: 'x/52.1785714286'
            },
        ]
    },
    {
        name: 'Month',
        names: ['Month', 'mth'],
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: ['Second', 'sec', 's'],
                func: (x) => {
                    return x * 2628002.88;
                },
                text: 'x*2628002.88'
            },
            {
                to: 'Minute',
                names: ['Minute', 'min',],
                func: (x) => {
                    return x * 43800.048;
                },
                text: 'x*43800.048'
            },
            {
                to: 'Hour',
                names: ['Hour', 'hr'],
                func: (x) => {
                    return x * 730.0008;
                },
                text: 'x*730.0008'
            },
            {
                to: 'Day',
                names: ['Day', 'd',],
                func: (x) => {
                    return x * 30.4167;
                },
                text: 'x*30.4167'
            },
            {
                to: 'Week',
                names: ['Week', 'wk',],
                func: (x) => {
                    return x * 4.34524;
                },
                text: 'x*4.34524'
            },
            {
                to: 'Month',
                names: ['Month', 'mth',],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Year',
                names: ['Year', 'yr',],
                func: (x) => {
                    return x / 12;
                },
                text: 'x/12'
            },
        ]
    },
    {
        name: 'Year',
        names: ['Year', 'yr'],
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: ['Second', 'sec', 's'],
                func: (x) => {
                    return x * 31557600;
                },
                text: 'x*31557600'
            },
            {
                to: 'Minute',
                names: ['Minute', 'min',],
                func: (x) => {
                    return x * 525960;
                },
                text: 'x*525960'
            },
            {
                to: 'Hour',
                names: ['Hour', 'hr'],
                func: (x) => {
                    return x * 8766;
                },
                text: 'x*8766'
            },
            {
                to: 'Day',
                names: ['Day', 'd',],
                func: (x) => {
                    return x * 365.25;
                },
                text: 'x*365.25'
            },
            {
                to: 'Week',
                names: ['Week', 'wk',],
                func: (x) => {
                    return x * 52.1785714286;
                },
                text: 'x*52.1785714286'
            },
            {
                to: 'Month',
                names: ['Month', 'mth',],
                func: (x) => {
                    return x * 12;
                },
                text: 'x*12'
            },
            {
                to: 'Year',
                names: ['Year', 'yr',],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
        ]
    },
    // Volume
    {
        name: 'Fluid Ounces',
        names: ['eee', 'EEE'],
        type: 'Volume',
        system: 'Metric',
        calc: [
            {
                to: 'eee',
                names: ['eee', 'EEE'],
                func: (x) => {
                    return (x);
                },
                text: 'xxx'
            }
        ]
    },
    {
        name: 'Cups',
        names: ['eee', 'EEE'],
        type: 'Volume',
        system: 'Metric',
        calc: [
            {
                to: 'eee',
                names: ['eee', 'EEE'],
                func: (x) => {
                    return (x);
                },
                text: 'xxx'
            }
        ]
    },
    {
        name: 'Pints',
        names: ['eee', 'EEE'],
        type: 'Volume',
        system: 'Metric',
        calc: [
            {
                to: 'eee',
                names: ['eee', 'EEE'],
                func: (x) => {
                    return (x);
                },
                text: 'xxx'
            }
        ]
    },
    {
        name: 'Litres',
        names: ['eee', 'EEE'],
        type: 'Volume',
        system: 'Metric',
        calc: [
            {
                to: 'eee',
                names: ['eee', 'EEE'],
                func: (x) => {
                    return (x);
                },
                text: 'xxx'
            }
        ]
    },
    {
        name: 'Gallons',
        names: ['eee', 'EEE'],
        type: 'Volume',
        system: 'Metric',
        calc: [
            {
                to: 'eee',
                names: ['eee', 'EEE'],
                func: (x) => {
                    return (x);
                },
                text: 'xxx'
            }
        ]
    },
    {
        name: 'Cubic Metres',
        names: ['eee', 'EEE'],
        type: 'Volume',
        system: 'Metric',
        calc: [
            {
                to: 'eee',
                names: ['eee', 'EEE'],
                func: (x) => {
                    return (x);
                },
                text: 'xxx'
            }
        ]
    },
    // Mass
    {
        name: 'eee',
        names: ['eee', 'EEE'],
        type: 'Mass',
        system: 'Metric',
        calc: [
            {
                to: 'eee',
                names: ['eee', 'EEE'],
                func: (x) => {
                    return (x);
                },
                text: 'xxx'
            }
        ]
    },
    {
        name: 'eee',
        names: ['eee', 'EEE'],
        type: 'Mass',
        system: 'Metric',
        calc: [
            {
                to: 'eee',
                names: ['eee', 'EEE'],
                func: (x) => {
                    return (x);
                },
                text: 'xxx'
            }
        ]
    },
    {
        name: 'eee',
        names: ['eee', 'EEE'],
        type: 'Mass',
        system: 'Metric',
        calc: [
            {
                to: 'eee',
                names: ['eee', 'EEE'],
                func: (x) => {
                    return (x);
                },
                text: 'xxx'
            }
        ]
    },
    {
        name: 'eee',
        names: ['eee', 'EEE'],
        type: 'Mass',
        system: 'Metric',
        calc: [
            {
                to: 'eee',
                names: ['eee', 'EEE'],
                func: (x) => {
                    return (x);
                },
                text: 'xxx'
            }
        ]
    },
    {
        name: 'eee',
        names: ['eee', 'EEE'],
        type: 'Mass',
        system: 'Metric',
        calc: [
            {
                to: 'eee',
                names: ['eee', 'EEE'],
                func: (x) => {
                    return (x);
                },
                text: 'xxx'
            }
        ]
    },

    // Pressure
    {
        name: 'Pascal',
        names: ['eee', 'EEE'],
        type: 'Pressure',
        system: 'Metric',
        calc: [
            {
                to: 'eee',
                names: ['eee', 'EEE'],
                func: (x) => {
                    return (x);
                },
                text: 'xxx'
            }
        ]
    },
    {
        name: 'bar',
        names: ['eee', 'EEE'],
        type: 'Mass',
        system: 'Metric',
        calc: [
            {
                to: 'eee',
                names: ['eee', 'EEE'],
                func: (x) => {
                    return (x);
                },
                text: 'xxx'
            }
        ]
    },
    {
        name: 'Atmosphere',
        names: ['Atmosphere', 'atm'],
        type: 'Mass',
        system: 'Metric',
        calc: [
            {
                to: 'eee',
                names: ['eee', 'EEE'],
                func: (x) => {
                    return (x);
                },
                text: 'xxx'
            }
        ]
    },
    {
        name: 'mmHg',
        names: ['Torr', 'millimetre of Mercury', 'mmHg'],
        type: 'Mass',
        system: 'Metric',
        calc: [
            {
                to: 'eee',
                names: ['eee', 'EEE'],
                func: (x) => {
                    return (x);
                },
                text: 'xxx'
            }
        ]
    },
    {
        name: 'psi',
        names: ['eee', 'EEE'],
        type: 'Pressure',
        system: 'Metric',
        calc: [
            {
                to: 'eee',
                names: ['eee', 'EEE'],
                func: (x) => {
                    return (x);
                },
                text: 'xxx'
            }
        ]
    },
];