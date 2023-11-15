export type subregion =
    'Northern America' | 'Central America' | 'Caribbean' | 'South America' |
    'Northern Europe' | 'Western Europe' | 'Southern Europe' | 'Eastern Europe' |
    'Northern Africa' | 'Western Africa' | 'Middle Africa' | 'Eastern Africa' | 'Southern Africa' |
    'Western Asia' | 'Central Asia' | 'Southern Asia' | 'Eastern Asia' | 'Southeastern Asia' |
    'Oceania';

export type countryInfo = {
    name: string[],
    capital: string[],
    citiesLargest: { name: string[], population: number; }[];
    code: {
        number: number | string,
        iso_2: string,
        iso_3: string,
    };
    timezone: {
        utc: string; //for countries with multiple timezones, the one with the capital city will be used
        related: string[];
    };
    population: number,
    subdivisions: subdivision[],
    region: subregion,
    lastUpdated: string,
};

export type subdivision = {
    name: string[];
    capital: string[];
    timezone: {
        utc: string;
        related: string[];
    };
    population: number;
};
const template: countryInfo = {
    name: ['template'],
    capital: ['bigCity'],
    citiesLargest: [{ name: ['populousCity'], population: NaN }],
    code: {
        number: 'string',
        iso_2: 'string',
        iso_3: 'string',
    },
    timezone: {
        utc: '+00:00',
        related: [],
    },
    population: NaN,
    subdivisions: [{
        name: ['stateTerritoryProvincePrefectureDistrict'],
        capital: ['someCity'],
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN
    }],
    region: 'Oceania',
    lastUpdated: '2023-11-15',
};

