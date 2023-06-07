type quoteTemplate = {
    string: string,
    names: number,
    verbs: number,
    descriptors: number,
};

//ps ->
/** FORMATTING FOR TEMPLATE STRINGS
 * ---NOUNS---
 * ba -> base noun (thing)
 * pl -> pluralised (thing -> things)
 * ar -> article (thing -> the thing)
 * ia -> indef article (thing -> a thing)
 * po -> possessive (thing -> your thing)
 * ---VERBS---
 * ba -> base verb (do)
 * pa -> past tense (did)
 * pr -> present tense (doing)
 * fu -> future tense (will do)
 */

type noun = {
    base: string, // thing
    pluralised: string, // things
    indefAr: string, // a thing
};

type verb = {
    base: string, // do
    past: string, // did
    present: string, // doing
    future: string, // will do
};


export const templateStrings: quoteTemplate[] = [
    {
        string: 'Become the name1 who makes other name1s verb1',
        names: 1,
        verbs: 1,
        descriptors: 0,
    },
    {
        string: 'There are okay name1s and not-so-okay name1s',
        names: 1,
        verbs: 0,
        descriptors: 0,
    },
    {
        string: 'Forcing a name1 to be name2 is probably not as descriptor1 as it sounds',
        names: 2,
        verbs: 0,
        descriptors: 1,
    },
    {
        string: 'name1 is name2 on steroids',
        names: 2,
        verbs: 0,
        descriptors: 0,
    },
    {
        string: 'remember to always be descriptor1',
        names: 0,
        verbs: 0,
        descriptors: 1,
    },
    {
        string: 'Never let go of an opportunity to verb1',
        names: 0,
        verbs: 1,
        descriptors: 0,
    },
    {
        string: 'In order to acheive success, you must verb1',
        names: 0,
        verbs: 1,
        descriptors: 0,
    },
    {
        string: 'Always remember that you are a(n) descriptor1 name1',
        names: 1,
        verbs: 0,
        descriptors: 1,
    },
    {
        string: 'Seek name1, seek name2',
        names: 2,
        verbs: 0,
        descriptors: 0,
    },
    {
        string: 'you\'re descriptor1, but so is a name1',
        names: 1,
        verbs: 0,
        descriptors: 1,
    },
    {
        string: 'verb1 and verb2',
        names: 0,
        verbs: 2,
        descriptors: 0,
    },
    {
        string: 'keep calm and verb1',
        names: 0,
        verbs: 1,
        descriptors: 0,
    },
    {
        string: 'be the first to verb1 what any normal person would consider descriptor1',
        names: 0,
        verbs: 1,
        descriptors: 1,
    },
    {
        string: 'name1 begins when name2 ends',
        names: 2,
        verbs: 0,
        descriptors: 0,
    },
    {
        string: 'without verb1 there can be no name1',
        names: 1,
        verbs: 1,
        descriptors: 0,
    },
    {
        string: 'name1s begin when we learn to verb1',
        names: 1,
        verbs: 1,
        descriptors: 0,
    },
    {
        string: 'ensure that name1 feels descriptor1',
        names: 1,
        verbs: 0,
        descriptors: 1,
    },
    {
        string: 'you can be the reason why a name1 verb1',
        names: 1,
        verbs: 1,
        descriptors: 0,
    },
    {
        string: 'someone should verb1. You can be that someone',
        names: 0,
        verbs: 1,
        descriptors: 0,
    },
    {
        string: 'You carry the potential to become a descriptor1 name1',
        names: 1,
        verbs: 0,
        descriptors: 1,
    },
    {
        string: 'Don\'t verb1 with name1. verb2',
        names: 1,
        verbs: 2,
        descriptors: 0,
    },
    {
        string: 'you\'re descriptor1, but so is a name1',
        names: 1,
        verbs: 0,
        descriptors: 1,
    },
    {
        string: 'a name1 is never just a name2, but its not a name3',
        names: 3,
        verbs: 0,
        descriptors: 0,
    },
    {
        string: 'first comes name1, then comes name2',
        names: 2,
        verbs: 0,
        descriptors: 0,
    },
    {
        string: 'name1 is worth it. Thank you',
        names: 1,
        verbs: 0,
        descriptors: 0,
    },
    {
        string: 'Society without name1 is no fun.',
        names: 1,
        verbs: 0,
        descriptors: 0,
    },
];

