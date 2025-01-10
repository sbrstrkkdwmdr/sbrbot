export type convVal = {
    name: string,
    names: string[],
    type: 'Temperature' | 'Distance' | 'Volume' | 'Time' | 'Mass' | 'Pressure' | 'Energy' | 'Power' | 'Angle' | 'Area' | 'Speed' | 'N/A',
    system: 'Metric' | 'Imperial' | 'N/A',
    calc: {
        to: string,
        names: string[];
        func: (x: number) => number,
        text: string;
    }[];
};

export type convValCalc = {
    to: string,
    names: string[];
    func: (x: number) => number,
    text: string;
};

//some values have NULL due to how conversions help embed works
/**
 * conversions taken from
 * google
 * https://www.unitconverters.net/power/watt-to-pound-foot-minute.htm
 * https://www.everythingrf.com/rf-calculators/watt-to-dbm
 * http://convert-to.com/conversion/power/convert-ft-lb-per-sec-to-w.html
 */


const namesList = {
    arbitrary: ['Arbitrary units', 'idk', 'wtf', '???', '?'],
    temp_c: ['Celsius', '℃', '°C', 'Celcius', 'Centigrade', 'C',],
    temp_f: ['Fahrenheit', '℉', '°F', 'F'],
    temp_k: ['Kelvin', '°K', 'K'],
    dist_in: ['Inch', 'in', '\'', '`'],
    dist_ft: ['Feet', 'ft', 'foot', '"', "''", '``'],
    dist_m: ['Metre', 'm', 'Meter'],
    dist_footfield: ['Football Field', 'ff', 'footballfield'],
    dist_mi: ['Mile', 'mi'],
    dist_au: ['Astronomical Unit', 'au'],
    dist_ly: ['Light Year', 'ly'],
    dist_pc: ['Parsec', 'pc'],
    time_s: ['Second', 's', 'sec'],
    time_min: ['Minute', 'min',],
    time_hr: ['Hour', 'h', 'hr'],
    time_d: ['Day', 'd',],
    time_wk: ['Week', 'wk', 'sennight',],
    time_fn: ['Fortnight', 'fn'],
    time_mth: ['Month', 'mth', 'mon'],
    time_qua: ['Quarantine', null, 'quarantina', 'quarentine'],
    time_yr: ['Year', 'yr',],
    time_dec: ['Decade',],
    time_cen: ['Century', 'cent'],
    time_mil: ['Millennium', null, 'Millennia',],
    time_ma: ['Megaannum',],
    time_eon: ['Eon',],
    vol_tsp: ['Teaspoon', 'tsp',],
    vol_tbp: ['Tablespoon', 'tbp',],
    vol_floz: ['Fluid Ounce', 'floz'],
    vol_c: ['Cup', 'c',],
    vol_pt: ['Pint', 'pt',],
    vol_l: ['Litre', 'Liter', 'L'],
    vol_gal: ['Galloon', 'gal',],
    vol_m3: ['Cubic Metre', 'm³', 'm3', 'm^3'],
    mass_g: ['Gram', 'g'],
    mass_oz: ['Ounce', 'oz'],
    mass_lb: ['Pound', 'lb'],
    mass_st: ['Stone', 'st'],
    mass_t: ['US Ton', 't', 'Ton',],
    mass_mt: ['Metric Tonne', 'mt', 'Tonne',],
    pres_pa: ['Pascal', 'Pa', 'N m² ⁻¹', 'N/m^2', 'N/m', 'Nm'],
    pres_mmHg: ['millimetre of Mercury', 'mmHg', 'Torr', 'millimeter of Mercury',],
    pres_psi: ['Pounds per square inch', 'psi'],
    pres_bar: ['Bar'],
    pres_atm: ['Standard Atmosphere', 'atm', 'Atmosphere', 'std atm'],
    nrg_ev: ['Electron Volt', 'eV', 'Electronvolt'],
    nrg_j: ['Joule', 'j'],
    nrg_cal: ['Calorie', 'cal'],
    nrg_btu: ['British Thermal Unit', 'btu'],
    nrg_wh: ['Watt Hour', 'wH'],
    pow_w: ['Watt', 'w'],
    pow_horse: ['Horse Power', 'hp'],
    pow_erg: ['Ergs', 'erg s⁻¹', 'erg/s'],
    pow_ftlbsec: ['Foot-pounds per second', 'ft lb s⁻¹', 'ftlb/s', 'ft lb s', 'ftlbs', 'ftlbsec', 'ft lb sec'],
    pow_dbm: ['Decibel-milliwatts', 'dBm', 'dbmw'],
    pow_btusec: ['BTU per second', 'btu s⁻¹', 'btus', 'btusec',],
    pow_calsec: ['Calories per second', 'cal s⁻¹', 'cals', 'calsec'],
    area_in2: ['Square inch', 'in²', 'in2', 'sqin'],
    area_ft2: ['Square foot', 'ft²', 'ft2', 'sqft'],
    area_m2: ['Square metre', 'm²', 'm2', 'sqm'],
    area_ac: ['Acre', 'ac'],
    area_ha: ['Hectare', 'Ha'],
    area_km2: ['Square kilometre', 'km²', 'km2', 'sqkm'],
    area_mi2: ['Square mile', 'mi²', 'mi2', 'sqmi'],
    angle_grad: ['Gradian', 'grad'],
    angle_deg: ['Degree', 'deg'],
    angle_rad: ['Radian', 'rad'],
    speed_kmh: ['Kilometres per hour', 'km h⁻¹', 'kmh', 'kph', 'km/h'],
    speed_mph: ['Miles per hour', 'mi h⁻¹', 'mph', 'mih', 'mi/h', 'm/h'],
    speed_kt: ['Knot', 'kt', 'nmi h⁻¹', 'nmih', 'nmh', 'Nautical miles per hour'],
    speed_ms: ['Metres per second', 'm s⁻¹', 'ms', 'mps', 'm/s',],
    speed_c: ['Light', 'c', 'lightspeed'],
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
                    return x;
                },
                text: 'xxx'
            }
        ]
    },
];

function arbitrary(x: number) {
    const actions = ['add', 'sub1', 'sub2', 'mul', 'div1', 'div2'];
    const type = actions[Math.floor(Math.random() * actions.length)];
    let num = x;
    const useMultiple = Math.floor(Math.random() * 2) == 1 ? false : true;
    const multiple =
        useMultiple ?
            (Math.random() * (1000 + 1000)) - 1000 : 1;
    switch (type) {
        case 'add':
            num = (Math.random() * multiple) + x;
            break;
        case 'sub1':
            num = (Math.random() * multiple) - x;
            break;
        case 'sub2':
            num = x - (Math.random() * multiple);
            break;
        case 'mul': default:
            num = (Math.random() * multiple) * x;
            break;
        case 'div1':
            num = (Math.random() * multiple) / x;
            break;
        case 'div2':
            num = x / (Math.random() * multiple);
            break;
    }


    return num;
}

const toArbitrary: convValCalc = {
    to: 'Arbitrary units',
    names: ['Arbitrary units', 'idk', 'wtf', '???', '?'],
    func: (x) => {
        return arbitrary(x);
    },
    text: 'x*ư̶̧̨̞̘̙̭̺͚̰̱̼̮͙͕̰͉̜͔̥̳̲̣͇̦̹̪̪̤̜̣̣͓̩̳̺̰͖͉̫̬̮͚̖̗̪̲̓̂̀̏̒͋̒̽͂̒̀̈́͐̒̑͌͋̊̑̐̐̚͘̕̚͠͝͠ͅn̶̢̡̧̧̧̛͖̳̪͓̪̜̣̙̳̼͚̭̲̫͇̘͍͓̮̼̺̞͍̬͈͔͚̮̺̙͙͍̯͙̰͈͙̝̍́̋͆̃̈́̀͌̿̈́͂͌̈̀̌̋̉̾̾̈́͑̉͌̓̈́̿́̑͘͠͝k̷̡̛͔̦̠̲͔̠͉̬͈̝̦̉̅̂͐̈́̇̈́̓̾̈͑͋̾̈́̏͗̓̋͆͊̕͝͝͝͝ṇ̵̢̨̛͕̺͖̗̘̎̏͑͋̿̾͆͗͂͒̏̃͗̽͊̈̂̆̀̏̑̋̑͛̐̌́̋͂́̆̋͂̇͌̌͑̈̓̂̃̉̕̕̚͝͝͝͠ͅǫ̸̡̧̞̦̤͈̺̮̳̤̫̞͈̲͚̤̥̥̖̼͙̤͑̾̽͗̌̌̽̈́̔̈́̓̏̃̕͠w̸̧̧̮͔͙̫̲̲̣̙̝͉͉͙̠̟̰͓̟̲͖̭͉̤͔̬̬̭͕͇̝͍̠͕͔̹̫̤̱̪̉̔͗̈̉̈̽́̋̊̄̂̿͗̉̇͋̒̐̀̇͌̾́͂̿̉̚̕̕ͅn̵̢̡̨̛͍̗̺̤̭̥͕̠̟̞̥͇͉̹̖̞̰̬̼͖̥̹̫̩͓̩̫̦̂̃̑̎́̇̏̒̃̓͑̂̍̿́̇̒̀̉̅̓̆̌͘̚͠͝͠ͅͅ'
};

/*
 *
 * measurements are smallest to largest (excluding temp cos it rlly doesn't matter)
 * temperature - celsius(c), fahrenheit(f), kelvin(k)
 * distance - inch(in), feet(ft), metre(m), mile(mi), astronomical unit(au), light year(ly)
 * time - second(s), minute(min), hour(hr), day(d), week(wk), month(mth), year(y)
 * volume - teaspoon(tsp), tablespoon(tbp), fluid ounce(floz), cup(c), pint(pt), litre(l), gallon(gal), cubic metre(m3)
 * mass - gram(g), ounce(oz), pound (lb), stone(st), us ton/ton (t), metric tonne/tonne (mt)
 * pressure - pascal (Pa), millimetre of mercury/torr (mmHg), pounds per square inch (psi), bar, standard atmosphere (atm)
 * energy - electronvolt (eV), joule (J), calories,
 * area - square metre (m2), square kilometre (km2), square mile (mi2), hectare(ha), acre(ac)
 * angle - revolution(r), degree(deg), radian(rad)
 * speed - metres per second (ms), kilometres per hour (kmh),  miles per hour (mph), knots (kt)
 */
