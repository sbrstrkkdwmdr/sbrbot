export type subregions = 
'Northern America' | 'Central America' | 'Caribbean' | 'South America' | 
'Northern Europe' | 'Western Europe' | 'Southern Europe' | 'Eastern Europe' |
'Northern Africa' | 'Western Africa' | 'Middle Africa' | 'Eastern Africa' | 'Southern Africa' |
'Western Asia' | 'Central Asia' | 'Southern Asia' | 'Eastern Asia' | 'Southeastern Asia' | 
'Oceania' | 'Micronesia' | 'Melanesia' | 'Polynesia' | 'Australia and New Zealand'

export type countryInfo = {
    name: string[],
    name_endonym: string[],
    capital: string,
    capital_endonym:string,
    code: {
        number: number | string,
        iso_2: string,
        iso_3: string,
    }
    timezone: {
        utc: number
        related: string[]
    }
}