const gender: noun[] = [
    {
        base: 'guy',
        pluralised: 'guys',
        indefAr: 'a guy'
    },
    {
        base: 'boy',
        pluralised: 'boys',
        indefAr: 'a boy'
    },
    {
        base: 'girl',
        pluralised: 'girls',
        indefAr: 'a girl'
    },
    {
        base: 'woman',
        pluralised: 'women',
        indefAr: 'a woman'
    },
    {
        base: 'man',
        pluralised: 'men',
        indefAr: 'a man'
    },
];
const famMembers: noun[] = [
    {
        base: 'wife',
        pluralised: 'wives',
        indefAr: 'a wife'
    },
    {
        base: 'husband',
        pluralised: 'husbands',
        indefAr: 'a husband'
    },
    {
        base: 'partner',
        pluralised: 'partners',
        indefAr: 'a partner'
    },
    {
        base: 'mother',
        pluralised: 'mothers',
        indefAr: 'a mother'
    },
    {
        base: 'father',
        pluralised: 'fathers',
        indefAr: 'a father'
    },
    {
        base: 'brother',
        pluralised: 'brothers',
        indefAr: 'a brother'
    },
    {
        base: 'sister',
        pluralised: 'sisters',
        indefAr: 'a sister'
    },
    {
        base: 'sibling',
        pluralised: 'siblings',
        indefAr: 'a sibling'
    },
    {
        base: 'cousin',
        pluralised: 'cousins',
        indefAr: 'a cousin'
    },
    {
        base: 'aunt',
        pluralised: 'aunts',
        indefAr: 'an aunt'
    },
    {
        base: 'uncle',
        pluralised: 'uncles',
        indefAr: 'an uncle'
    },
    {
        base: 'niece',
        pluralised: 'nieces',
        indefAr: 'a niece'
    },
    {
        base: 'nephew',
        pluralised: 'nephews',
        indefAr: 'a nephew'
    },
    {
        base: 'grandfather',
        pluralised: 'grandfathers',
        indefAr: 'a grandfather'
    },
    {
        base: 'grandmother',
        pluralised: 'grandmothers',
        indefAr: 'a grandmother'
    },
    {
        base: 'grandparent',
        pluralised: 'grandparents',
        indefAr: 'a grandparent'
    },
];
const people: noun[] = [
    {
        base: 'angel',
        pluralised: 'angels',
        indefAr: 'an angel'
    },
    {
        base: 'colleague',
        pluralised: 'colleagues',
        indefAr: 'a colleague'
    },
    {
        base: 'human being',
        pluralised: 'human beings',
        indefAr: 'a human being'
    },
    {
        base: 'expert',
        pluralised: 'experts',
        indefAr: 'an expert'
    },
    {
        base: 'professional',
        pluralised: 'professionals',
        indefAr: 'a professional'
    },
    {
        base: 'teacher',
        pluralised: 'teachers',
        indefAr: 'a teacher'
    },
    {
        base: 'electrician',
        pluralised: 'electricians',
        indefAr: 'an electrician'
    },
    {
        base: 'pilot',
        pluralised: 'pilots',
        indefAr: 'a pilot'
    },
    {
        base: 'hostess',
        pluralised: 'hostesses',
        indefAr: 'a hostess'
    },
    {
        base: 'maid',
        pluralised: 'maids',
        indefAr: 'a maid'
    },
    {
        base: 'stranger',
        pluralised: 'strangers',
        indefAr: 'a stranger'
    },
    {
        base: 'farmer',
        pluralised: 'farmers',
        indefAr: 'a farmer'
    },
];
const animals: noun[] = [
    {
        base: 'cow',
        pluralised: 'cows',
        indefAr: 'a cow'
    },
    {
        base: 'dog',
        pluralised: 'dogs',
        indefAr: 'a dog'
    },
    {
        base: 'cat',
        pluralised: 'cats',
        indefAr: 'a cat'
    },
    {
        base: 'monkey',
        pluralised: 'monkeys',
        indefAr: 'a monkey'
    },
    {
        base: 'sheep',
        pluralised: 'sheep',
        indefAr: 'a sheep'
    },
    {
        base: 'goat',
        pluralised: 'goats',
        indefAr: 'a goat'
    },
];
const structs: noun[] = [
    {
        base: 'restaurant',
        pluralised: 'restaurants',
        indefAr: 'a restaurant'
    },
    {
        base: 'bank',
        pluralised: 'banks',
        indefAr: 'a bank'
    },
    {
        base: 'planet',
        pluralised: 'planets',
        indefAr: 'a planet'
    },
    {
        base: 'sun',
        pluralised: 'suns',
        indefAr: 'a sun'
    },
    {
        base: 'earth',
        pluralised: 'earths',
        indefAr: 'an earth'
    },
    {
        base: 'moon',
        pluralised: 'moons',
        indefAr: 'a moon'
    },
    {
        base: 'house',
        pluralised: 'houses',
        indefAr: 'a house'
    },
    {
        base: 'building',
        pluralised: 'buildings',
        indefAr: 'a building'
    },
    {
        base: 'field',
        pluralised: 'fields',
        indefAr: 'a field'
    },
];
const concepts: noun[] = [
    {
        base: 'change',
        pluralised: 'changes',
        indefAr: 'a change'
    },
    {
        base: 'solution',
        pluralised: 'solutions',
        indefAr: 'a solution'
    },
    {
        base: 'problem',
        pluralised: 'problems',
        indefAr: 'a problem'
    },
    {
        base: 'success',
        pluralised: 'successes',
        indefAr: 'a success'
    },
    {
        base: 'sunrise',
        pluralised: 'sunrises',
        indefAr: 'a sunrise'
    },
    {
        base: 'sunset',
        pluralised: 'sunsets',
        indefAr: 'a sunset'
    },
    {
        base: 'betrayal',
        pluralised: 'betrayals',
        indefAr: 'a betrayal'
    },
    {
        base: 'human sacrifice',
        pluralised: 'human sacrifices',
        indefAr: 'a human sacrifice'
    },
    {
        base: 'humanity',
        pluralised: 'humanities',
        indefAr: 'a humanity'
    },
];
const things: noun[] = [
    {
        base: 'ball',
        pluralised: 'balls',
        indefAr: 'a ball'
    },
    {
        base: 'book',
        pluralised: 'books',
        indefAr: 'a book'
    },
    {
        base: 'fungal infection',
        pluralised: 'fungal infections',
        indefAr: 'a fungal infection'
    },
    {
        base: 'brain damage',
        pluralised: 'brain damages',
        indefAr: 'a brain damage'
    },
    {
        base: 'fire',
        pluralised: 'fires',
        indefAr: 'a fire'
    },
    {
        base: 'water',
        pluralised: 'waters',
        indefAr: 'a water'
    },
    {
        base: 'ground',
        pluralised: 'grounds',
        indefAr: 'a ground'
    },
    {
        base: 'rock',
        pluralised: 'rocks',
        indefAr: 'a rock'
    },
];
const events: noun[] = [

];
const vehicles:noun[] = [
    {
        base: 'car',
        pluralised: 'cars',
        indefAr: 'a car'
    },
    {
        base: 'truck',
        pluralised: 'trucks',
        indefAr: 'a truck'
    },
    {
        base: 'bus',
        pluralised: 'buses',
        indefAr: 'a bus'
    },
    {
        base: 'train',
        pluralised: 'trains',
        indefAr: 'a train'
    },
    {
        base: 'tram',
        pluralised: 'trams',
        indefAr: 'a tram'
    }
]