const countriesA: countryInfo[] = [
    {
        name: ['Afghanistan', 'افغانستان', 'Afghanestan'],
        capital: ['Kabul'],
        citiesLargest: [{ name: ['Kabul'], population: 4635000 }],
        code: {
            number: '004',
            iso_2: 'AF',
            iso_3: 'AFG',
        },
        timezone: {
            utc: '+04:30',
            related: [],
        },
        population: 32890171,
        subdivisions: [],
        region: 'Central Asia', //could also be considered southern asia
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Aland', 'Åland Islands', 'Landskapet Åland','Ahvenanmaan maakunta'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: 28355,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Albania'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Algeria'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['American Samoa'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Andorra'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Angola'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Anguilla'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Antigua and Barbuda'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Argentina'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Armenia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Aruba'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Australia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Austria'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Azerbaijan'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
];
const countriesB: countryInfo[] = [
    {
        name: ['The Bahamas'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Bahrain'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Bangladesh'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Barbados'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Belarus'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Belgium'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Belize'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Benin'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Bermuda'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Bhutan'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Bolivia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Bonaire'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Bosnia and Herzegovina'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Botswana'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Brazil'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['British Indian Ocean Territory'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['British Virgin Islands'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Brunei'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Bulgaria'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Burkina Faso'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Burundi'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
];
const countriesC: countryInfo[] = [
    {
        name: ['Cambodia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Cameroon'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Canada'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Cape Verde'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Central African Republic'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Chad'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Chile'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['China'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Colombia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Comoros'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Democratic Republic of the Congo'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Republic of the Congo'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Cook Islands'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

    {
        name: ['Costa Rica'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Cote d\'Ivoire'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

    {
        name: ['Croatia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Cuba'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Curacao'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Cyprus'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Czechia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
];
const countriesD: countryInfo[] = [
    {
        name: ['Denmark'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Djibouti'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Dominica'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Dominican Republic'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
];
const countriesE: countryInfo[] = [
    {
        name: ['Ecuador'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Egypt'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['El Salvador'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Equatorial Guinea'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Eritrea'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Estonia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Eswatini'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Ethiopia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
];
const countriesF: countryInfo[] = [
    {
        name: ['Faroe Islands'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

    {
        name: ['Fiji'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Finland'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['France'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
];
const countriesG: countryInfo[] = [
    {
        name: ['Gabon'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Gambia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Georgia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Germany'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Ghana'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Greece'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Greenland'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

    {
        name: ['Grenada'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Guatemala'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Guinea'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Guinea-Bissau'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Guyana'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

];
const countriesH: countryInfo[] = [
    {
        name: ['Haiti'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Holy See', 'Vatican City'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

    {
        name: ['Honduras'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Hong Kong'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Hungary'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

];
const countriesI: countryInfo[] = [
    {
        name: ['Iceland'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['India'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Indonesia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Iran'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Iraq'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Ireland'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Israel'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Italy'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

];
const countriesJ: countryInfo[] = [
    {
        name: ['Jamaica'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Japan'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Jordan'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

];
const countriesK: countryInfo[] = [
    {
        name: ['Kazakhstan'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Kenya'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Kiribati'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['North Korea'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['South Korea'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Kosovo'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

    {
        name: ['Kuwait'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Kyrgyzstan'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

];
const countriesL: countryInfo[] = [
    {
        name: ['Laos'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Latvia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Lebanon'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Lesotho'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Liberia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Libya'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Liechtenstein'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Lithuania'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Luxembourg'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

];
const countriesM: countryInfo[] = [
    {
        name: ['Macau'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Madagascar'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Malawi'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Malaysia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Maldives'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Mali'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Malta'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Marshall Islands'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Martinique'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Mauritania'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Mauritius'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Mexico'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Micronesia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Moldova'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Monaco'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Mongolia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Montenegro'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Morocco'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Mozambique'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Myanmar'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
];
const countriesN: countryInfo[] = [
    {
        name: ['Namibia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Nauru'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Nepal'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Netherlands'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['New Caledonia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['New Zealand'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Nicaragua'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Niger'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Nigeria'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Niue'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

    {
        name: ['Norfolk Island'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['North Macedonia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Norway'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

];
const countriesO: countryInfo[] = [
    {
        name: ['Oman'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

];
const countriesP: countryInfo[] = [
    {
        name: ['Pakistan'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Palau'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Palestine'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Panama'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Papua New Guinea'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Paraguay'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Peru'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Philippines'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Poland'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Portugal'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Puerto Rico'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

];
const countriesQ: countryInfo[] = [
    {
        name: ['Qatar'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

];
const countriesR: countryInfo[] = [
    {
        name: ['Reunion'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Romania'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Russia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Rwanda'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

];
const countriesS: countryInfo[] = [
    {
        name: ['Saint Kitts and Nevis'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Saint Lucia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Saint Martin'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

    {
        name: ['Saint Vincent and the Grenadines'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Samoa'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['San Marino'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Sao Tome and Principe'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Saudi Arabia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Senegal'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Serbia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Seychelles'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Sierra Leone'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Singapore'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Sint Maarten'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

    {
        name: ['Slovakia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Slovenia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Solomon Islands'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Somalia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Somaliland'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

    {
        name: ['South Africa'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Spain'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Sri Lanka'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Sudan'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['South Sudan'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Suriname'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Sweden'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Switzerland'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Syria'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
];
const countriesT: countryInfo[] = [
    {
        name: ['Taiwan'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Tajikistan'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Tanzania'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Thailand'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Timor Leste'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Togo'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

    {
        name: ['Tonga'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

    {
        name: ['Trinidad and Tobago'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

    {
        name: ['Tunisia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Turkiye'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Turkmenistan'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Tuvalu'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

];
const countriesU: countryInfo[] = [
    {
        name: ['Uganda'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Ukraine'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['United Arab Emirates'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['United Kingdom'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['United States'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Uruguay'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Uzbekistan'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

];
const countriesV: countryInfo[] = [
    {
        name: ['Vanuatu'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Venezuela'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Vietnam'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

];
const countriesW: countryInfo[] = [
    {
        name: ['Wales'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Wallis and Futuna'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Western Sahara'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
];
const countriesX: countryInfo[] = [

];
const countriesY: countryInfo[] = [
    {
        name: ['Yemen'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

];
const countriesZ: countryInfo[] = [
    {
        name: ['Zambia'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },
    {
        name: ['Zimbabwe'],
        capital: ['bigCity'],
        citiesLargest: [{ name: ['populousCity'], population: NaN }],
        code: {
            number: 'string',
            iso_2: 'string',
            iso_3: 'string',
        },
        timezone: {
            utc: '+00:00',
            related: [],
        },
        population: NaN,
        subdivisions: [{
            name: ['stateTerritoryProvincePrefectureDistrict'],
            capital: ['someCity'],
            timezone: {
                utc: '+00:00',
                related: [],
            },
            population: NaN
        }],
        region: 'Oceania',
        lastUpdated: '2023-11-15',
    },

];

export const countries: countryInfo[] =
    countriesA
        .concat(countriesB)
        .concat(countriesC)
        .concat(countriesD)
        .concat(countriesE)
        .concat(countriesF)
        .concat(countriesG)
        .concat(countriesH)
        .concat(countriesI)
        .concat(countriesJ)
        .concat(countriesK)
        .concat(countriesL)
        .concat(countriesM)
        .concat(countriesN)
        .concat(countriesO)
        .concat(countriesP)
        .concat(countriesQ)
        .concat(countriesR)
        .concat(countriesS)
        .concat(countriesT)
        .concat(countriesU)
        .concat(countriesV)
        .concat(countriesW)
        .concat(countriesX)
        .concat(countriesY)
        .concat(countriesZ);