export const values: convVal[] = [
    // Temperature
    {
        name: 'Celsius',
        names: namesList.temp_c,
        type: 'Temperature',
        system: 'Metric',
        calc: [
            {
                to: 'Celsius',
                names: namesList.temp_c,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Fahrenheit',
                names: namesList.temp_f,
                func: (x) => {
                    return x * 9 / 5 + 32;
                },
                text: 'x*9/5+32'
            },
            {
                to: 'Kelvin',
                names: namesList.temp_k,
                func: (x) => {
                    return x + 273.15;
                },
                text: 'x+273.15'
            },
            toArbitrary
        ]
    },
    {
        name: 'Fahrenheit',
        names: namesList.temp_f,
        type: 'Temperature',
        system: 'Imperial',
        calc: [
            {
                to: 'Celsius',
                names: namesList.temp_c,
                func: (x) => {
                    return (x - 32) * 5 / 9;
                },
                text: '((x)-32)*5/9'
            },
            {
                to: 'Fahrenheit',
                names: namesList.temp_f,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Kelvin',
                names: namesList.temp_k,
                func: (x) => {
                    return (x - 32) * 5 / 9 + 273.15;
                },
                text: '((x)-32)*5/9 + 273.15'
            },
            toArbitrary
        ]
    },
    {
        name: 'Kelvin',
        names: namesList.temp_k,
        type: 'Temperature',
        system: 'Metric',
        calc: [
            {
                to: 'Celsius',
                names: namesList.temp_c,
                func: (x) => {
                    return x - 273.15;
                },
                text: 'x-273.15'
            },
            {
                to: 'Fahrenheit',
                names: namesList.temp_f,
                func: (x) => {
                    return (x - 273.15) * 9 / 5 + 32;
                },
                text: '(x-273.15)*9/5+32'
            },
            {
                to: 'Kelvin',
                names: namesList.temp_k,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            toArbitrary
        ]
    },
    // Distance
    {
        name: 'Inch',
        names: namesList.dist_in,
        type: 'Distance',
        system: 'Imperial',
        calc: [
            {
                to: 'Inch',
                names: namesList.dist_in,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Feet',
                names: namesList.dist_ft,
                func: (x) => {
                    return x / 12;
                },
                text: 'x/12'
            },
            {
                to: 'Metre',
                names: namesList.dist_m,
                func: (x) => {
                    return x / 39.37;
                },
                text: 'x/39.37'
            },
            {
                to: 'Mile',
                names: namesList.dist_mi,
                func: (x) => {
                    return x / 63360;
                },
                text: 'x/63360'
            },
            {
                to: 'Astronomical Unit',
                names: namesList.dist_au,
                func: (x) => {
                    return x * 0.0254 / 149597870700;
                },
                text: 'x*0.0254/149597870700'
            },
            {
                to: 'Light Year',
                names: namesList.dist_ly,
                func: (x) => {
                    return x * 0.0254 / 9460730472580800;
                },
                text: 'x*0.0254/9460730472580800'
            },
            {
                to: 'Parsec',
                names: namesList.dist_pc,
                func: (x) => {
                    return x / 1.215e18;
                },
                text: 'x/1.215e18'
            },
            toArbitrary
        ]
    },
    {
        name: 'Feet',
        names: namesList.dist_ft,
        type: 'Distance',
        system: 'Imperial',
        calc: [
            {
                to: 'Inch',
                names: namesList.dist_in,
                func: (x) => {
                    return x * 12;
                },
                text: 'x*12'
            },
            {
                to: 'Feet',
                names: namesList.dist_ft,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Metre',
                names: namesList.dist_m,
                func: (x) => {
                    return x / 3.28084;
                },
                text: 'x/3.28084'
            },
            {
                to: 'Mile',
                names: namesList.dist_mi,
                func: (x) => {
                    return x / 5280;
                },
                text: 'x/5280'
            },
            {
                to: 'Astronomical Unit',
                names: namesList.dist_au,
                func: (x) => {
                    return x * 0.3048 / 149597870700;
                },
                text: 'x*0.3048/149597870700'
            },
            {
                to: 'Light Year',
                names: namesList.dist_ly,
                func: (x) => {
                    return x * 0.3048 / 9460730472580800;
                },
                text: 'x*0.3048/9460730472580800'
            },
            {
                to: 'Parsec',
                names: namesList.dist_pc,
                func: (x) => {
                    return x / 1.012e17;
                },
                text: 'x/1.012e17'
            },
            toArbitrary
        ]
    },
    {
        name: 'Metre',
        names: namesList.dist_m,
        type: 'Distance',
        system: 'Metric',
        calc: [
            {
                to: 'Inch',
                names: namesList.dist_in,
                func: (x) => {
                    return x / 0.0254;
                },
                text: 'x/0.0254'
            },
            {
                to: 'Feet',
                names: namesList.dist_ft,
                func: (x) => {
                    return x / 0.3048;
                },
                text: 'x/0.3048'
            },
            {
                to: 'Metre',
                names: namesList.dist_m,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Mile',
                names: namesList.dist_mi,
                func: (x) => {
                    return x / 1609.344;
                },
                text: 'x/1609.344'
            },
            {
                to: 'Astronomical Unit',
                names: namesList.dist_au,
                func: (x) => {
                    return x / 149597870700;
                },
                text: 'x/149597870700'
            },
            {
                to: 'Light Year',
                names: namesList.dist_ly,
                func: (x) => {
                    return x / 9460730472580800;
                },
                text: 'x/9460730472580800'
            },
            {
                to: 'Parsec',
                names: namesList.dist_pc,
                func: (x) => {
                    return x / 3.086e16;
                },
                text: 'x/3.086e16'
            },
            toArbitrary
        ]
    },
    {
        name: 'Mile',
        names: namesList.dist_mi,
        type: 'Distance',
        system: 'Imperial',
        calc: [
            {
                to: 'Inch',
                names: namesList.dist_in,
                func: (x) => {
                    return x * 63360;
                },
                text: 'x*63360'
            },
            {
                to: 'Feet',
                names: namesList.dist_ft,
                func: (x) => {
                    return x * 5280;
                },
                text: 'x*5280'
            },
            {
                to: 'Metre',
                names: namesList.dist_m,
                func: (x) => {
                    return x * 1609.344;
                },
                text: 'x*1609.344'
            },
            {
                to: 'Mile',
                names: namesList.dist_mi,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Astronomical Unit',
                names: namesList.dist_au,
                func: (x) => {
                    return x * 1609.344 / 149597870700;
                },
                text: 'x*1609.344/149597870700'
            },
            {
                to: 'Light Year',
                names: namesList.dist_ly,
                func: (x) => {
                    return x * 1609.344 / 9460730472580800;
                },
                text: 'x*1609.344/9460730472580800'
            },
            {
                to: 'Parsec',
                names: namesList.dist_pc,
                func: (x) => {
                    return x / 1.917e13;
                },
                text: 'x/1.917e13'
            },
            toArbitrary
        ]
    },
    {
        name: 'Astronomical Unit',
        names: namesList.dist_au,
        type: 'Distance',
        system: 'N/A',
        calc: [
            {
                to: 'Inch',
                names: namesList.dist_in,
                func: (x) => {
                    return x * 149597870700 / 0.0254;
                },
                text: 'x*149597870700/0.0254'
            },
            {
                to: 'Feet',
                names: namesList.dist_ft,
                func: (x) => {
                    return x * 149597870700 / 0.3048;
                },
                text: 'x*149597870700/0.3048'
            },
            {
                to: 'Metre',
                names: namesList.dist_m,
                func: (x) => {
                    return x * 149597870700;
                },
                text: 'x*149597870700'
            },
            {
                to: 'Mile',
                names: namesList.dist_mi,
                func: (x) => {
                    return x * 149597870700 / 1609.344;
                },
                text: 'x*149597870700/1609.344'
            },
            {
                to: 'Astronomical Unit',
                names: namesList.dist_au,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Light Year',
                names: namesList.dist_ly,
                func: (x) => {
                    return x * 149597870700 / 9460730472580800;
                },
                text: 'x*149597870700/9460730472580800'
            },
            {
                to: 'Parsec',
                names: namesList.dist_pc,
                func: (x) => {
                    return x / (3.262 * 149597870700 / 9460730472580800);
                },
                text: 'x/(3.262*149597870700/9460730472580800)'
            },
            toArbitrary
        ]
    },
    {
        name: 'Light Year',
        names: namesList.dist_ly,
        type: 'Distance',
        system: 'N/A',
        calc: [
            {
                to: 'Inch',
                names: namesList.dist_in,
                func: (x) => {
                    return x * 9460730472580800 / 0.0254;
                },
                text: 'x*9460730472580800/0.0254'
            },
            {
                to: 'Feet',
                names: namesList.dist_ft,
                func: (x) => {
                    return x * 9460730472580800 / 0.3048;
                },
                text: 'x*9460730472580800/0.3048'
            },
            {
                to: 'Metre',
                names: namesList.dist_m,
                func: (x) => {
                    return x * 9460730472580800;
                },
                text: 'x*9460730472580800'
            },
            {
                to: 'Mile',
                names: namesList.dist_mi,
                func: (x) => {
                    return x * 9460730472580800 / 1609.344;
                },
                text: 'x*9460730472580800/1609.344'
            },
            {
                to: 'Astronomical Unit',
                names: namesList.dist_au,
                func: (x) => {
                    return x * 9460730472580800 / 149597870700;
                },
                text: 'x*9460730472580800/149597870700'
            },
            {
                to: 'Light Year',
                names: namesList.dist_ly,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Parsec',
                names: namesList.dist_pc,
                func: (x) => {
                    return x / 3.262;
                },
                text: 'x/3.262'
            },
            toArbitrary
        ]
    },
    {
        name: 'Parsec',
        names: namesList.dist_pc,
        type: 'Distance',
        system: 'N/A',
        calc: [
            {
                to: 'Inch',
                names: namesList.dist_in,
                func: (x) => {
                    return x * 1.215e18;
                },
                text: 'x*1.215e18'
            },
            {
                to: 'Feet',
                names: namesList.dist_ft,
                func: (x) => {
                    return x * 1.012e17;
                },
                text: 'x*1.012e17'
            },
            {
                to: 'Metre',
                names: namesList.dist_m,
                func: (x) => {
                    return x * 3.086e16;
                },
                text: 'x*3.086e16'
            },
            {
                to: 'Mile',
                names: namesList.dist_mi,
                func: (x) => {
                    return x * 1.917e13;
                },
                text: 'x*1.917e13'
            },
            {
                to: 'Astronomical Unit',
                names: namesList.dist_au,
                func: (x) => {
                    return x * (3.262 * 9460730472580800 / 149597870700);
                },
                text: 'x*(3.262*9460730472580800/149597870700)'
            },
            {
                to: 'Light Year',
                names: namesList.dist_ly,
                func: (x) => {
                    return x * 3.262;
                },
                text: 'x*3.262'
            },
            {
                to: 'Parsec',
                names: namesList.dist_pc,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            toArbitrary
        ]
    },
    // Time
    {
        name: 'Second',
        names: namesList.time_s,
        type: 'Time',
        system: 'Metric',
        calc: [
            {
                to: 'Second',
                names: namesList.time_s,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Minute',
                names: namesList.time_min,
                func: (x) => {
                    return x / 60;
                },
                text: 'x/60'
            },
            {
                to: 'Hour',
                names: namesList.time_hr,
                func: (x) => {
                    return x / 3600;
                },
                text: 'x/3600'
            },
            {
                to: 'Day',
                names: namesList.time_d,
                func: (x) => {
                    return x / 86400;
                },
                text: 'x/86400'
            },
            {
                to: 'Week',
                names: namesList.time_wk,
                func: (x) => {
                    return x / 604800;
                },
                text: 'x/604800'
            },
            {
                to: 'Fortnight',
                names: namesList.time_fn,
                func: (x) => {
                    return x / 604800 / 2;
                },
                text: 'x/604800/2'
            },
            {
                to: 'Month',
                names: namesList.time_mth,
                func: (x) => {
                    return x / 86400 / 30.437;
                },
                text: 'x/86400/30.437'
            },
            {
                to: 'Quarantine',
                names: namesList.time_qua,
                func: (x) => {
                    return x / 86400 / 40;
                },
                text: 'x/86400/40'
            },
            {
                to: 'Year',
                names: namesList.time_yr,
                func: (x) => {
                    return x / 86400 / 365.25;
                },
                text: 'x/86400/365.25'
            },
            {
                to: 'Decade',
                names: namesList.time_dec,
                func: (x) => {
                    return x / 86400 / 365.25 / 10;
                },
                text: 'x/86400/365.25/10'
            },
            {
                to: 'Century',
                names: namesList.time_cen,
                func: (x) => {
                    return x / 86400 / 365.25 / 100;
                },
                text: 'x/86400/365.25/100'
            },
            {
                to: 'Millennium',
                names: namesList.time_mil,
                func: (x) => {
                    return x / 86400 / 365.25 / 1e3;
                },
                text: 'x/86400/365.25/1000'
            },
            {
                to: 'Megaannum',
                names: namesList.time_ma,
                func: (x) => {
                    return x / 86400 / 365.25 / 1e6;
                },
                text: 'x/86400/365.25/1e6'
            },
            {
                to: 'Eon',
                names: namesList.time_eon,
                func: (x) => {
                    return x / 86400 / 365.25 / 1e9;
                },
                text: 'x/86400/365.25/1e9'
            },
            toArbitrary
        ]
    },
    {
        name: 'Minute',
        names: namesList.time_min,
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: namesList.time_s,
                func: (x) => {
                    return x * 60;
                },
                text: 'x*60'
            },
            {
                to: 'Minute',
                names: namesList.time_min,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Hour',
                names: namesList.time_hr,
                func: (x) => {
                    return x / 60;
                },
                text: 'x/60'
            },
            {
                to: 'Day',
                names: namesList.time_d,
                func: (x) => {
                    return x / 1440;
                },
                text: 'x/1440'
            },
            {
                to: 'Week',
                names: namesList.time_wk,
                func: (x) => {
                    return x / 10080;
                },
                text: 'x/10080'
            },
            {
                to: 'Fortnight',
                names: namesList.time_fn,
                func: (x) => {
                    return x / 10080 / 2;
                },
                text: 'x/10080/2'
            },
            {
                to: 'Month',
                names: namesList.time_mth,
                func: (x) => {
                    return x / 1440 / 30.437;
                },
                text: 'x/1440/30.437'
            },
            {
                to: 'Quarantine',
                names: namesList.time_qua,
                func: (x) => {
                    return x / 1440 / 40;
                },
                text: 'x/1440/40'
            },
            {
                to: 'Year',
                names: namesList.time_yr,
                func: (x) => {
                    return x / 1440 / 365.25;
                },
                text: 'x/1440/365.25'
            },
            {
                to: 'Decade',
                names: namesList.time_dec,
                func: (x) => {
                    return x / 1440 / 365.25 / 10;
                },
                text: 'x/1440/365.25/10'
            },
            {
                to: 'Century',
                names: namesList.time_cen,
                func: (x) => {
                    return x / 1440 / 365.25 / 100;
                },
                text: 'x/1440/365.25/100'
            },
            {
                to: 'Millennium',
                names: namesList.time_mil,
                func: (x) => {
                    return x / 1440 / 365.25 / 1e3;
                },
                text: 'x/1440/365.25/1000'
            },
            {
                to: 'Megaannum',
                names: namesList.time_ma,
                func: (x) => {
                    return x / 1440 / 365.25 / 1e6;
                },
                text: 'x/1440/365.25/1e6'
            },
            {
                to: 'Eon',
                names: namesList.time_eon,
                func: (x) => {
                    return x / 1440 / 365.25 / 1e9;
                },
                text: 'x/1440/365.25/1e9'
            },
            toArbitrary
        ]
    },
    {
        name: 'Hour',
        names: namesList.time_hr,
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: namesList.time_s,
                func: (x) => {
                    return x * 3600;
                },
                text: 'x*3600'
            },
            {
                to: 'Minute',
                names: namesList.time_min,
                func: (x) => {
                    return x * 60;
                },
                text: 'x*60'
            },
            {
                to: 'Hour',
                names: namesList.time_hr,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Day',
                names: namesList.time_d,
                func: (x) => {
                    return x / 24;
                },
                text: 'x/24'
            },
            {
                to: 'Week',
                names: namesList.time_wk,
                func: (x) => {
                    return x / 168;
                },
                text: 'x/168'
            },
            {
                to: 'Fortnight',
                names: namesList.time_fn,
                func: (x) => {
                    return x / 336;
                },
                text: 'x/336'
            },
            {
                to: 'Month',
                names: namesList.time_mth,
                func: (x) => {
                    return x / 730.0008;
                },
                text: 'x/730.0008'
            },
            {
                to: 'Quarantine',
                names: namesList.time_qua,
                func: (x) => {
                    return x / 24 / 40;
                },
                text: 'x/24/40'
            },
            {
                to: 'Year',
                names: namesList.time_yr,
                func: (x) => {
                    return x / 8766;
                },
                text: 'x/8766'
            },
            {
                to: 'Decade',
                names: namesList.time_dec,
                func: (x) => {
                    return x / 8766 / 10;
                },
                text: 'x/8766/10'
            },
            {
                to: 'Century',
                names: namesList.time_cen,
                func: (x) => {
                    return x / 8766 / 100;
                },
                text: 'x/8766/100'
            },
            {
                to: 'Millennium',
                names: namesList.time_mil,
                func: (x) => {
                    return x / 8766 / 1e3;
                },
                text: 'x/8766/1000'
            },
            {
                to: 'Megaannum',
                names: namesList.time_ma,
                func: (x) => {
                    return x / 8766 / 1e6;
                },
                text: 'x/8766/1e6'
            },
            {
                to: 'Eon',
                names: namesList.time_eon,
                func: (x) => {
                    return x / 8766 / 1e9;
                },
                text: 'x/8766/1e9'
            },
            toArbitrary
        ]
    },
    {
        name: 'Day',
        names: namesList.time_d,
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: namesList.time_s,
                func: (x) => {
                    return x * 86400;
                },
                text: 'x*86400'
            },
            {
                to: 'Minute',
                names: namesList.time_min,
                func: (x) => {
                    return x * 1440;
                },
                text: 'x*1440'
            },
            {
                to: 'Hour',
                names: namesList.time_hr,
                func: (x) => {
                    return x * 24;
                },
                text: 'x*24'
            },
            {
                to: 'Day',
                names: namesList.time_d,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Week',
                names: namesList.time_wk,
                func: (x) => {
                    return x / 7;
                },
                text: 'x/7'
            },
            {
                to: 'Fortnight',
                names: namesList.time_fn,
                func: (x) => {
                    return x / 14;
                },
                text: 'x/14'
            },
            {
                to: 'Month',
                names: namesList.time_mth,
                func: (x) => {
                    return x / 30.4167;
                },
                text: 'x/30.4167'
            },
            {
                to: 'Quarantine',
                names: namesList.time_qua,
                func: (x) => {
                    return x / 40;
                },
                text: 'x/40'
            },
            {
                to: 'Year',
                names: namesList.time_yr,
                func: (x) => {
                    return x / 365.25;
                },
                text: 'x/365.25'
            },
            {
                to: 'Decade',
                names: namesList.time_dec,
                func: (x) => {
                    return x / 365.25 / 10;
                },
                text: 'x/365.25/10'
            },
            {
                to: 'Century',
                names: namesList.time_cen,
                func: (x) => {
                    return x / 365.25 / 100;
                },
                text: 'x/365.25/100'
            },
            {
                to: 'Millennium',
                names: namesList.time_mil,
                func: (x) => {
                    return x / 365.25 / 1e3;
                },
                text: 'x/365.25/1000'
            },
            {
                to: 'Megaannum',
                names: namesList.time_ma,
                func: (x) => {
                    return x / 365.25 / 1e6;
                },
                text: 'x/365.25/1e6'
            },
            {
                to: 'Eon',
                names: namesList.time_eon,
                func: (x) => {
                    return x / 365.25 / 1e9;
                },
                text: 'x/365.25/1e9'
            },
            toArbitrary
        ]
    },
    {
        name: 'Week',
        names: namesList.time_wk,
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: namesList.time_s,
                func: (x) => {
                    return x * 604800;
                },
                text: 'x*604800'
            },
            {
                to: 'Minute',
                names: namesList.time_min,
                func: (x) => {
                    return x * 10080;
                },
                text: 'x*10080'
            },
            {
                to: 'Hour',
                names: namesList.time_hr,
                func: (x) => {
                    return x * 168;
                },
                text: 'x*168'
            },
            {
                to: 'Day',
                names: namesList.time_d,
                func: (x) => {
                    return x * 7;
                },
                text: 'x*7'
            },
            {
                to: 'Week',
                names: namesList.time_wk,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Fortnight',
                names: namesList.time_fn,
                func: (x) => {
                    return x / 2;
                },
                text: 'x/2'
            },
            {
                to: 'Month',
                names: namesList.time_mth,
                func: (x) => {
                    return x / 4.34524;
                },
                text: 'x/4.34524'
            },
            {
                to: 'Quarantine',
                names: namesList.time_qua,
                func: (x) => {
                    return x * 7 / 40;
                },
                text: 'x*7/40'
            },
            {
                to: 'Year',
                names: namesList.time_yr,
                func: (x) => {
                    return x / 52.1785714286;
                },
                text: 'x/52.1785714286'
            },
            {
                to: 'Decade',
                names: namesList.time_dec,
                func: (x) => {
                    return x / 52.1785714286 / 10;
                },
                text: 'x/52.1785714286/10'
            },
            {
                to: 'Century',
                names: namesList.time_cen,
                func: (x) => {
                    return x / 52.1785714286 / 100;
                },
                text: 'x/52.1785714286/100'
            },
            {
                to: 'Millennium',
                names: namesList.time_mil,
                func: (x) => {
                    return x / 52.1785714286 / 1e3;
                },
                text: 'x/52.1785714286/1000'
            },
            {
                to: 'Megaannum',
                names: namesList.time_ma,
                func: (x) => {
                    return x / 52.1785714286 / 1e6;
                },
                text: 'x/52.1785714286/1e6'
            },
            {
                to: 'Eon',
                names: namesList.time_eon,
                func: (x) => {
                    return x / 52.1785714286 / 1e9;
                },
                text: 'x/52.1785714286/1e9'
            },
            toArbitrary
        ]
    },
    {
        name: 'Fortnight',
        names: namesList.time_fn,
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: namesList.time_s,
                func: (x) => {
                    return x * 604800 * 2;
                },
                text: 'x*604800*2'
            },
            {
                to: 'Minute',
                names: namesList.time_min,
                func: (x) => {
                    return x * 10080 * 2;
                },
                text: 'x*10080*2'
            },
            {
                to: 'Hour',
                names: namesList.time_hr,
                func: (x) => {
                    return x * 336;
                },
                text: 'x*336'
            },
            {
                to: 'Day',
                names: namesList.time_d,
                func: (x) => {
                    return x * 14;
                },
                text: 'x*14'
            },
            {
                to: 'Week',
                names: namesList.time_wk,
                func: (x) => {
                    return x * 2;
                },
                text: 'x*2'
            },
            {
                to: 'Fortnight',
                names: namesList.time_fn,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Month',
                names: namesList.time_mth,
                func: (x) => {
                    return x * 2 / 4.34524;
                },
                text: 'x*2/4.34524'
            },
            {
                to: 'Quarantine',
                names: namesList.time_qua,
                func: (x) => {
                    return x * 14 / 40;
                },
                text: 'x*14/40'
            },
            {
                to: 'Year',
                names: namesList.time_yr,
                func: (x) => {
                    return x / 26.0714285714;
                },
                text: 'x/26.0714285714'
            },
            {
                to: 'Decade',
                names: namesList.time_dec,
                func: (x) => {
                    return x / 26.0714285714 / 10;
                },
                text: 'x/26.0714285714/10'
            },
            {
                to: 'Century',
                names: namesList.time_cen,
                func: (x) => {
                    return x / 26.0714285714 / 100;
                },
                text: 'x/26.0714285714/100'
            },
            {
                to: 'Millennium',
                names: namesList.time_mil,
                func: (x) => {
                    return x / 26.0714285714 / 1e3;
                },
                text: 'x/26.0714285714/1000'
            },
            {
                to: 'Megaannum',
                names: namesList.time_ma,
                func: (x) => {
                    return x / 26.0714285714 / 1e6;
                },
                text: 'x/26.0714285714/1e6'
            },
            {
                to: 'Eon',
                names: namesList.time_eon,
                func: (x) => {
                    return x / 26.0714285714 / 1e9;
                },
                text: 'x/26.0714285714/1e9'
            },
            toArbitrary
        ]
    },
    {
        name: 'Month',
        names: namesList.time_mth,
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: namesList.time_s,
                func: (x) => {
                    return x * 2628002.88;
                },
                text: 'x*2628002.88'
            },
            {
                to: 'Minute',
                names: namesList.time_min,
                func: (x) => {
                    return x * 43800.048;
                },
                text: 'x*43800.048'
            },
            {
                to: 'Hour',
                names: namesList.time_hr,
                func: (x) => {
                    return x * 730.0008;
                },
                text: 'x*730.0008'
            },
            {
                to: 'Day',
                names: namesList.time_d,
                func: (x) => {
                    return x * 30.4167;
                },
                text: 'x*30.4167'
            },
            {
                to: 'Week',
                names: namesList.time_wk,
                func: (x) => {
                    return x * 4.34524;
                },
                text: 'x*4.34524'
            },
            {
                to: 'Fortnight',
                names: namesList.time_fn,
                func: (x) => {
                    return x * 4.34524 / 2;
                },
                text: 'x*4.34524/2'
            },
            {
                to: 'Month',
                names: namesList.time_mth,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Quarantine',
                names: namesList.time_qua,
                func: (x) => {
                    return x * 30.4167 / 40;
                },
                text: 'x*30.4167/40'
            },
            {
                to: 'Year',
                names: namesList.time_yr,
                func: (x) => {
                    return x / 12;
                },
                text: 'x/12'
            },
            {
                to: 'Decade',
                names: namesList.time_dec,
                func: (x) => {
                    return x / 12 / 10;
                },
                text: 'x/12/10'
            },
            {
                to: 'Century',
                names: namesList.time_cen,
                func: (x) => {
                    return x / 12 / 100;
                },
                text: 'x/12/100'
            },
            {
                to: 'Millennium',
                names: namesList.time_mil,
                func: (x) => {
                    return x / 12 / 1e3;
                },
                text: 'x/12/1000'
            },
            {
                to: 'Megaannum',
                names: namesList.time_ma,
                func: (x) => {
                    return x / 12 / 1e6;
                },
                text: 'x/12/1e6'
            },
            {
                to: 'Eon',
                names: namesList.time_eon,
                func: (x) => {
                    return x / 12 / 1e9;
                },
                text: 'x/12/1e9'
            },
            toArbitrary
        ]
    },
    { // 40 days
        name: 'Quarantine',
        names: namesList.time_qua,
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: namesList.time_s,
                func: (x) => {
                    return x * 86400 * 40;
                },
                text: 'x*86400*40'
            },
            {
                to: 'Minute',
                names: namesList.time_min,
                func: (x) => {
                    return x * 1440 * 40;
                },
                text: 'x*1440*40'
            },
            {
                to: 'Hour',
                names: namesList.time_hr,
                func: (x) => {
                    return x * 24 * 40;
                },
                text: 'x*24*40'
            },
            {
                to: 'Day',
                names: namesList.time_d,
                func: (x) => {
                    return x * 40;
                },
                text: 'x*40'
            },
            {
                to: 'Week',
                names: namesList.time_wk,
                func: (x) => {
                    return x * 40 / 7;
                },
                text: 'x/7*40'
            },
            {
                to: 'Fortnight',
                names: namesList.time_fn,
                func: (x) => {
                    return x / 14 * 40;
                },
                text: 'x/14*40'
            },
            {
                to: 'Month',
                names: namesList.time_mth,
                func: (x) => {
                    return x * 40 / 30.4167;
                },
                text: 'x*40/30.4167'
            },
            {
                to: 'Quarantine',
                names: namesList.time_qua,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Year',
                names: namesList.time_yr,
                func: (x) => {
                    return x * 40 / 365.25;
                },
                text: 'x*40/365.25'
            },
            {
                to: 'Decade',
                names: namesList.time_dec,
                func: (x) => {
                    return x * 40 / 365.25 / 10;
                },
                text: 'x*40/365.25/10'
            },
            {
                to: 'Century',
                names: namesList.time_cen,
                func: (x) => {
                    return x * 40 / 365.25 / 100;
                },
                text: 'x*40/365.25/100'
            },
            {
                to: 'Millennium',
                names: namesList.time_mil,
                func: (x) => {
                    return x * 40 / 365.25 / 1e3;
                },
                text: 'x*40/365.25/1000'
            },
            {
                to: 'Megaannum',
                names: namesList.time_ma,
                func: (x) => {
                    return x * 40 / 365.25 / 1e6;
                },
                text: 'x*40/365.25/1e6'
            },
            {
                to: 'Eon',
                names: namesList.time_eon,
                func: (x) => {
                    return x * 40 / 365.25 / 1e9;
                },
                text: 'x*40/365.25/1e9'
            },
            toArbitrary
        ]
    },
    {
        name: 'Year',
        names: namesList.time_yr,
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: namesList.time_s,
                func: (x) => {
                    return x * 31557600;
                },
                text: 'x*31557600'
            },
            {
                to: 'Minute',
                names: namesList.time_min,
                func: (x) => {
                    return x * 525960;
                },
                text: 'x*525960'
            },
            {
                to: 'Hour',
                names: namesList.time_hr,
                func: (x) => {
                    return x * 8766;
                },
                text: 'x*8766'
            },
            {
                to: 'Day',
                names: namesList.time_d,
                func: (x) => {
                    return x * 365.25;
                },
                text: 'x*365.25'
            },
            {
                to: 'Week',
                names: namesList.time_wk,
                func: (x) => {
                    return x * 52.1785714286;
                },
                text: 'x*52.1785714286'
            },
            {
                to: 'Fortnight',
                names: namesList.time_fn,
                func: (x) => {
                    return x * 26.071;
                },
                text: 'x*26.071'
            },
            {
                to: 'Month',
                names: namesList.time_mth,
                func: (x) => {
                    return x * 12;
                },
                text: 'x*12'
            },
            {
                to: 'Quarantine',
                names: namesList.time_qua,
                func: (x) => {
                    return x * 52.1785714286 / 40;
                },
                text: 'x*52.1785714286/40'
            },
            {
                to: 'Year',
                names: namesList.time_yr,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Decade',
                names: namesList.time_dec,
                func: (x) => {
                    return x / 10;
                },
                text: 'x/10'
            },
            {
                to: 'Century',
                names: namesList.time_cen,
                func: (x) => {
                    return x / 100;
                },
                text: 'x/100'
            },
            {
                to: 'Millennium',
                names: namesList.time_mil,
                func: (x) => {
                    return x / 1e3;
                },
                text: 'x/1000'
            },
            {
                to: 'Megaannum',
                names: namesList.time_ma,
                func: (x) => {
                    return x / 1e6;
                },
                text: 'x/1e6'
            },
            {
                to: 'Eon',
                names: namesList.time_eon,
                func: (x) => {
                    return x / 1e9;
                },
                text: 'x/1e9'
            },
            toArbitrary
        ]
    },
    { // 10 yr
        name: 'Decade',
        names: namesList.time_dec,
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: namesList.time_s,
                func: (x) => {
                    return x * 31557600 * 10;
                },
                text: 'x*31557600*10'
            },
            {
                to: 'Minute',
                names: namesList.time_min,
                func: (x) => {
                    return x * 525960 * 10;
                },
                text: 'x*525960*10'
            },
            {
                to: 'Hour',
                names: namesList.time_hr,
                func: (x) => {
                    return x * 8766 * 10;
                },
                text: 'x*8766*10'
            },
            {
                to: 'Day',
                names: namesList.time_d,
                func: (x) => {
                    return x * 365.25 * 10;
                },
                text: 'x*365.25*10'
            },
            {
                to: 'Week',
                names: namesList.time_wk,
                func: (x) => {
                    return x * 52.1785714286 * 10;
                },
                text: 'x*52.1785714286*10'
            },
            {
                to: 'Fortnight',
                names: namesList.time_fn,
                func: (x) => {
                    return x * 26.0714285714 * 10;
                },
                text: 'x*26.0714285714*10'
            },
            {
                to: 'Month',
                names: namesList.time_mth,
                func: (x) => {
                    return x * 12 * 10;
                },
                text: 'x*12*10'
            },
            {
                to: 'Quarantine',
                names: namesList.time_qua,
                func: (x) => {
                    return x * 52.1785714286 / 40 * 10;
                },
                text: 'x*52.1785714286/40*10'
            },
            {
                to: 'Year',
                names: namesList.time_yr,
                func: (x) => {
                    return x * 10;
                },
                text: 'x*10'
            },
            {
                to: 'Decade',
                names: namesList.time_dec,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Century',
                names: namesList.time_cen,
                func: (x) => {
                    return x / 10;
                },
                text: 'x/10'
            },
            {
                to: 'Millennium',
                names: namesList.time_mil,
                func: (x) => {
                    return x / 100;
                },
                text: 'x/100'
            },
            {
                to: 'Megaannum',
                names: namesList.time_ma,
                func: (x) => {
                    return x / 100000;
                },
                text: 'x/100000'
            },
            {
                to: 'Eon',
                names: namesList.time_eon,
                func: (x) => {
                    return x / 1e6;
                },
                text: 'x/1e6'
            },
            toArbitrary
        ]
    },
    { // 100 yr
        name: 'Century',
        names: namesList.time_cen,
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: namesList.time_s,
                func: (x) => {
                    return x * 31557600 * 100;
                },
                text: 'x*31557600*100'
            },
            {
                to: 'Minute',
                names: namesList.time_min,
                func: (x) => {
                    return x * 525960 * 100;
                },
                text: 'x*525960*100'
            },
            {
                to: 'Hour',
                names: namesList.time_hr,
                func: (x) => {
                    return x * 8766 * 100;
                },
                text: 'x*8766*100'
            },
            {
                to: 'Day',
                names: namesList.time_d,
                func: (x) => {
                    return x * 365.25 * 100;
                },
                text: 'x*365.25*100'
            },
            {
                to: 'Week',
                names: namesList.time_wk,
                func: (x) => {
                    return x * 52.1785714286 * 100;
                },
                text: 'x*52.1785714286*100'
            },
            {
                to: 'Fortnight',
                names: namesList.time_fn,
                func: (x) => {
                    return x * 26.0714285714 * 100;
                },
                text: 'x*26.0714285714*100'
            },
            {
                to: 'Month',
                names: namesList.time_mth,
                func: (x) => {
                    return x * 12 * 100;
                },
                text: 'x*12*100'
            },
            {
                to: 'Quarantine',
                names: namesList.time_qua,
                func: (x) => {
                    return x * 52.1785714286 / 40 * 100;
                },
                text: 'x*52.1785714286/40*100'
            },
            {
                to: 'Year',
                names: namesList.time_yr,
                func: (x) => {
                    return x * 100;
                },
                text: 'x*100'
            },
            {
                to: 'Decade',
                names: namesList.time_dec,
                func: (x) => {
                    return x * 10;
                },
                text: 'x*10'
            },
            {
                to: 'Century',
                names: namesList.time_cen,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Millennium',
                names: namesList.time_mil,
                func: (x) => {
                    return x / 10;
                },
                text: 'x/10'
            },
            {
                to: 'Megaannum',
                names: namesList.time_ma,
                func: (x) => {
                    return x / 10000;
                },
                text: 'x/10000'
            },
            {
                to: 'Eon',
                names: namesList.time_eon,
                func: (x) => {
                    return x / 1e6;
                },
                text: 'x/1e6'
            },
            toArbitrary
        ]
    },
    { // 1 000 yr
        name: 'Millennium',
        names: namesList.time_mil,
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: namesList.time_s,
                func: (x) => {
                    return x * 31557600 * 1e3;
                },
                text: 'x*31557600 *1000'
            },
            {
                to: 'Minute',
                names: namesList.time_min,
                func: (x) => {
                    return x * 525960 * 1e3;
                },
                text: 'x*525960 *1000'
            },
            {
                to: 'Hour',
                names: namesList.time_hr,
                func: (x) => {
                    return x * 8766 * 1e3;
                },
                text: 'x*8766 *1000'
            },
            {
                to: 'Day',
                names: namesList.time_d,
                func: (x) => {
                    return x * 365.25 * 1e3;
                },
                text: 'x*365.25'
            },
            {
                to: 'Week',
                names: namesList.time_wk,
                func: (x) => {
                    return x * 52.1785714286 * 1e3;
                },
                text: 'x*52.1785714286 *1000'
            },
            {
                to: 'Fortnight',
                names: namesList.time_fn,
                func: (x) => {
                    return x * 26.0714285714 * 1e3;
                },
                text: 'x*26.0714285714*1000'
            },
            {
                to: 'Month',
                names: namesList.time_mth,
                func: (x) => {
                    return x * 12 * 1e3;
                },
                text: 'x*12 *1000'
            },
            {
                to: 'Quarantine',
                names: namesList.time_qua,
                func: (x) => {
                    return x * 52.1785714286 / 40 * 1e3;
                },
                text: 'x*52.1785714286/40 *1000'
            },
            {
                to: 'Year',
                names: namesList.time_yr,
                func: (x) => {
                    return x * 1e3;
                },
                text: 'x *1000'
            },
            {
                to: 'Decade',
                names: namesList.time_dec,
                func: (x) => {
                    return x * 100;
                },
                text: 'x*100'
            },
            {
                to: 'Century',
                names: namesList.time_cen,
                func: (x) => {
                    return x * 10;
                },
                text: 'x*10'
            },
            {
                to: 'Millennium',
                names: namesList.time_mil,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Megaannum',
                names: namesList.time_ma,
                func: (x) => {
                    return x / 1e3;
                },
                text: 'x/1000'
            },
            {
                to: 'Eon',
                names: namesList.time_eon,
                func: (x) => {
                    return x / 1e6;
                },
                text: 'x/1e6'
            },
            toArbitrary
        ]
    },
    { // 1 000 000 yr
        name: 'Megaannum',
        names: namesList.time_ma,
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: namesList.time_s,
                func: (x) => {
                    return x * 31557600 * 1e6;
                },
                text: 'x*31557600*1e6'
            },
            {
                to: 'Minute',
                names: namesList.time_min,
                func: (x) => {
                    return x * 525960 * 1e6;
                },
                text: 'x*525960*1e6'
            },
            {
                to: 'Hour',
                names: namesList.time_hr,
                func: (x) => {
                    return x * 8766 * 1e6;
                },
                text: 'x*8766*1e6'
            },
            {
                to: 'Day',
                names: namesList.time_d,
                func: (x) => {
                    return x * 365.25 * 1e6;
                },
                text: 'x*365.25*1e6'
            },
            {
                to: 'Week',
                names: namesList.time_wk,
                func: (x) => {
                    return x * 52.1785714286 * 1e6;
                },
                text: 'x*52.1785714286*1e6'
            },
            {
                to: 'Fortnight',
                names: namesList.time_fn,
                func: (x) => {
                    return x * 26.0714285714 * 1e6;
                },
                text: 'x*26.0714285714*1e6'
            },
            {
                to: 'Month',
                names: namesList.time_mth,
                func: (x) => {
                    return x * 12 * 1e6;
                },
                text: 'x*12*1e6'
            },
            {
                to: 'Quarantine',
                names: namesList.time_qua,
                func: (x) => {
                    return x * 52.1785714286 / 40 * 1e6;
                },
                text: 'x*52.1785714286/40*1e6'
            },
            {
                to: 'Decade',
                names: namesList.time_dec,
                func: (x) => {
                    return x * 100000;
                },
                text: 'x*100000'
            },
            {
                to: 'Century',
                names: namesList.time_cen,
                func: (x) => {
                    return x * 10000;
                },
                text: 'x*10000'
            },
            {
                to: 'Millennium',
                names: namesList.time_mil,
                func: (x) => {
                    return x * 1e3;
                },
                text: 'x*1000'
            },
            {
                to: 'Megaannum',
                names: namesList.time_ma,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Eon',
                names: namesList.time_eon,
                func: (x) => {
                    return x / 1e3;
                },
                text: 'x/1000'
            },
            toArbitrary
        ]
    },
    { // 1e9 yr
        name: 'Eon',
        names: namesList.time_eon,
        type: 'Time',
        system: 'N/A',
        calc: [
            {
                to: 'Second',
                names: namesList.time_s,
                func: (x) => {
                    return x * 31557600 * 1e9;
                },
                text: 'x*31557600*1e9'
            },
            {
                to: 'Minute',
                names: namesList.time_min,
                func: (x) => {
                    return x * 525960 * 1e9;
                },
                text: 'x*525960*1e9'
            },
            {
                to: 'Hour',
                names: namesList.time_hr,
                func: (x) => {
                    return x * 8766 * 1e9;
                },
                text: 'x*8766*1e9'
            },
            {
                to: 'Day',
                names: namesList.time_d,
                func: (x) => {
                    return x * 365.25 * 1e9;
                },
                text: 'x*365.25*1e9'
            },
            {
                to: 'Week',
                names: namesList.time_wk,
                func: (x) => {
                    return x * 52.1785714286 * 1e9;
                },
                text: 'x*52.1785714286*1e9'
            },
            {
                to: 'Fortnight',
                names: namesList.time_fn,
                func: (x) => {
                    return x * 26.0714285714 * 1e9;
                },
                text: 'x*26.0714285714*1e9'
            },
            {
                to: 'Month',
                names: namesList.time_mth,
                func: (x) => {
                    return x * 12 * 1e9;
                },
                text: 'x*12*1e9'
            },
            {
                to: 'Quarantine',
                names: namesList.time_qua,
                func: (x) => {
                    return x * 52.1785714286 / 40 * 1e9;
                },
                text: 'x*52.1785714286/40*1e9'
            },
            {
                to: 'Year',
                names: namesList.time_yr,
                func: (x) => {
                    return x * 1e9;
                },
                text: 'x*1e9'
            },
            {
                to: 'Decade',
                names: namesList.time_dec,
                func: (x) => {
                    return x * 1e8;
                },
                text: 'x*1e8'
            },
            {
                to: 'Century',
                names: namesList.time_cen,
                func: (x) => {
                    return x * 1e7;
                },
                text: 'x*1e7'
            },
            {
                to: 'Millennium',
                names: namesList.time_mil,
                func: (x) => {
                    return x * 1e6;
                },
                text: 'x*1e6'
            },
            {
                to: 'Megaannum',
                names: namesList.time_ma,
                func: (x) => {
                    return x * 1e3;
                },
                text: 'x*1000'
            },
            {
                to: 'Eon',
                names: namesList.time_eon,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            toArbitrary
        ]
    },
    // Volume
    {
        name: 'Teaspoon',
        names: namesList.vol_tsp,
        type: 'Volume',
        system: 'Imperial',
        calc: [
            {
                to: 'Teaspoon',
                names: namesList.vol_tsp,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Tablespoon',
                names: namesList.vol_tbp,
                func: (x) => {
                    return x / 3;
                },
                text: 'x/3'
            },
            {
                to: 'Fluid Ounce',
                names: namesList.vol_floz,
                func: (x) => {
                    return x;
                },
                text: 'x/6'
            },
            {
                to: 'Cup',
                names: namesList.vol_c,
                func: (x) => {
                    return x / 48.692;
                },
                text: 'x/48.692'
            },
            {
                to: 'Pint',
                names: namesList.vol_pt,
                func: (x) => {
                    return x / 96;
                },
                text: 'x/96'
            },
            {
                to: 'Litre',
                names: namesList.vol_l,
                func: (x) => {
                    return x / 202.884;
                },
                text: 'x/202.884'
            },
            {
                to: 'Gallon',
                names: namesList.vol_gal,
                func: (x) => {
                    return x / 768;
                },
                text: 'x/768'
            },
            {
                to: 'Cubic Metre',
                names: namesList.vol_m3,
                func: (x) => {
                    return x / 202884.2;
                },
                text: 'x/202884.2'
            },
            toArbitrary
        ]
    },
    {
        name: 'Tablespoon',
        names: namesList.vol_tbp,
        type: 'Volume',
        system: 'Imperial',
        calc: [
            {
                to: 'Teaspoon',
                names: namesList.vol_tsp,
                func: (x) => {
                    return x * 3;
                },
                text: 'x*3'
            },
            {
                to: 'Tablespoon',
                names: namesList.vol_tbp,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Fluid Ounce',
                names: namesList.vol_floz,
                func: (x) => {
                    return x / 2;
                },
                text: 'x/2'
            },
            {
                to: 'Cup',
                names: namesList.vol_c,
                func: (x) => {
                    return x / 16.231;
                },
                text: 'x/16.231'
            },
            {
                to: 'Pint',
                names: namesList.vol_pt,
                func: (x) => {
                    return x / 32;
                },
                text: 'x/32'
            },
            {
                to: 'Litre',
                names: namesList.vol_l,
                func: (x) => {
                    return x / 67.628;
                },
                text: 'x/67.628'
            },
            {
                to: 'Gallon',
                names: namesList.vol_gal,
                func: (x) => {
                    return x / 256;
                },
                text: 'x/256'
            },
            {
                to: 'Cubic Metre',
                names: namesList.vol_m3,
                func: (x) => {
                    return x / 67628.05;
                },
                text: 'x/67628.05'
            },
            toArbitrary
        ]
    },
    {
        name: 'Fluid Ounce',
        names: namesList.vol_floz,
        type: 'Volume',
        system: 'Imperial',
        calc: [
            {
                to: 'Teaspoon',
                names: namesList.vol_tsp,
                func: (x) => {
                    return x * 6;
                },
                text: 'x*6'
            },
            {
                to: 'Tablespoon',
                names: namesList.vol_tbp,
                func: (x) => {
                    return x * 2;
                },
                text: 'x*2'
            },
            {
                to: 'Fluid Ounce',
                names: namesList.vol_floz,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Cup',
                names: namesList.vol_c,
                func: (x) => {
                    return x / 8.115;
                },
                text: 'x/8.115'
            },
            {
                to: 'Pint',
                names: namesList.vol_pt,
                func: (x) => {
                    return x / 16;
                },
                text: 'x/16'
            },
            {
                to: 'Litre',
                names: namesList.vol_l,
                func: (x) => {
                    return x / 33.814;
                },
                text: 'x/33.814'
            },
            {
                to: 'Gallon',
                names: namesList.vol_gal,
                func: (x) => {
                    return x / 128;
                },
                text: 'x/128'
            },
            {
                to: 'Cubic Metre',
                names: namesList.vol_m3,
                func: (x) => {
                    return x / 33814;
                },
                text: 'x/33814'
            },
            toArbitrary
        ]
    },
    {
        name: 'Cup',
        names: namesList.vol_c,
        type: 'Volume',
        system: 'Imperial',
        calc: [
            {
                to: 'Teaspoon',
                names: namesList.vol_tsp,
                func: (x) => {
                    return x * 48.692;
                },
                text: 'x*48.692'
            },
            {
                to: 'Tablespoon',
                names: namesList.vol_tbp,
                func: (x) => {
                    return x * 16.231;
                },
                text: 'x*16.231'
            },
            {
                to: 'Fluid Ounce',
                names: namesList.vol_floz,
                func: (x) => {
                    return x * 8.115;
                },
                text: 'x*8.115'
            },
            {
                to: 'Cup',
                names: namesList.vol_c,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Pint',
                names: namesList.vol_pt,
                func: (x) => {
                    return x / 1.972;
                },
                text: 'x/1.972'
            },
            {
                to: 'Litre',
                names: namesList.vol_l,
                func: (x) => {
                    return x / 4.167;
                },
                text: 'x/4.167'
            },
            {
                to: 'Gallon',
                names: namesList.vol_gal,
                func: (x) => {
                    return x / 15.772;
                },
                text: 'x/15.772'
            },
            {
                to: 'Cubic Metre',
                names: namesList.vol_m3,
                func: (x) => {
                    return x / 4167;
                },
                text: 'x/4167'
            },
            toArbitrary
        ]
    },
    {
        name: 'Pint',
        names: namesList.vol_pt,
        type: 'Volume',
        system: 'Imperial',
        calc: [
            {
                to: 'Teaspoon',
                names: namesList.vol_tsp,
                func: (x) => {
                    return x * 96;
                },
                text: 'x*96'
            },
            {
                to: 'Tablespoon',
                names: namesList.vol_tbp,
                func: (x) => {
                    return x * 32;
                },
                text: 'x*32'
            },
            {
                to: 'Fluid Ounce',
                names: namesList.vol_floz,
                func: (x) => {
                    return x * 16;
                },
                text: 'x*16'
            },
            {
                to: 'Cup',
                names: namesList.vol_c,
                func: (x) => {
                    return x * 1.972;
                },
                text: 'x*1.972'
            },
            {
                to: 'Pint',
                names: namesList.vol_pt,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Litre',
                names: namesList.vol_l,
                func: (x) => {
                    return x / 2.113;
                },
                text: 'x/2.113'
            },
            {
                to: 'Gallon',
                names: namesList.vol_gal,
                func: (x) => {
                    return x / 8;
                },
                text: 'x/8'
            },
            {
                to: 'Cubic Metre',
                names: namesList.vol_m3,
                func: (x) => {
                    return x / 33814;
                },
                text: 'x/33814'
            },
            toArbitrary
        ]
    },
    {
        name: 'Litre',
        names: namesList.vol_l,
        type: 'Volume',
        system: 'Metric',
        calc: [
            {
                to: 'Teaspoon',
                names: namesList.vol_tsp,
                func: (x) => {
                    return x * 202.884;
                },
                text: 'x*202.884'
            },
            {
                to: 'Tablespoon',
                names: namesList.vol_tbp,
                func: (x) => {
                    return x * 67.628;
                },
                text: 'x*67.628'
            },
            {
                to: 'Fluid Ounce',
                names: namesList.vol_floz,
                func: (x) => {
                    return x * 33.814;
                },
                text: 'x*33.814'
            },
            {
                to: 'Cup',
                names: namesList.vol_c,
                func: (x) => {
                    return x * 33.814 / 8.115;
                },
                text: 'x*33.814/8.115'
            },
            {
                to: 'Pint',
                names: namesList.vol_pt,
                func: (x) => {
                    return x * 33.814 / 16;
                },
                text: 'x*33.814/16'
            },
            {
                to: 'Litre',
                names: namesList.vol_l,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Gallon',
                names: namesList.vol_gal,
                func: (x) => {
                    return x * 33.814 / 128;
                },
                text: 'x*33.814/128'
            },
            {
                to: 'Cubic Metre',
                names: namesList.vol_m3,
                func: (x) => {
                    return x / 1e3;
                },
                text: 'x/1000'
            },
            toArbitrary
        ]
    },
    {
        name: 'Gallon',
        names: namesList.vol_gal,
        type: 'Volume',
        system: 'Imperial',
        calc: [
            {
                to: 'Teaspoon',
                names: namesList.vol_tsp,
                func: (x) => {
                    return x * 768;
                },
                text: 'x*768'
            },
            {
                to: 'Tablespoon',
                names: namesList.vol_tbp,
                func: (x) => {
                    return x * 256;
                },
                text: 'x*256'
            },
            {
                to: 'Fluid Ounce',
                names: namesList.vol_floz,
                func: (x) => {
                    return x * 128;
                },
                text: 'x*128'
            },
            {
                to: 'Cup',
                names: namesList.vol_c,
                func: (x) => {
                    return x * 15.7725;
                },
                text: 'x*15.7725'
            },
            {
                to: 'Pint',
                names: namesList.vol_pt,
                func: (x) => {
                    return x * 8;
                },
                text: 'x*8'
            },
            {
                to: 'Litre',
                names: namesList.vol_l,
                func: (x) => {
                    return x * 3.785;
                },
                text: 'x*3.785'
            },
            {
                to: 'Gallon',
                names: namesList.vol_gal,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Cubic Metre',
                names: namesList.vol_m3,
                func: (x) => {
                    return x / 264.2;
                },
                text: 'x/264.2'
            },
            toArbitrary
        ]
    },
    {
        name: 'Cubic Metre',
        names: namesList.vol_m3,
        type: 'Volume',
        system: 'Metric',
        calc: [
            {
                to: 'Teaspoon',
                names: namesList.vol_tsp,
                func: (x) => {
                    return x * 202884;
                },
                text: 'x*202884'
            },
            {
                to: 'Tablespoon',
                names: namesList.vol_tbp,
                func: (x) => {
                    return x * 67628;
                },
                text: 'x*67628'
            },
            {
                to: 'Fluid Ounce',
                names: namesList.vol_floz,
                func: (x) => {
                    return x * 33814;
                },
                text: 'x*33814'
            },
            {
                to: 'Cup',
                names: namesList.vol_c,
                func: (x) => {
                    return x * 33814 / 8.115;
                },
                text: 'x*33814/8.115'
            },
            {
                to: 'Pint',
                names: namesList.vol_pt,
                func: (x) => {
                    return x * 33814 / 16;
                },
                text: 'x*33814/16'
            },
            {
                to: 'Litre',
                names: namesList.vol_l,
                func: (x) => {
                    return x * 1e3;
                },
                text: 'x*1000'
            },
            {
                to: 'Gallon',
                names: namesList.vol_gal,
                func: (x) => {
                    return x * 33814 / 128;
                },
                text: 'x*33814/128'
            },
            {
                to: 'Cubic Metre',
                names: namesList.vol_m3,
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
        names: namesList.mass_g,
        type: 'Mass',
        system: 'Metric',
        calc: [
            {
                to: 'Gram',
                names: namesList.mass_g,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Ounce',
                names: namesList.mass_oz,
                func: (x) => {
                    return x / 28.35;
                },
                text: 'x/28.35'
            },
            {
                to: 'Pound',
                names: namesList.mass_lb,
                func: (x) => {
                    return x / 453.592;
                },
                text: 'x/453.592'
            },
            {
                to: 'Stone',
                names: namesList.mass_st,
                func: (x) => {
                    return x / 6350.29;
                },
                text: 'x/6350.29'
            },
            {
                to: 'US Ton',
                names: namesList.mass_t,
                func: (x) => {
                    return x / 907185;
                },
                text: 'x/907185'
            },
            {
                to: 'Metric Tonne',
                names: namesList.mass_mt,
                func: (x) => {
                    return x / 1e6;
                },
                text: 'x/1e6'
            },
            toArbitrary
        ]
    },
    {
        name: 'Ounce',
        names: namesList.mass_oz,
        type: 'Mass',
        system: 'Imperial',
        calc: [
            {
                to: 'Gram',
                names: namesList.mass_g,
                func: (x) => {
                    return x * 28.35;
                },
                text: 'x*28.35'
            },
            {
                to: 'Ounce',
                names: namesList.mass_oz,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Pound',
                names: namesList.mass_lb,
                func: (x) => {
                    return x / 16;
                },
                text: 'x/16'
            },
            {
                to: 'Stone',
                names: namesList.mass_st,
                func: (x) => {
                    return x / 224;
                },
                text: 'x/224'
            },
            {
                to: 'US Ton',
                names: namesList.mass_t,
                func: (x) => {
                    return x / 32000;
                },
                text: 'x/32000'
            },
            {
                to: 'Metric Tonne',
                names: namesList.mass_mt,
                func: (x) => {
                    return x / 35274;
                },
                text: 'x/35274'
            },
            toArbitrary
        ]
    },
    {
        name: 'Pound',
        names: namesList.mass_lb,
        type: 'Mass',
        system: 'Imperial',
        calc: [
            {
                to: 'Gram',
                names: namesList.mass_g,
                func: (x) => {
                    return x * 453.592;
                },
                text: 'x*453.592'
            },
            {
                to: 'Ounce',
                names: namesList.mass_oz,
                func: (x) => {
                    return x * 16;
                },
                text: 'x*16'
            },
            {
                to: 'Pound',
                names: namesList.mass_lb,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Stone',
                names: namesList.mass_st,
                func: (x) => {
                    return x / 14;
                },
                text: 'x/14'
            },
            {
                to: 'US Ton',
                names: namesList.mass_t,
                func: (x) => {
                    return x / 2000;
                },
                text: 'x/2000'
            },
            {
                to: 'Metric Tonne',
                names: namesList.mass_mt,
                func: (x) => {
                    return x / 2205;
                },
                text: 'x/2205'
            },
            toArbitrary
        ]
    },
    {
        name: 'Stone',
        names: namesList.mass_st,
        type: 'Mass',
        system: 'Imperial',
        calc: [
            {
                to: 'Gram',
                names: namesList.mass_g,
                func: (x) => {
                    return x * 6350.29;
                },
                text: 'x*6350.29'
            },
            {
                to: 'Ounce',
                names: namesList.mass_oz,
                func: (x) => {
                    return x * 224;
                },
                text: 'x*224'
            },
            {
                to: 'Pound',
                names: namesList.mass_lb,
                func: (x) => {
                    return x * 14;
                },
                text: 'x*14'
            },
            {
                to: 'Stone',
                names: namesList.mass_st,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'US Ton',
                names: namesList.mass_t,
                func: (x) => {
                    return x * 0.007;
                },
                text: 'x*0.007'
            },
            {
                to: 'Metric Tonne',
                names: namesList.mass_mt,
                func: (x) => {
                    return x / 157.473;
                },
                text: 'x/157.473'
            },
            toArbitrary
        ]
    },
    {
        name: 'US Ton',
        names: namesList.mass_t,
        type: 'Mass',
        system: 'Imperial',
        calc: [
            {
                to: 'Gram',
                names: namesList.mass_g,
                func: (x) => {
                    return x * 907185;
                },
                text: 'x*907185'
            },
            {
                to: 'Ounce',
                names: namesList.mass_oz,
                func: (x) => {
                    return x * 32000;
                },
                text: 'x*32000'
            },
            {
                to: 'Pound',
                names: namesList.mass_lb,
                func: (x) => {
                    return x * 2000;
                },
                text: 'x*2000'
            },
            {
                to: 'Stone',
                names: namesList.mass_st,
                func: (x) => {
                    return x / 0.007;
                },
                text: 'x/0.007'
            },
            {
                to: 'US Ton',
                names: namesList.mass_t,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Metric Tonne',
                names: namesList.mass_mt,
                func: (x) => {
                    return x / 1.102;
                },
                text: 'x/1.102'
            },
            toArbitrary
        ]
    },
    {
        name: 'Metric Tonne',
        names: namesList.mass_mt,
        type: 'Mass',
        system: 'Metric',
        calc: [
            {
                to: 'Gram',
                names: namesList.mass_g,
                func: (x) => {
                    return x * 1e6;
                },
                text: 'x*1e6'
            },
            {
                to: 'Ounce',
                names: namesList.mass_oz,
                func: (x) => {
                    return x * 35274;
                },
                text: 'x*35274'
            },
            {
                to: 'Pound',
                names: namesList.mass_lb,
                func: (x) => {
                    return x * 2204.62;
                },
                text: 'x*2204.62'
            },
            {
                to: 'Stone',
                names: namesList.mass_st,
                func: (x) => {
                    return x * 157.473;
                },
                text: 'x*157.473'
            },
            {
                to: 'US Ton',
                names: namesList.mass_t,
                func: (x) => {
                    return x * 1.102;
                },
                text: 'x*1.102'
            },
            {
                to: 'Metric Tonne',
                names: namesList.mass_mt,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            toArbitrary
        ]
    },
    // Pressure
    {
        name: 'Pascal',
        names: namesList.pres_pa,
        type: 'Pressure',
        system: 'Metric',
        calc: [
            {
                to: 'Pascal',
                names: namesList.pres_pa,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'mmHg',
                names: namesList.pres_mmHg,
                func: (x) => {
                    return x / 133.322;
                },
                text: 'x/133.322'
            },
            {
                to: 'psi',
                names: namesList.pres_psi,
                func: (x) => {
                    return x / 6894.76;
                },
                text: 'x/6894.76'
            },
            {
                to: 'Bar',
                names: namesList.pres_bar,
                func: (x) => {
                    return x / 100000;
                },
                text: 'x/100000'
            },
            {
                to: 'Standard Atmosphere',
                names: namesList.pres_atm,
                func: (x) => {
                    return x / 101325;
                },
                text: 'x/101325'
            },
            toArbitrary
        ]
    },
    {
        name: 'mmHg',
        names: namesList.pres_mmHg,
        type: 'Pressure',
        system: 'N/A',
        calc: [
            {
                to: 'Pascal',
                names: namesList.pres_pa,
                func: (x) => {
                    return x * 133.322;
                },
                text: 'x*133.322'
            },
            {
                to: 'mmHg',
                names: namesList.pres_mmHg,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'psi',
                names: namesList.pres_psi,
                func: (x) => {
                    return x / 51.7149;
                },
                text: 'x/51.7149'
            },
            {
                to: 'Bar',
                names: namesList.pres_bar,
                func: (x) => {
                    return x / 750.062;
                },
                text: 'x/750.062'
            },
            {
                to: 'Standard Atmosphere',
                names: namesList.pres_atm,
                func: (x) => {
                    return x / 760;
                },
                text: 'x/760'
            },
            toArbitrary
        ]
    },
    {
        name: 'psi',
        names: namesList.pres_psi,
        type: 'Pressure',
        system: 'Imperial',
        calc: [
            {
                to: 'Pascal',
                names: namesList.pres_pa,
                func: (x) => {
                    return x * 6894.76;
                },
                text: 'x*6894.76'
            },
            {
                to: 'mmHg',
                names: namesList.pres_mmHg,
                func: (x) => {
                    return x * 51.7149;
                },
                text: 'x*51.7149'
            },
            {
                to: 'psi',
                names: namesList.pres_psi,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Bar',
                names: namesList.pres_bar,
                func: (x) => {
                    return x / 14.504;
                },
                text: 'x/14.504'
            },
            {
                to: 'Standard Atmosphere',
                names: namesList.pres_atm,
                func: (x) => {
                    return x / 14.696;
                },
                text: 'x/14.696'
            },
            toArbitrary
        ]
    },
    {
        name: 'Bar',
        names: namesList.pres_bar,
        type: 'Pressure',
        system: 'Metric',
        calc: [
            {
                to: 'Pascal',
                names: namesList.pres_pa,
                func: (x) => {
                    return x * 100000;
                },
                text: 'x*100000'
            },
            {
                to: 'mmHg',
                names: namesList.pres_mmHg,
                func: (x) => {
                    return x * 750.062;
                },
                text: 'x*750.062'
            },
            {
                to: 'psi',
                names: namesList.pres_psi,
                func: (x) => {
                    return x * 14.504;
                },
                text: 'x*14.504'
            },
            {
                to: 'Bar',
                names: namesList.pres_bar,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Standard Atmosphere',
                names: namesList.pres_atm,
                func: (x) => {
                    return x / 1.013;
                },
                text: 'x/1.013'
            },
            toArbitrary
        ]
    },
    {
        name: 'Standard Atmosphere',
        names: namesList.pres_atm,
        type: 'Pressure',
        system: 'N/A',
        calc: [
            {
                to: 'Pascal',
                names: namesList.pres_pa,
                func: (x) => {
                    return x * 101325;
                },
                text: 'x*101325'
            },
            {
                to: 'mmHg',
                names: namesList.pres_mmHg,
                func: (x) => {
                    return x * 760;
                },
                text: 'x*760'
            },
            {
                to: 'psi',
                names: namesList.pres_psi,
                func: (x) => {
                    return x * 14.696;
                },
                text: 'x*14.696'
            },
            {
                to: 'Bar',
                names: namesList.pres_bar,
                func: (x) => {
                    return x * 1.013;
                },
                text: 'x*1.013'
            },
            {
                to: 'Standard Atmosphere',
                names: namesList.pres_atm,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            toArbitrary
        ]
    },
    //energy
    {
        name: 'Electron Volt',
        names: namesList.nrg_ev,
        type: 'Energy',
        system: 'N/A',
        calc: [
            {
                to: 'Electron Volt',
                names: namesList.nrg_ev,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Joule',
                names: namesList.nrg_j,
                func: (x) => {
                    return x / 6.242e18;
                },
                text: 'x/(6.242e18)'
            },
            {
                to: 'Calorie',
                names: namesList.nrg_cal,
                func: (x) => {
                    return x / 2.611e19;
                },
                text: 'x/(2.611e19)'
            },
            {
                to: 'British Thermal Unit',
                names: namesList.nrg_btu,
                func: (x) => {
                    return x / 6.585e21;
                },
                text: 'x/(6.585e21)'
            },
            {
                to: 'Watt Hour',
                names: namesList.nrg_wh,
                func: (x) => {
                    return x / 2.247e22;
                },
                text: 'x/(2.247e22)'
            },
            toArbitrary
        ]
    },
    {
        name: 'Joule',
        names: namesList.nrg_j,
        type: 'Energy',
        system: 'Metric',
        calc: [
            {
                to: 'Electron Volt',
                names: namesList.nrg_ev,
                func: (x) => {
                    return x * 6.242e18;
                },
                text: 'x*(6.242e18)'
            },
            {
                to: 'Joule',
                names: namesList.nrg_j,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Calorie',
                names: namesList.nrg_cal,
                func: (x) => {
                    return x / 4.184;
                },
                text: 'x/4.184'
            },
            {
                to: 'British Thermal Unit',
                names: namesList.nrg_btu,
                func: (x) => {
                    return x / 1055.06;
                },
                text: 'x/1055.06'
            },
            {
                to: 'Watt Hour',
                names: namesList.nrg_wh,
                func: (x) => {
                    return x / 3600;
                },
                text: 'x/3600'
            },
            toArbitrary
        ]
    },
    {
        name: 'Calorie',
        names: namesList.nrg_cal,
        type: 'Energy',
        system: 'N/A',
        calc: [
            {
                to: 'Electron Volt',
                names: namesList.nrg_ev,
                func: (x) => {
                    return x / 2.611e19;
                },
                text: 'x/(2.611e19)'
            },
            {
                to: 'Joule',
                names: namesList.nrg_j,
                func: (x) => {
                    return x * 4.184;
                },
                text: 'x*4.184'
            },
            {
                to: 'Calorie',
                names: namesList.nrg_cal,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'British Thermal Unit',
                names: namesList.nrg_btu,
                func: (x) => {
                    return x / 252.164;
                },
                text: 'x/252.164'
            },
            {
                to: 'Watt Hour',
                names: namesList.nrg_wh,
                func: (x) => {
                    return x / 860.421;
                },
                text: 'x/860.421'
            },
            toArbitrary
        ]
    },
    {
        name: 'British Thermal Unit',
        names: namesList.nrg_btu,
        type: 'Energy',
        system: 'Imperial',
        calc: [
            {
                to: 'Electron Volt',
                names: namesList.nrg_ev,
                func: (x) => {
                    return x * 6.585e21;
                },
                text: 'x*6.585e21'
            },
            {
                to: 'Joule',
                names: namesList.nrg_j,
                func: (x) => {
                    return x * 1055.05;
                },
                text: 'x*1055.06'
            },
            {
                to: 'Calorie',
                names: namesList.nrg_cal,
                func: (x) => {
                    return x * 252.164;
                },
                text: 'x*252.164'
            },
            {
                to: 'British Thermal Unit',
                names: namesList.nrg_btu,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Watt Hour',
                names: namesList.nrg_wh,
                func: (x) => {
                    return x / 3.41214;
                },
                text: 'x/3.41214'
            },
            toArbitrary
        ]
    },
    {
        name: 'Watt hour',
        names: namesList.nrg_wh,
        type: 'Energy',
        system: 'Metric',
        calc: [
            {
                to: 'Electron Volt',
                names: namesList.nrg_ev,
                func: (x) => {
                    return x * 2.247e22;
                },
                text: 'x*2.247e22'
            },
            {
                to: 'Joule',
                names: namesList.nrg_j,
                func: (x) => {
                    return x * 3600;
                },
                text: 'x*3600'
            },
            {
                to: 'Calorie',
                names: namesList.nrg_cal,
                func: (x) => {
                    return x * 860.421;
                },
                text: 'x*860.421'
            },
            {
                to: 'British Thermal Unit',
                names: namesList.nrg_btu,
                func: (x) => {
                    return x * 3.41214;
                },
                text: 'x*3.41214'
            },
            {
                to: 'Watt Hour',
                names: namesList.nrg_wh,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            toArbitrary
        ]
    },
    //power
    {
        name: 'Ergs',
        names: namesList.pow_erg,
        type: 'Power',
        system: 'N/A',
        calc: [
            {
                to: 'Ergs',
                names: namesList.pow_erg,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Watt',
                names: namesList.pow_w,
                func: (x) => {
                    return x / 1e7;
                },
                text: 'x/1e7'
            },
            {
                to: 'Decibel-milliwatts',
                names: namesList.pow_dbm,
                func: (x) => {
                    return x / 1e7 * 30;
                },
                text: 'x/1e7*30'
            },
            {
                to: 'Foot-pounds per minute',
                names: namesList.pow_ftlbsec,
                func: (x) => {
                    return x / (1.3558179483e7);
                },
                text: 'x/(1.3558179483e7)'
            },
            {
                to: 'Calories per second',
                names: namesList.pow_calsec,
                func: (x) => {
                    return x * (6 / 25e7);
                },
                text: 'x*(6/25e7)'
            },
            {
                to: 'Horse Power',
                names: namesList.pow_horse,
                func: (x) => {
                    return x / 745.7e7;
                },
                text: 'x/745.7e7'
            },
            {
                to: 'BTU per second',
                names: namesList.pow_btusec,
                func: (x) => {
                    return x / 1.0550558526e10;
                },
                text: 'x/1.0550558526e10'
            },
        ]
    },
    {
        name: 'Watt',
        names: namesList.pow_w,
        type: 'Power',
        system: 'Metric',
        calc: [
            {
                to: 'Ergs',
                names: namesList.pow_erg,
                func: (x) => {
                    return x * 1e7;
                },
                text: 'x*1e7'
            },
            {
                to: 'Watt',
                names: namesList.pow_w,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Decibel-milliwatts',
                names: namesList.pow_dbm,
                func: (x) => {
                    return x * 30;
                },
                text: 'x*30'
            },
            {
                to: 'Foot-pounds per minute',
                names: namesList.pow_ftlbsec,
                func: (x) => {
                    return x / 1.3558179483;
                },
                text: 'x/1.3558179483'
            },
            {
                to: 'Calories per second',
                names: namesList.pow_calsec,
                func: (x) => {
                    return x * (6 / 25);
                },
                text: 'x*(6/25)'
            },
            {
                to: 'Horse Power',
                names: namesList.pow_horse,
                func: (x) => {
                    return x / 745.7;
                },
                text: 'x/745.7'
            },
            {
                to: 'BTU per second',
                names: namesList.pow_btusec,
                func: (x) => {
                    return x / 1055.0558526;
                },
                text: 'x/1055.0558526'
            },
        ]
    },
    {
        name: 'Decibel-milliwatts',
        names: namesList.pow_dbm,
        type: 'Power',
        system: 'N/A',
        calc: [
            {
                to: 'Ergs',
                names: namesList.pow_erg,
                func: (x) => {
                    return x * 1e7 / 30;
                },
                text: 'x*1e7/30'
            },
            {
                to: 'Watt',
                names: namesList.pow_w,
                func: (x) => {
                    return x / 30;
                },
                text: 'x/30'
            },
            {
                to: 'Decibel-milliwatts',
                names: namesList.pow_dbm,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Foot-pounds per minute',
                names: namesList.pow_ftlbsec,
                func: (x) => {
                    return x / (1.3558179483 * 30);
                },
                text: 'x/(1.3558179483*30)'
            },
            {
                to: 'Calories per second',
                names: namesList.pow_calsec,
                func: (x) => {
                    return x * (6 / (25 * 30));
                },
                text: 'x*(6/(25*30))'
            },
            {
                to: 'Horse Power',
                names: namesList.pow_horse,
                func: (x) => {
                    return x / (745.7 * 30);
                },
                text: 'x/(745.7*30)'
            },
            {
                to: 'BTU per second',
                names: namesList.pow_btusec,
                func: (x) => {
                    return x / (1055.0558526 * 30);
                },
                text: 'x/(1055.0558526*30)'
            },
        ]
    },
    {
        name: 'Foot-pounds per minute',
        names: namesList.pow_ftlbsec,
        type: 'Power',
        system: 'N/A',
        calc: [
            {
                to: 'Ergs',
                names: namesList.pow_erg,
                func: (x) => {
                    return x * 1.3558179483e7;
                },
                text: 'x*1.3558179483e7'
            },
            {
                to: 'Watt',
                names: namesList.pow_w,
                func: (x) => {
                    return x * 1.3558179483;
                },
                text: 'x*1.3558179483'
            },
            {
                to: 'Decibel-milliwatts',
                names: namesList.pow_dbm,
                func: (x) => {
                    return x * 30 * 1.3558179483;
                },
                text: 'x*30*1.3558179483'
            },
            {
                to: 'Foot-pounds per minute',
                names: namesList.pow_ftlbsec,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Calories per second',
                names: namesList.pow_calsec,
                func: (x) => {
                    return x * 1.3558179483 * (6 / 25);
                },
                text: 'x*(6/25*1.3558179483)'
            },
            {
                to: 'Horse Power',
                names: namesList.pow_horse,
                func: (x) => {
                    return x * 1.3558179483 / 745.7;
                },
                text: 'x*1.3558179483/745.7'
            },
            {
                to: 'BTU per second',
                names: namesList.pow_btusec,
                func: (x) => {
                    return (x * 1.3558179483) / 1055.0558526;
                },
                text: 'x*1.3558179483/1055.0558526'
            },
        ]
    },
    {
        name: 'Calories per second',
        names: namesList.pow_calsec,
        type: 'Power',
        system: 'N/A',
        calc: [
            {
                to: 'Ergs',
                names: namesList.pow_erg,
                func: (x) => {
                    return (x * 1e7) / (6 / 25);
                },
                text: '(x*1e7)/(6/25)'
            },
            {
                to: 'Watt',
                names: namesList.pow_w,
                func: (x) => {
                    return x / (6 / 25);
                },
                text: 'x/(6/25)'
            },
            {
                to: 'Decibel-milliwatts',
                names: namesList.pow_dbm,
                func: (x) => {
                    return (x * 30) / (6 / 25);
                },
                text: '(x*30)/(6/25)'
            },
            {
                to: 'Foot-pounds per minute',
                names: namesList.pow_ftlbsec,
                func: (x) => {
                    return (x / 1.3558179483) / (6 / 25);
                },
                text: '(x/1.3558179483)/(6/25)'
            },
            {
                to: 'Calories per second',
                names: namesList.pow_calsec,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Horse Power',
                names: namesList.pow_horse,
                func: (x) => {
                    return (x / 745.7) * (6 / 25);
                },
                text: '(x/745.7)*(6/25)'
            },
            {
                to: 'BTU per second',
                names: namesList.pow_btusec,
                func: (x) => {
                    return (x / 1055.0558526) * (6 / 25);
                },
                text: '(x/1055.0558526)*(6/25)'
            },
        ]
    },
    {
        name: 'Horse Power',
        names: namesList.pow_horse,
        type: 'Power',
        system: 'Imperial',
        calc: [
            {
                to: 'Ergs',
                names: namesList.pow_erg,
                func: (x) => {
                    return x * 745.7e7;
                },
                text: 'x*745.7e7'
            },
            {
                to: 'Watt',
                names: namesList.pow_w,
                func: (x) => {
                    return x * 745.7;
                },
                text: 'x*745.7'
            },
            {
                to: 'Decibel-milliwatts',
                names: namesList.pow_dbm,
                func: (x) => {
                    return x * 30 * 745.7;
                },
                text: 'x*30*745.7'
            },
            {
                to: 'Foot-pounds per minute',
                names: namesList.pow_ftlbsec,
                func: (x) => {
                    return (x * 745.7) / 1.3558179483;
                },
                text: '(x*745.7)/1.3558179483'
            },
            {
                to: 'Calories per second',
                names: namesList.pow_calsec,
                func: (x) => {
                    return x * 745.7 * (6 / 25);
                },
                text: 'x*745.7((6/25)'
            },
            {
                to: 'Horse Power',
                names: namesList.pow_horse,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'BTU per second',
                names: namesList.pow_btusec,
                func: (x) => {
                    return x * 745.7 / 1055.0558526;
                },
                text: 'x*745.7/1055.0558526'
            },
        ]
    },
    {
        name: 'BTU per second',
        names: namesList.pow_btusec,
        type: 'Power',
        system: 'N/A',
        calc: [
            {
                to: 'Ergs',
                names: namesList.pow_erg,
                func: (x) => {
                    return x * 1055.0558526e7;
                },
                text: 'x*1055.0558526e7'
            },
            {
                to: 'Watt',
                names: namesList.pow_w,
                func: (x) => {
                    return x * 1055.0558526;
                },
                text: 'x*1055.0558526'
            },
            {
                to: 'Decibel-milliwatts',
                names: namesList.pow_dbm,
                func: (x) => {
                    return x * 30 * 1055.0558526;
                },
                text: 'x*30*1055.0558526'
            },
            {
                to: 'Foot-pounds per minute',
                names: namesList.pow_ftlbsec,
                func: (x) => {
                    return x * 1055.0558526 / 1.3558179483;
                },
                text: 'x*1055.0558526/1.3558179483'
            },
            {
                to: 'Calories per second',
                names: namesList.pow_calsec,
                func: (x) => {
                    return x * 1055.0558526 * (6 / 25);
                },
                text: 'x*1055.0558526*(6/25)'
            },
            {
                to: 'Horse Power',
                names: namesList.pow_horse,
                func: (x) => {
                    return (x * 1055.0558526) / 745.7;
                },
                text: 'x*1055.0558526/745.7'
            },
            {
                to: 'BTU per second',
                names: namesList.pow_btusec,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
        ]
    },
    //area
    {
        name: 'Square inch',
        names: namesList.area_in2,
        type: 'Area',
        system: 'Imperial',
        calc: [
            {
                to: 'Square inch',
                names: namesList.area_in2,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Square foot',
                names: namesList.area_ft2,
                func: (x) => {
                    return x / 144;
                },
                text: 'x/144'
            },
            {
                to: 'Square metre',
                names: namesList.area_m2,
                func: (x) => {
                    return x / (39.37 ** 2);
                },
                text: 'x/(39.37^2)'
            },
            {
                to: 'Acre',
                names: namesList.area_ac,
                func: (x) => {
                    return x / 6.27264e6;
                },
                text: 'x/(6.27264e6)'
            },
            {
                to: 'Hectare',
                names: namesList.area_ha,
                func: (x) => {
                    return x / (39.37 ** 2 * 1e4);
                },
                text: 'x/(39.37^2 * 1e4)'
            },
            {
                to: 'Square kilometre',
                names: namesList.area_km2,
                func: (x) => {
                    return x / (39.37 ** 2 * 1e6);
                },
                text: 'x/(39.37 ** 2 * 1e6)'
            },
            {
                to: 'Square mile',
                names: namesList.area_mi2,
                func: (x) => {
                    return x / 63360 ** 2;
                },
                text: 'x/(63360^2)'
            },
            toArbitrary
        ]
    },
    {
        name: 'Square foot',
        names: namesList.area_ft2,
        type: 'Area',
        system: 'Imperial',
        calc: [
            {
                to: 'Square inch',
                names: namesList.area_in2,
                func: (x) => {
                    return x * 144;
                },
                text: 'x*144'
            },
            {
                to: 'Square foot',
                names: namesList.area_ft2,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Square metre',
                names: namesList.area_m2,
                func: (x) => {
                    return x / 3.28084 ** 2;
                },
                text: 'x/3.28084^2'
            },
            {
                to: 'Acre',
                names: namesList.area_ac,
                func: (x) => {
                    return x / 43560;
                },
                text: 'x/43560'
            },
            {
                to: 'Hectare',
                names: namesList.area_ha,
                func: (x) => {
                    return x / 3.28084 ** 2 * 1e4;
                },
                text: 'x/3.28084^2*1e4'
            },
            {
                to: 'Square kilometre',
                names: namesList.area_km2,
                func: (x) => {
                    return x / 3.28084 ** 2 * 1e6;
                },
                text: 'x/3.28084^2*1e6'
            },
            {
                to: 'Square mile',
                names: namesList.area_mi2,
                func: (x) => {
                    return x / 2.788e7;
                },
                text: 'x/(2.788e7)'
            },
            toArbitrary
        ]
    },
    {
        name: 'Square metre',
        names: namesList.area_m2,
        type: 'Area',
        system: 'Metric',
        calc: [
            {
                to: 'Square inch',
                names: namesList.area_in2,
                func: (x) => {
                    return x * 39.37 ** 2;
                },
                text: 'x*39.37^2'
            },
            {
                to: 'Square foot',
                names: namesList.area_ft2,
                func: (x) => {
                    return x * 3.28084 ** 2;
                },
                text: 'x*3.28084^2'
            },
            {
                to: 'Square metre',
                names: namesList.area_m2,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Acre',
                names: namesList.area_ac,
                func: (x) => {
                    return x / 4047;
                },
                text: 'x/4047'
            },
            {
                to: 'Hectare',
                names: namesList.area_ha,
                func: (x) => {
                    return x / 1e4;
                },
                text: 'x/1e4'
            },
            {
                to: 'Square kilometre',
                names: namesList.area_km2,
                func: (x) => {
                    return x / 1e6;
                },
                text: 'x/1e6'
            },
            {
                to: 'Square mile',
                names: namesList.area_mi2,
                func: (x) => {
                    return x / 1609.344 ** 2;
                },
                text: 'x/1609.344^2'
            },
            toArbitrary
        ]
    },
    {
        name: 'Acre',
        names: namesList.area_ac,
        type: 'Area',
        system: 'Imperial',
        calc: [
            {
                to: 'Square inch',
                names: namesList.area_in2,
                func: (x) => {
                    return x * 6.27264e6;
                },
                text: 'x*6.27264e6'
            },
            {
                to: 'Square foot',
                names: namesList.area_ft2,
                func: (x) => {
                    return x * 43560;
                },
                text: 'x*43560'
            },
            {
                to: 'Square metre',
                names: namesList.area_m2,
                func: (x) => {
                    return x * 4046.86;
                },
                text: 'x*4046.86'
            },
            {
                to: 'Acre',
                names: namesList.area_ac,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Hectare',
                names: namesList.area_ha,
                func: (x) => {
                    return x / 2.471;
                },
                text: 'x/2.471'
            },
            {
                to: 'Square kilometre',
                names: namesList.area_km2,
                func: (x) => {
                    return x / 247.1;
                },
                text: 'x/247.1'
            },
            {
                to: 'Square mile',
                names: namesList.area_mi2,
                func: (x) => {
                    return x / 640;
                },
                text: 'x/640'
            },
            toArbitrary
        ]
    },
    {
        name: 'Hectare',
        names: namesList.area_ha,
        type: 'Area',
        system: 'Metric',
        calc: [
            {
                to: 'Square inch',
                names: namesList.area_in2,
                func: (x) => {
                    return x * 1.55e7;
                },
                text: 'x*1.55e7'
            },
            {
                to: 'Square foot',
                names: namesList.area_ft2,
                func: (x) => {
                    return x * 107639;
                },
                text: 'x*107639'
            },
            {
                to: 'Square metre',
                names: namesList.area_m2,
                func: (x) => {
                    return x * 10000;
                },
                text: 'x*10000'
            },
            {
                to: 'Acre',
                names: namesList.area_ac,
                func: (x) => {
                    return x * 2.471;
                },
                text: 'x*2.471'
            },
            {
                to: 'Hectare',
                names: namesList.area_ha,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Square kilometre',
                names: namesList.area_km2,
                func: (x) => {
                    return x / 100;
                },
                text: 'x/100'
            },
            {
                to: 'Square mile',
                names: namesList.area_mi2,
                func: (x) => {
                    return x / 258.999;
                },
                text: 'x/258.999'
            },
            toArbitrary
        ]
    },
    {
        name: 'Square kilometre',
        names: namesList.area_km2,
        type: 'Area',
        system: 'Metric',
        calc: [
            {
                to: 'Square inch',
                names: namesList.area_in2,
                func: (x) => {
                    return x * 39.37 ** 2 * 1e6;
                },
                text: 'x*39.37^2*1e6'
            },
            {
                to: 'Square foot',
                names: namesList.area_ft2,
                func: (x) => {
                    return x * 3.28084 ** 2 * 1e6;
                },
                text: 'x*3.28084^2*1e6'
            },
            {
                to: 'Square metre',
                names: namesList.area_m2,
                func: (x) => {
                    return x * 1e6;
                },
                text: 'x*1e6'
            },
            {
                to: 'Acre',
                names: namesList.area_ac,
                func: (x) => {
                    return x / 4047 * 1e6;
                },
                text: 'x/4047*1e6'
            },
            {
                to: 'Hectare',
                names: namesList.area_ha,
                func: (x) => {
                    return x * 1e2;
                },
                text: 'x*1e2'
            },
            {
                to: 'Square kilometre',
                names: namesList.area_km2,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Square mile',
                names: namesList.area_mi2,
                func: (x) => {
                    return (x / 5280 ** 2) * 1e6;
                },
                text: '(x/5280^2)*1e6'
            },
            toArbitrary
        ]
    },
    {
        name: 'Square mile',
        names: namesList.area_mi2,
        type: 'Area',
        system: 'Imperial',
        calc: [
            {
                to: 'Square inch',
                names: namesList.area_in2,
                func: (x) => {
                    return x * 63360 ** 2;
                },
                text: 'x*63360^2'
            },
            {
                to: 'Square foot',
                names: namesList.area_ft2,
                func: (x) => {
                    return x * 5280 ** 2;
                },
                text: 'x*5280^2'
            },
            {
                to: 'Square metre',
                names: namesList.area_m2,
                func: (x) => {
                    return x * 1609.344 ** 2;
                },
                text: 'x*1609.344^2'
            },
            {
                to: 'Acre',
                names: namesList.area_ac,
                func: (x) => {
                    return x * 640;
                },
                text: 'x*640'
            },
            {
                to: 'Hectare',
                names: namesList.area_ha,
                func: (x) => {
                    return x * 258.999;
                },
                text: 'x*258.999'
            },
            {
                to: 'Square kilometre',
                names: namesList.area_km2,
                func: (x) => {
                    return x * 5280 ** 2 / 1e6;
                },
                text: 'x*5280^2/1e6'
            },
            {
                to: 'Square mile',
                names: namesList.area_mi2,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            toArbitrary
        ]
    },
    //angle
    {
        name: 'Gradian',
        names: namesList.angle_grad,
        type: 'Angle',
        system: 'N/A',
        calc: [
            {
                to: 'Gradian',
                names: namesList.angle_grad,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Degree',
                names: namesList.angle_deg,
                func: (x) => {
                    return x * 0.9;
                },
                text: 'x*0.9'
            },
            {
                to: 'Radian',
                names: namesList.angle_rad,
                func: (x) => {
                    return (x * Math.PI) / 200;
                },
                text: '(x*π)/200'
            },
            toArbitrary
        ]
    },
    {
        name: 'Degree',
        names: namesList.angle_deg,
        type: 'Angle',
        system: 'N/A',
        calc: [
            {
                to: 'Gradian',
                names: namesList.angle_grad,
                func: (x) => {
                    return x/0.9;
                },
                text: 'x/0.9'
            },
            {
                to: 'Degree',
                names: namesList.angle_deg,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Radian',
                names: namesList.angle_rad,
                func: (x) => {
                    return (x * Math.PI) / 180;
                },
                text: '(x*π)/180'
            },
            toArbitrary
        ]
    },
    {
        name: 'Radian',
        names: namesList.angle_rad,
        type: 'Angle',
        system: 'N/A',
        calc: [
            {
                to: 'Gradian',
                names: namesList.angle_grad,
                func: (x) => {
                    return (x * 200) / Math.PI;
                },
                text: '(x*200)/π'
            },
            {
                to: 'Degree',
                names: namesList.angle_deg,
                func: (x) => {
                    return (x * 180) / Math.PI;
                },
                text: '(x*180)/π'
            },
            {
                to: 'Radian',
                names: namesList.angle_rad,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            toArbitrary
        ]
    },
    //speed
    {
        name: 'Kilometres per hour',
        names: namesList.speed_kmh,
        type: 'Speed',
        system: 'Metric',
        calc: [
            {
                to: 'Kilometres per hour',
                names: namesList.speed_kmh,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Miles per hour',
                names: namesList.speed_mph,
                func: (x) => {
                    return x / 1.609;
                },
                text: 'x/1.609'
            },
            {
                to: 'Knot',
                names: namesList.speed_kt,
                func: (x) => {
                    return x / 1.852;
                },
                text: 'x/1.852'
            },
            {
                to: 'Metres per second',
                names: namesList.speed_ms,
                func: (x) => {
                    return x / 3.6;
                },
                text: 'x/3.6'
            },
            {
                to: 'Light',
                names: namesList.speed_c,
                func: (x) => {
                    return x / 1079252848.8;
                },
                text: 'x/1079252848.8'
            },
            toArbitrary
        ]
    },
    {
        name: 'Miles per hour',
        names: namesList.speed_mph,
        type: 'Speed',
        system: 'Imperial',
        calc: [
            {
                to: 'Kilometres per hour',
                names: namesList.speed_kmh,
                func: (x) => {
                    return x * 1.609;
                },
                text: 'x*1.609'
            },
            {
                to: 'Miles per hour',
                names: namesList.speed_mph,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Knot',
                names: namesList.speed_kt,
                func: (x) => {
                    return x / 1.151;
                },
                text: 'x/1.151'
            },
            {
                to: 'Metres per second',
                names: namesList.speed_ms,
                func: (x) => {
                    return x / 2.237;
                },
                text: 'x/2.237'
            },
            {
                to: 'Light',
                names: namesList.speed_c,
                func: (x) => {
                    return x / 670635728.546;
                },
                text: 'x/670635728.546'
            },
            toArbitrary
        ]
    },
    {
        name: 'Knots',
        names: namesList.speed_kt,
        type: 'Speed',
        system: 'N/A',
        calc: [
            {
                to: 'Kilometres per hour',
                names: namesList.speed_kmh,
                func: (x) => {
                    return x * 1.852;
                },
                text: 'x*1.852'
            },
            {
                to: 'Miles per hour',
                names: namesList.speed_mph,
                func: (x) => {
                    return x * 1.151;
                },
                text: 'x*1.151'
            },
            {
                to: 'Knot',
                names: namesList.speed_kt,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Metres per second',
                names: namesList.speed_ms,
                func: (x) => {
                    return x / 1.944;
                },
                text: 'x/1.944'
            },
            {
                to: 'Light',
                names: namesList.speed_c,
                func: (x) => {
                    return x / 582796538.352;
                },
                text: 'x/582796538.352'
            },
            toArbitrary
        ]
    },
    {
        name: 'Metres per second',
        names: namesList.speed_ms,
        type: 'Speed',
        system: 'Metric',
        calc: [
            {
                to: 'Kilometres per hour',
                names: namesList.speed_kmh,
                func: (x) => {
                    return x * 3.6 * 299792458;
                },
                text: 'x*3.6*299792458'
            },
            {
                to: 'Miles per hour',
                names: namesList.speed_mph,
                func: (x) => {
                    return x * 2.237;
                },
                text: 'x*2.237'
            },
            {
                to: 'Knot',
                names: namesList.speed_kt,
                func: (x) => {
                    return x * 1.944;
                },
                text: 'x*1.944'
            },
            {
                to: 'Metres per second',
                names: namesList.speed_ms,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            {
                to: 'Light',
                names: namesList.speed_c,
                func: (x) => {
                    return x / 299792458;
                },
                text: 'x/299792458'
            },
            toArbitrary
        ]
    },
    {
        name: 'Light',
        names: namesList.speed_c,
        type: 'Speed',
        system: 'Metric',
        calc: [
            {
                to: 'Kilometres per hour',
                names: namesList.speed_kmh,
                func: (x) => {
                    return x * 3.6 * 299792458;
                },
                text: 'x*3.6*299792458'
            },
            {
                to: 'Miles per hour',
                names: namesList.speed_mph,
                func: (x) => {
                    return x * 2.237 * 299792458;
                },
                text: 'x*2.237*299792458'
            },
            {
                to: 'Knot',
                names: namesList.speed_kt,
                func: (x) => {
                    return x * 1.944 * 299792458;
                },
                text: 'x*1.944*299792458'
            },
            {
                to: 'Metres per second',
                names: namesList.speed_ms,
                func: (x) => {
                    return x * 299792458;
                },
                text: 'x*299792458'
            },
            {
                to: 'Light',
                names: namesList.speed_c,
                func: (x) => {
                    return x;
                },
                text: 'x'
            },
            toArbitrary
        ]
    },
    //arbitrary units
    {
        name: 'Arbitrary units',
        names: namesList.arbitrary,
        type: 'N/A',
        system: 'N/A',
        calc: [
            {
                to: 'Celsius',
                names: namesList.temp_c,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Fahrenheit',
                names: namesList.temp_f,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Kelvin',
                names: namesList.temp_k,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Inch',
                names: namesList.dist_in,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Feet',
                names: namesList.dist_ft,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Metre',
                names: namesList.dist_m,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Mile',
                names: namesList.dist_mi,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Astronomical Unit',
                names: namesList.dist_au,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Light Year',
                names: namesList.dist_ly,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Second',
                names: namesList.time_s,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Minute',
                names: namesList.time_min,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Hour',
                names: namesList.time_hr,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Day',
                names: namesList.time_d,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Week',
                names: namesList.time_wk,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Quarantine',
                names: namesList.time_qua,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Month',
                names: namesList.time_mth,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Year',
                names: namesList.time_yr,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Decade',
                names: namesList.time_dec,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Century',
                names: namesList.time_cen,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Millennium',
                names: namesList.time_mil,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Megaannum',
                names: namesList.time_ma,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Eon',
                names: namesList.time_eon,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Teaspoon',
                names: namesList.vol_tsp,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Tablespoon',
                names: namesList.vol_tbp,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Fluid Ounce',
                names: namesList.vol_floz,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Cup',
                names: namesList.vol_c,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Pint',
                names: namesList.vol_pt,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Litre',
                names: namesList.vol_l,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Gallon',
                names: namesList.vol_gal,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Cubic Metre',
                names: namesList.vol_m3,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Pascal',
                names: namesList.pres_pa,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'mmHg',
                names: namesList.pres_mmHg,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'psi',
                names: namesList.pres_psi,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Bar',
                names: namesList.pres_bar,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Standard Atmosphere',
                names: namesList.pres_atm,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Electron Volt',
                names: namesList.nrg_ev,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Joule',
                names: namesList.nrg_j,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Calorie',
                names: namesList.nrg_cal,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Square foot',
                names: namesList.area_ft2,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Square metre',
                names: namesList.area_m2,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Acre',
                names: namesList.area_ac,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Hectare',
                names: namesList.area_ha,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Square kilometre',
                names: namesList.area_km2,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Square mile',
                names: namesList.area_mi2,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Gradian',
                names: namesList.angle_grad,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Degree',
                names: namesList.angle_deg,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Radian',
                names: namesList.angle_rad,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Kilometres per hour',
                names: namesList.speed_kmh,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Miles per hour',
                names: namesList.speed_mph,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Knot',
                names: namesList.speed_kt,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Metres per second',
                names: namesList.speed_ms,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            {
                to: 'Light',
                names: namesList.speed_c,
                func: toArbitrary.func,
                text: toArbitrary.text
            },
            toArbitrary
        ]
    }
];


//-----------------------------------------------------------------------
/**
 * this section is for base number conversions
 */

export const namesListBaseNum = {
    bin: ['binary', 'bin', 'base2'],
    oct: ['octal', 'oct', 'base8'],
    dec: ['decimal', 'dec', 'base10'],
    hex: ['hexadecimal', 'hex', 'base16'],
};