export const names: noun[] = [].concat(gender)
.concat(famMembers).concat(people).concat(animals).concat(structs).concat(concepts).concat(things).concat(events).concat(vehicles)












export const verbs: verb[] = [

];
[
    'explode',
    'change',
    'evolve',
    'grow',
    'run away',
    'growl',
    'bark',
    'sob',
    'cry',
    'sleep',
    'woof',
    'get a sex change',
    'spy on people',
    'confuse random people',
    'try drugs',
    'regret everything',
    'cries',
    'ignore warnings',
    'panic',
    'attempt murder',
    'commit arson',
    'commit tax fraud',
    'relax',
    'remain calm',
    'hyperventilate'
];

export const descriptors: string[] = [
    'nice',
    'kind',
    'smelly',
    'bad',
    'good',
    'amazing',
    'slow',
    'fast',
    'moderately paced',
    'cow-shaped',
    'loud',
    'quiet',
    'talented',
    'stinky',
    'contagious',
    'outrageous',
    'angry',
    'trumpet sounding',
    'obese',
    'elongated',
    'spaghettified',
    'short',
    'tiny',
    'horny',
    'fuzzy',
    'furry',
    'intelligent',
    'incoherent',
    'inconspicuous',
    'embarrassed',
    'suspicious',
    'sour',
    'depressed',
    'sad',
    'bombastic',
    'undrinkable',
    'horrible',
    'dangerous',
    'insane',
    'ashamed'
];