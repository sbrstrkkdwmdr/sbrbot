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
        name: 'Teaspoon',
        names: ['Teaspoon', 'tsp'],
        type: 'Volume',
        system: 'Imperial',
        calc: [
            {
                to: 'Teaspoon',
                names: ['Teaspoon', 'tsp',],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Tablespoon',
                names: ['Tablespoon', 'tbp',],
                func: (x) => {
                    return x / 3;
                },
                text: 'x/3'
            },
            {
                to: 'Fluid Ounce',
                names: ['Fluid Ounce', 'floz', 'oz'],
                func: (x) => {
                    return (x);
                },
                text: 'x/6'
            },
            {
                to: 'Cup',
                names: ['Cup', 'C',],
                func: (x) => {
                    return x / 48.692;
                },
                text: 'x/48.692'
            },
            {
                to: 'Pint',
                names: ['Pint', 'pt',],
                func: (x) => {
                    return x / 96;
                },
                text: 'x/96'
            },
            {
                to: 'Litre',
                names: ['Litre', 'Liter', 'L'],
                func: (x) => {
                    return x / 202.884;
                },
                text: 'x/202.884'
            },
            {
                to: 'Gallon',
                names: ['Galloon', 'gal',],
                func: (x) => {
                    return x / 768;
                },
                text: 'x/768'
            },
            {
                to: 'Cubic Metre',
                names: ['Cubic Metre', 'm3', 'm^3'],
                func: (x) => {
                    return x / 202884.2;
                },
                text: 'x/202884.2'
            },
        ]
    },
    {
        name: 'Tablespoon',
        names: ['Tablespoon', 'tbp'],
        type: 'Volume',
        system: 'Imperial',
        calc: [
            {
                to: 'Teaspoon',
                names: ['Teaspoon', 'tsp',],
                func: (x) => {
                    return x * 3;
                },
                text: 'x*3'
            },
            {
                to: 'Tablespoon',
                names: ['Tablespoon', 'tbp',],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Fluid Ounce',
                names: ['Fluid Ounce', 'floz', 'oz'],
                func: (x) => {
                    return (x);
                },
                text: 'x/2'
            },
            {
                to: 'Cup',
                names: ['Cup', 'C',],
                func: (x) => {
                    return x / 16.231;
                },
                text: 'x/16.231'
            },
            {
                to: 'Pint',
                names: ['Pint', 'pt',],
                func: (x) => {
                    return x / 32;
                },
                text: 'x/32'
            },
            {
                to: 'Litre',
                names: ['Litre', 'Liter', 'L'],
                func: (x) => {
                    return x / 67.628;
                },
                text: 'x/67.628'
            },
            {
                to: 'Gallon',
                names: ['Galloon', 'gal',],
                func: (x) => {
                    return x / 256;
                },
                text: 'x/256'
            },
            {
                to: 'Cubic Metre',
                names: ['Cubic Metre', 'm3', 'm^3'],
                func: (x) => {
                    return x / 67628.05;
                },
                text: 'x/67628.05'
            },
        ]
    },
    {
        name: 'Fluid Ounce',
        names: ['Fluid Ounce', 'floz'],
        type: 'Volume',
        system: 'Imperial',
        calc: [
            {
                to: 'Teaspoon',
                names: ['Teaspoon', 'tsp',],
                func: (x) => {
                    return x * 6;
                },
                text: 'x*6'
            },
            {
                to: 'Tablespoon',
                names: ['Tablespoon', 'tbp',],
                func: (x) => {
                    return x * 2;
                },
                text: 'x*2'
            },
            {
                to: 'Fluid Ounce',
                names: ['Fluid Ounce', 'floz', 'oz'],
                func: (x) => {
                    return (x);
                },
                text: 'x'
            },
            {
                to: 'Cup',
                names: ['Cup', 'C',],
                func: (x) => {
                    return x / 8.115;
                },
                text: 'x/8.115'
            },
            {
                to: 'Pint',
                names: ['Pint', 'pt',],
                func: (x) => {
                    return x / 16;
                },
                text: 'x/16'
            },
            {
                to: 'Litre',
                names: ['Litre', 'Liter', 'L'],
                func: (x) => {
                    return x / 33.814;
                },
                text: 'x/33.814'
            },
            {
                to: 'Gallon',
                names: ['Galloon', 'gal',],
                func: (x) => {
                    return x / 128;
                },
                text: 'x/128'
            },
            {
                to: 'Cubic Metre',
                names: ['Cubic Metre', 'm3', 'm^3'],
                func: (x) => {
                    return x / 33814;
                },
                text: 'x/33814'
            },
        ]
    },
    {
        name: 'Cup',
        names: ['Cup', 'C'],
        type: 'Volume',
        system: 'Imperial',
        calc: [
            {
                to: 'Teaspoon',
                names: ['Teaspoon', 'tsp',],
                func: (x) => {
                    return x * 48.692;
                },
                text: 'x*48.692'
            },
            {
                to: 'Tablespoon',
                names: ['Tablespoon', 'tbp',],
                func: (x) => {
                    return x * 16.231;
                },
                text: 'x*16.231'
            },
            {
                to: 'Fluid Ounce',
                names: ['Fluid Ounce', 'floz', 'oz'],
                func: (x) => {
                    return x * 8.115;
                },
                text: 'x*8.115'
            },
            {
                to: 'Cup',
                names: ['Cup', 'C',],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Pint',
                names: ['Pint', 'pt',],
                func: (x) => {
                    return x / 1.972;
                },
                text: 'x/1.972'
            },
            {
                to: 'Litre',
                names: ['Litre', 'Liter', 'L'],
                func: (x) => {
                    return x / 4.167;
                },
                text: 'x/4.167'
            },
            {
                to: 'Gallon',
                names: ['Galloon', 'gal',],
                func: (x) => {
                    return x / 15.772;
                },
                text: 'x/15.772'
            },
            {
                to: 'Cubic Metre',
                names: ['Cubic Metre', 'm3', 'm^3'],
                func: (x) => {
                    return x / 4167;
                },
                text: 'x/4167'
            },
        ]
    },
    {
        name: 'Pint',
        names: ['Pint', 'pt'],
        type: 'Volume',
        system: 'Imperial',
        calc: [
            {
                to: 'Teaspoon',
                names: ['Teaspoon', 'tsp',],
                func: (x) => {
                    return x * 96;
                },
                text: 'x*96'
            },
            {
                to: 'Tablespoon',
                names: ['Tablespoon', 'tbp',],
                func: (x) => {
                    return x * 32;
                },
                text: 'x*32'
            },
            {
                to: 'Fluid Ounce',
                names: ['Fluid Ounce', 'floz', 'oz'],
                func: (x) => {
                    return x * 16;
                },
                text: 'x*16'
            },
            {
                to: 'Cup',
                names: ['Cup', 'C',],
                func: (x) => {
                    return x * 1.972;
                },
                text: 'x*1.972'
            },
            {
                to: 'Pint',
                names: ['Pint', 'pt',],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Litre',
                names: ['Litre', 'Liter', 'L'],
                func: (x) => {
                    return x / 2.113;
                },
                text: 'x/2.113'
            },
            {
                to: 'Gallon',
                names: ['Galloon', 'gal',],
                func: (x) => {
                    return x / 8;
                },
                text: 'x/9'
            },
            {
                to: 'Cubic Metre',
                names: ['Cubic Metre', 'm3', 'm^3'],
                func: (x) => {
                    return x / 33814;
                },
                text: 'x/33814'
            },
        ]
    },
    {
        name: 'Litre',
        names: ['Litre', 'Liter', 'L'],
        type: 'Volume',
        system: 'Metric',
        calc: [
            {
                to: 'Teaspoon',
                names: ['Teaspoon', 'tsp',],
                func: (x) => {
                    return x * 202.884;
                },
                text: 'x*202.884'
            },
            {
                to: 'Tablespoon',
                names: ['Tablespoon', 'tbp',],
                func: (x) => {
                    return x * 67.628;
                },
                text: 'x*67.628'
            },
            {
                to: 'Fluid Ounce',
                names: ['Fluid Ounce', 'floz', 'oz'],
                func: (x) => {
                    return x * 33.814;
                },
                text: 'x*33.814'
            },
            {
                to: 'Cup',
                names: ['Cup', 'C',],
                func: (x) => {
                    return x * 33.814 / 8.115;
                },
                text: 'x*33.814/8.115'
            },
            {
                to: 'Pint',
                names: ['Pint', 'pt',],
                func: (x) => {
                    return x * 33.814 / 16;
                },
                text: 'x*33.814/16'
            },
            {
                to: 'Litre',
                names: ['Litre', 'Liter', 'L'],
                func: (x) => {
                    return (x);
                },
                text: 'x'
            },
            {
                to: 'Gallon',
                names: ['Galloon', 'gal',],
                func: (x) => {
                    return x * 33.814 / 128;
                },
                text: 'x*33.814/128'
            },
            {
                to: 'Cubic Metre',
                names: ['Cubic Metre', 'm3', 'm^3'],
                func: (x) => {
                    return x / 1000;
                },
                text: 'x/1000'
            },
        ]
    },
    {
        name: 'Gallon',
        names: ['Gallon', 'gal'],
        type: 'Volume',
        system: 'Imperial',
        calc: [
            {
                to: 'Teaspoon',
                names: ['Teaspoon', 'tsp',],
                func: (x) => {
                    return x * 768;
                },
                text: 'x*768'
            },
            {
                to: 'Tablespoon',
                names: ['Tablespoon', 'tbp',],
                func: (x) => {
                    return x * 256;
                },
                text: 'x*256'
            },
            {
                to: 'Fluid Ounce',
                names: ['Fluid Ounce', 'floz', 'oz'],
                func: (x) => {
                    return x * 128;
                },
                text: 'x*128'
            },
            {
                to: 'Cup',
                names: ['Cup', 'C',],
                func: (x) => {
                    return x * 15.7725;
                },
                text: 'x*15.7725'
            },
            {
                to: 'Pint',
                names: ['Pint', 'pt',],
                func: (x) => {
                    return x * 8;
                },
                text: 'x*8'
            },
            {
                to: 'Litre',
                names: ['Litre', 'Liter', 'L'],
                func: (x) => {
                    return x * 3.785;
                },
                text: 'x*3.785'
            },
            {
                to: 'Gallon',
                names: ['Galloon', 'gal',],
                func: (x) => {
                    return (x);
                },
                text: 'x'
            },
            {
                to: 'Cubic Metre',
                names: ['Cubic Metre', 'm3', 'm^3'],
                func: (x) => {
                    return x / 264.2;
                },
                text: 'x/264.2'
            },
        ]
    },
    {
        name: 'Cubic Metre',
        names: ['Cubic Metre', 'm3', 'm^3'],
        type: 'Volume',
        system: 'Metric',
        calc: [
            {
                to: 'Teaspoon',
                names: ['Teaspoon', 'tsp',],
                func: (x) => {
                    return x * 202884;
                },
                text: 'x*202884'
            },
            {
                to: 'Tablespoon',
                names: ['Tablespoon', 'tbp',],
                func: (x) => {
                    return x * 67628;
                },
                text: 'x*67628'
            },
            {
                to: 'Fluid Ounce',
                names: ['Fluid Ounce', 'floz', 'oz'],
                func: (x) => {
                    return x * 33814;
                },
                text: 'x*33814'
            },
            {
                to: 'Cup',
                names: ['Cup', 'C',],
                func: (x) => {
                    return x * 33814 / 8.115;
                },
                text: 'x*33814/8.115'
            },
            {
                to: 'Pint',
                names: ['Pint', 'pt',],
                func: (x) => {
                    return x * 33814 / 16;
                },
                text: 'x*33814/16'
            },
            {
                to: 'Litre',
                names: ['Litre', 'Liter', 'L'],
                func: (x) => {
                    return (x * 1000);
                },
                text: 'x*1000'
            },
            {
                to: 'Gallon',
                names: ['Galloon', 'gal',],
                func: (x) => {
                    return x * 33814 / 128;
                },
                text: 'x*33814/128'
            },
            {
                to: 'Cubic Metre',
                names: ['Cubic Metre', 'm3', 'm^3'],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
        ]
    },

    // Mass
    {
        name: 'Gram',
        names: ['Gram', 'g'],
        type: 'Mass',
        system: 'Metric',
        calc: [
            {
                to: 'Gram',
                names: ['Gram', 'g'],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Ounce',
                names: ['Ounce', 'oz'],
                func: (x) => {
                    return x / 28.35;
                },
                text: 'x/28.35'
            },
            {
                to: 'Pound',
                names: ['Pound', 'lb'],
                func: (x) => {
                    return x / 453.592;
                },
                text: 'x/453.592'
            },
            {
                to: 'Stone',
                names: ['Stone', 'st'],
                func: (x) => {
                    return x / 6350.29;
                },
                text: 'x/6350.29'
            },
            {
                to: 'US Ton',
                names: ['Ton', 't', 'US Ton'],
                func: (x) => {
                    return x / 907185;
                },
                text: 'x/907185'
            },
            {
                to: 'Metric Tonne',
                names: ['Tonne', 'mt', 'Metric Tonne'],
                func: (x) => {
                    return x / (10 ** 6);
                },
                text: 'x/10^6'
            },
        ]
    },
    {
        name: 'Ounce',
        names: ['Ounce', 'oz'],
        type: 'Mass',
        system: 'Imperial',
        calc: [
            {
                to: 'Gram',
                names: ['Gram', 'g'],
                func: (x) => {
                    return x * 28.35;
                },
                text: 'x*28.35'
            },
            {
                to: 'Ounce',
                names: ['Ounce', 'oz'],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Pound',
                names: ['Pound', 'lb'],
                func: (x) => {
                    return x / 16;
                },
                text: 'x/16'
            },
            {
                to: 'Stone',
                names: ['Stone', 'st'],
                func: (x) => {
                    return x / 224;
                },
                text: 'x/224'
            },
            {
                to: 'US Ton',
                names: ['Ton', 't', 'US Ton'],
                func: (x) => {
                    return x / 32000;
                },
                text: 'x/32000'
            },
            {
                to: 'Metric Tonne',
                names: ['Tonne', 'mt', 'Metric Tonne'],
                func: (x) => {
                    return x / 35274;
                },
                text: 'x/35274'
            },
        ]
    },
    {
        name: 'Pound',
        names: ['Pound', 'lb'],
        type: 'Mass',
        system: 'Metric',
        calc: [
            {
                to: 'Gram',
                names: ['Gram', 'g'],
                func: (x) => {
                    return x * 453.592;
                },
                text: 'x*453.592'
            },
            {
                to: 'Ounce',
                names: ['Ounce', 'oz'],
                func: (x) => {
                    return x;
                },
                text: 'x*16'
            },
            {
                to: 'Pound',
                names: ['Pound', 'lb'],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Stone',
                names: ['Stone', 'st'],
                func: (x) => {
                    return x / 14;
                },
                text: 'x/14'
            },
            {
                to: 'US Ton',
                names: ['Ton', 't', 'US Ton'],
                func: (x) => {
                    return x / 2000;
                },
                text: 'x/2000'
            },
            {
                to: 'Metric Tonne',
                names: ['Tonne', 'mt', 'Metric Tonne'],
                func: (x) => {
                    return x / 2205;
                },
                text: 'x/2205'
            },
        ]
    },
    {
        name: 'Stone',
        names: ['Stone', 'st'],
        type: 'Mass',
        system: 'Metric',
        calc: [
            {
                to: 'Gram',
                names: ['Gram', 'g'],
                func: (x) => {
                    return x * 6350.29;
                },
                text: 'x*6350.29'
            },
            {
                to: 'Ounce',
                names: ['Ounce', 'oz'],
                func: (x) => {
                    return x * 224;
                },
                text: 'x*224'
            },
            {
                to: 'Pound',
                names: ['Pound', 'lb'],
                func: (x) => {
                    return x * 14;
                },
                text: 'x*14'
            },
            {
                to: 'Stone',
                names: ['Stone', 'st'],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'US Ton',
                names: ['Ton', 't', 'US Ton'],
                func: (x) => {
                    return x * 0.007;
                },
                text: 'x*0.007'
            },
            {
                to: 'Metric Tonne',
                names: ['Tonne', 'mt', 'Metric Tonne'],
                func: (x) => {
                    return x / 157.473;
                },
                text: 'x/157.473'
            },
        ]
    },
    {
        name: 'US Ton',
        names: ['Ton', 't', 'US Ton'],
        type: 'Mass',
        system: 'Imperial',
        calc: [
            {
                to: 'Gram',
                names: ['Gram', 'g'],
                func: (x) => {
                    return x * 907185;
                },
                text: 'x*907185'
            },
            {
                to: 'Ounce',
                names: ['Ounce', 'oz'],
                func: (x) => {
                    return x * 32000;
                },
                text: 'x*32000'
            },
            {
                to: 'Pound',
                names: ['Pound', 'lb'],
                func: (x) => {
                    return x * 2000;
                },
                text: 'x*2000'
            },
            {
                to: 'Stone',
                names: ['Stone', 'st'],
                func: (x) => {
                    return x / 0.007;
                },
                text: 'x/0.007'
            },
            {
                to: 'US Ton',
                names: ['Ton', 't', 'US Ton'],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Metric Tonne',
                names: ['Tonne', 'mt', 'Metric Tonne'],
                func: (x) => {
                    return x / 1.102;
                },
                text: 'x/1.102'
            },
        ]
    },
    {
        name: 'Metric Tonne',
        names: ['Tonne', 'mt', 'Metric Tonne'],
        type: 'Mass',
        system: 'Metric',
        calc: [
            {
                to: 'Gram',
                names: ['Gram', 'g'],
                func: (x) => {
                    return x * (10 ** 6);
                },
                text: 'x*10^6'
            },
            {
                to: 'Ounce',
                names: ['Ounce', 'oz'],
                func: (x) => {
                    return x * 35274;
                },
                text: 'x*35274'
            },
            {
                to: 'Pound',
                names: ['Pound', 'lb'],
                func: (x) => {
                    return x * 2204.62;
                },
                text: 'x*2204.62'
            },
            {
                to: 'Stone',
                names: ['Stone', 'st'],
                func: (x) => {
                    return x * 157.473;
                },
                text: 'x*157.473'
            },
            {
                to: 'US Ton',
                names: ['Ton', 't', 'US Ton'],
                func: (x) => {
                    return x * 1.102;
                },
                text: 'x*1.102'
            },
            {
                to: 'Metric Tonne',
                names: ['Tonne', 'mt', 'Metric Tonne'],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
        ]
    },

    // Pressure
    {
        name: 'Pascal',
        names: ['Pascal', 'Pa', 'N/m^2', 'N/m', 'Nm'],
        type: 'Pressure',
        system: 'Metric',
        calc: [
            {
                to: 'Pascal',
                names: ['Pascal', 'Pa', 'N/m^2', 'N/m', 'Nm'],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'mmHg',
                names: ['Torr', 'millimetre of Mercury', 'mmHg', 'millimeter of Mercury',],
                func: (x) => {
                    return x / 133.322;
                },
                text: 'x/133.322'
            },
            {
                to: 'psi',
                names: ['Pounds per square inch', 'psi'],
                func: (x) => {
                    return x / 6894.76;
                },
                text: 'x/6894.76'
            },
            {
                to: 'Bar',
                names: ['Bar'],
                func: (x) => {
                    return x / 100000;
                },
                text: 'x/100000'
            },
            {
                to: 'Atmosphere',
                names: ['Atmosphere', 'atm'],
                func: (x) => {
                    return x / 101325;
                },
                text: 'x/101325'
            },
        ]
    },
    {
        name: 'mmHg',
        names: ['millimetre of Mercury', 'mmHg', 'millimeter of Mercury',],
        type: 'Mass',
        system: 'N/A',
        calc: [
            {
                to: 'Pascal',
                names: ['Pascal', 'Pa', 'N/m^2', 'N/m', 'Nm'],
                func: (x) => {
                    return x * 133.322;
                },
                text: 'x*133.322'
            },
            {
                to: 'mmHg',
                names: ['Torr', 'millimetre of Mercury', 'mmHg', 'millimeter of Mercury',],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'psi',
                names: ['Pounds per square inch', 'psi'],
                func: (x) => {
                    return x / 51.7149;
                },
                text: 'x/51.7149'
            },
            {
                to: 'Bar',
                names: ['Bar'],
                func: (x) => {
                    return x / 750.062;
                },
                text: 'x/750.062'
            },
            {
                to: 'Atmosphere',
                names: ['Atmosphere', 'atm'],
                func: (x) => {
                    return x / 760;
                },
                text: 'x/760'
            },
        ]
    },
    {
        name: 'psi',
        names: ['Pounds per square inch', 'psi'],
        type: 'Pressure',
        system: 'Imperial',
        calc: [
            {
                to: 'Pascal',
                names: ['Pascal', 'Pa', 'N/m^2', 'N/m', 'Nm'],
                func: (x) => {
                    return x * 6894.76;
                },
                text: 'x*6894.76'
            },
            {
                to: 'mmHg',
                names: ['Torr', 'millimetre of Mercury', 'mmHg', 'millimeter of Mercury',],
                func: (x) => {
                    return x * 51.7149;
                },
                text: 'x*51.7149'
            },
            {
                to: 'psi',
                names: ['Pounds per square inch', 'psi'],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Bar',
                names: ['Bar'],
                func: (x) => {
                    return x / 14.504;
                },
                text: 'x/14.504'
            },
            {
                to: 'Atmosphere',
                names: ['Atmosphere', 'atm'],
                func: (x) => {
                    return x / 14.696;
                },
                text: 'x/14.696'
            },
        ]
    },
    {
        name: 'Bar',
        names: ['Bar'],
        type: 'Mass',
        system: 'Metric',
        calc: [
            {
                to: 'Pascal',
                names: ['Pascal', 'Pa', 'N/m^2', 'N/m', 'Nm'],
                func: (x) => {
                    return x*100000;
                },
                text: 'x*100000'
            },
            {
                to: 'mmHg',
                names: ['Torr', 'millimetre of Mercury', 'mmHg', 'millimeter of Mercury',],
                func: (x) => {
                    return x*750.062;
                },
                text: 'x*750.062'
            },
            {
                to: 'psi',
                names: ['Pounds per square inch', 'psi'],
                func: (x) => {
                    return x*14.504;
                },
                text: 'x*14.504'
            },
            {
                to: 'Bar',
                names: ['Bar'],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Atmosphere',
                names: ['Atmosphere', 'atm'],
                func: (x) => {
                    return x/1.013;
                },
                text: 'x/1.013'
            },
        ]
    },
    {
        name: 'Atmosphere',
        names: ['Atmosphere', 'atm'],
        type: 'Mass',
        system: 'Metric',
        calc: [
            {
                to: 'Pascal',
                names: ['Pascal', 'Pa', 'N/m^2', 'N/m', 'Nm'],
                func: (x) => {
                    return x*101325;
                },
                text: 'x*101325'
            },
            {
                to: 'mmHg',
                names: ['Torr', 'millimetre of Mercury', 'mmHg', 'millimeter of Mercury',],
                func: (x) => {
                    return x*760;
                },
                text: 'x*760'
            },
            {
                to: 'psi',
                names: ['Pounds per square inch', 'psi'],
                func: (x) => {
                    return x*14.696;
                },
                text: 'x*14.696'
            },
            {
                to: 'Bar',
                names: ['Bar'],
                func: (x) => {
                    return x*1.013;
                },
                text: 'x*1.013'
            },
            {
                to: 'Atmosphere',
                names: ['Atmosphere', 'atm'],
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
        ]
    },
];