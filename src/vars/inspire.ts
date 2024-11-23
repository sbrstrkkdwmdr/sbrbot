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
    ing: string, // doing
    present: string, //does
};


export const templateStrings: quoteTemplate[] = [
    {
        string: 'Become the name1ba who makes other name1pl verb1ba',
        names: 1,
        verbs: 1,
        descriptors: 0,
    },
    {
        string: 'There are okay name1pl and not-so-okay name1pl',
        names: 1,
        verbs: 0,
        descriptors: 0,
    },
    {
        string: 'Forcing a name1ba to be your name2ba is probably not as descriptor1 as it sounds',
        names: 2,
        verbs: 0,
        descriptors: 1,
    },
    {
        string: 'name1ba is name2ba on steroids',
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
        string: 'Never let go of an opportunity to verb1ba',
        names: 0,
        verbs: 1,
        descriptors: 0,
    },
    {
        string: 'In order to acheive success, you must verb1ba',
        names: 0,
        verbs: 1,
        descriptors: 0,
    },
    {
        string: 'Always remember that you are a(n) descriptor1 name1ba',
        names: 1,
        verbs: 0,
        descriptors: 1,
    },
    {
        string: 'Seek name1ba, seek name2ba',
        names: 2,
        verbs: 0,
        descriptors: 0,
    },
    {
        string: 'you\'re descriptor1, but so is name1ia',
        names: 1,
        verbs: 0,
        descriptors: 1,
    },
    {
        string: 'verb1ba and verb2ba',
        names: 0,
        verbs: 2,
        descriptors: 0,
    },
    {
        string: 'keep calm and verb1ba',
        names: 0,
        verbs: 1,
        descriptors: 0,
    },
    {
        string: 'be the first to verb1ba what any normal person would consider descriptor1',
        names: 0,
        verbs: 1,
        descriptors: 1,
    },
    {
        string: 'the name1ba begins when the name2ba ends',
        names: 2,
        verbs: 0,
        descriptors: 0,
    },
    {
        string: 'without verb1ba there can be no name1ba',
        names: 1,
        verbs: 1,
        descriptors: 0,
    },
    {
        string: 'name1pl begin when we learn to verb1ba',
        names: 1,
        verbs: 1,
        descriptors: 0,
    },
    {
        string: 'ensure that your name1ba feels descriptor1',
        names: 1,
        verbs: 0,
        descriptors: 1,
    },
    {
        string: 'you can be the reason why a name1ba verb1pr',
        names: 1,
        verbs: 1,
        descriptors: 0,
    },
    {
        string: 'someone should verb1ba. You can be that someone',
        names: 0,
        verbs: 1,
        descriptors: 0,
    },
    {
        string: 'You carry the potential to become a descriptor1 name1ba',
        names: 1,
        verbs: 0,
        descriptors: 1,
    },
    {
        string: 'Don\'t verb1ba with name1ba. verb2ba name2pl',
        names: 2,
        verbs: 2,
        descriptors: 0,
    },
    {
        string: 'a name1ba is never just a name2ba, but its not a name3ba',
        names: 3,
        verbs: 0,
        descriptors: 0,
    },
    {
        string: 'first comes the name1ba, then comes the name2ba',
        names: 2,
        verbs: 0,
        descriptors: 0,
    },
    {
        string: 'name1ba is worth it. Thank you',
        names: 1,
        verbs: 0,
        descriptors: 0,
    },
    {
        string: 'Society without name1ba is no fun.',
        names: 1,
        verbs: 0,
        descriptors: 0,
    },
    {
        string: 'Are descriptor1 name1pl better than other name1pl?',
        names: 1,
        verbs: 0,
        descriptors: 1,
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
    {
        base: 'person',
        pluralised: 'people',
        indefAr: 'a person'
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
    {
        base: 'sex change',
        pluralised: 'sex changes',
        indefAr: 'a sex change'
    },
    {
        base: 'warning',
        pluralised: 'warnings',
        indefAr: 'a warning'
    },
    {
        base: 'murder',
        pluralised: 'murders',
        indefAr: 'a murder'
    },
    {
        base: 'arson',
        pluralised: 'arson',
        indefAr: 'arson'
    },
    {
        base: 'tax fraud',
        pluralised: 'tax fraud',
        indefAr: 'tax fraud'
    },
    {
        base: 'secret death cult',
        pluralised: 'secret death cults',
        indefAr: 'a secret death cult'
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
    {
        base: 'drug',
        pluralised: 'drugs',
        indefAr: 'a drug'
    },
    {
        base: 'everything',
        pluralised: 'everything',
        indefAr: 'everything'
    },
];
const events: noun[] = [

];
const vehicles: noun[] = [
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
];

export const names: noun[] = [].concat(gender)
    .concat(famMembers).concat(people).concat(animals).concat(structs).concat(concepts).concat(things).concat(events).concat(vehicles);











//add more verbs to the array below
export const verbs: verb[] = [
    {
        base: 'explode',
        past: 'exploded',
        ing: 'exploding',
        present: 'explodes',
    },
    {
        base: 'change',
        past: 'changed',
        ing: 'changing',
        present: 'changes',
    },
    {
        base: 'evolve',
        past: 'evolved',
        ing: 'evolving',
        present: 'evolves',
    },
    {
        base: 'grow',
        past: 'grew',
        ing: 'growing',
        present: 'grows',
    },
    {
        base: 'run away',
        past: 'ran away',
        ing: 'running away',
        present: 'runs away',
    },
    {
        base: 'growl',
        past: 'growled',
        ing: 'growling',
        present: 'growls',
    },
    {
        base: 'bark',
        past: 'barked',
        ing: 'barking',
        present: 'barks',
    },
    {
        base: 'sob',
        past: 'sobbed',
        ing: 'sobbing',
        present: 'null',
    },
    {
        base: 'cry',
        past: 'cried',
        ing: 'crying',
        present: 'cries',
    },
    {
        base: 'sleep',
        past: 'slept',
        ing: 'sleeping',
        present: 'sleeps',
    },
    {
        base: 'woof',
        past: 'woofed',
        ing: 'woofing',
        present: 'woofs',
    },
    {
        base: 'spy on',
        past: 'spied on',
        ing: 'spying on',
        present: 'spies on',
    },
    {
        base: 'confuse',
        past: 'confused',
        ing: 'confusing',
        present: 'confuses',
    },
    {
        base: 'try drugs',
        past: 'exploded',
        ing: 'exploding',
        present: 'explodes',
    },
    {
        base: 'regret',
        past: 'regretted',
        ing: 'regretting',
        present: 'regrets',
    },
    {
        base: 'ignore',
        past: 'ignored',
        ing: 'ignoring',
        present: 'ignores',
    },
    {
        base: 'panic',
        past: 'panicked',
        ing: 'panicking',
        present: 'panics',
    },
    {
        base: 'attempt',
        past: 'attempted',
        ing: 'attempting',
        present: 'attempts',
    },
    {
        base: 'commit',
        past: 'committed',
        ing: 'committing',
        present: 'commits',
    },
    {
        base: 'relax',
        past: 'relaxed',
        ing: 'relaxing',
        present: 'relaxes',
    },
    {
        base: 'remain calm',
        past: 'remained calm',
        ing: 'remaining calm',
        present: 'remains calm',
    },
    {
        base: 'hyperventilate',
        past: 'hyperventilated',
        ing: 'hyperventilating',
        present: 'hyperventilates',
    },
    {
        base: 'do',
        past: 'did',
        ing: 'doing',
        present: 'does',
    },
    {
        base: 'exist',
        past: 'existed',
        ing: 'existing',
        present: 'exists',
    },
    {
        base: 'fight',
        past: 'fought',
        ing: 'fighting',
        present: 'fights',
    },
    {
        base: 'yell at',
        past: 'yelled at',
        ing: 'yelling at',
        present: 'yells at',
    },
    {
        base: 'scream',
        past: 'screamed',
        ing: 'screaming',
        present: 'screams',
    },
    {
        base: 'shout',
        past: 'shouted',
        ing: 'shouting',
        present: 'shouts',
    },
    {
        base: 'punch',
        past: 'punched',
        ing: 'punching',
        present: 'punchs',
    },
    {
        base: 'kick',
        past: 'kicked',
        ing: 'kicking',
        present: 'kicks',
    },
    {
        base: 'burn down',
        past: 'burnt down',
        ing: 'burning down',
        present: 'burns down',
    },
    {
        base: 'burn',
        past: 'burnt',
        ing: 'burning',
        present: 'burns',
    },
    {
        base: 'jump',
        past: 'jumped',
        ing: 'jumping',
        present: 'jumps',
    },
    {
        base: 'spin',
        past: 'spun',
        ing: 'spinning',
        present: 'spins',
    },
    {
        base: 'run',
        past: 'ran',
        ing: 'running',
        present: 'runs',
    },
    {
        base: 'detonate',
        past: 'detonated',
        ing: 'detonating',
        present: 'detonates',
    },
    {
        base: 'find',
        past: 'found',
        ing: 'finding',
        present: 'finds',
    },
    {
        base: 'walk',
        past: 'walked',
        ing: 'walking',
        present: 'walks',
    },
    {
        base: 'ensure',
        past: 'ensured',
        ing: 'ensuring',
        present: 'ensures',
    },
    {
        base: 'test',
        past: 'tested',
        ing: 'testing',
        present: 'tests',
    },
    {
        base: 'water',
        past: 'watered',
        ing: 'watering',
        present: 'waters',
    },
    {
        base: 'open',
        past: 'opened',
        ing: 'opening',
        present: 'opens',
    },
    {
        base: 'close',
        past: 'closed',
        ing: 'closing',
        present: 'closes',
    },
    {
        base: 'patronise',
        past: 'patronised',
        ing: 'patronising',
        present: 'patronises',
    },
    {
        base: 'paint',
        past: 'painted',
        ing: 'painting',
        present: 'paints',
    },
    {
        base: 'oxidise',
        past: 'oxidised',
        ing: 'oxidising',
        present: 'oxidises',
    },
    {
        base: 'oxygenate',
        past: 'oxygenated',
        ing: 'oxygenating',
        present: 'oxygenates',
    },
    {
        base: 'have',
        past: 'had',
        ing: 'having',
        present: 'has',
    },
    {
        base: 'say',
        past: 'said',
        ing: 'saying',
        present: 'says',
    },
    {
        base: 'get',
        past: 'got',
        ing: 'getting',
        present: 'gets',
    },
    {
        base: 'make',
        past: 'made',
        ing: 'making',
        present: 'makes',
    },
    {
        base: 'go',
        past: 'is gone',
        ing: 'going',
        present: 'goes',
    },
    {
        base: 'know',
        past: 'knew',
        ing: 'knowing',
        present: 'knows',
    },
    {
        base: 'take',
        past: 'took',
        ing: 'taking',
        present: 'takes',
    },
    {
        base: 'see',
        past: 'saw',
        ing: 'seeing',
        present: 'sees',
    },
    {
        base: 'come',
        past: 'came',
        ing: 'coming',
        present: 'comes',
    },
    {
        base: 'think',
        past: 'thought',
        ing: 'thinking',
        present: 'thinks',
    },
    {
        base: 'look',
        past: 'looked',
        ing: 'looking',
        present: 'looks',
    },
    {
        base: 'want',
        past: 'wanted',
        ing: 'wanting',
        present: 'wants',
    },
    {
        base: 'give',
        past: 'gave',
        ing: 'giving',
        present: 'gives',
    },
    {
        base: 'use',
        past: 'used',
        ing: 'using',
        present: 'uses',
    },
    {
        base: 'find',
        past: 'fought',
        ing: 'finding',
        present: 'finds',
    },
    {
        base: 'tell',
        past: 'told',
        ing: 'telling',
        present: 'tells',
    },
    {
        base: 'ask',
        past: 'asked',
        ing: 'asking',
        present: 'asks',
    },
    {
        base: 'work',
        past: 'worked',
        ing: 'working',
        present: 'works',
    },
    {
        base: 'seem',
        past: 'seemed',
        ing: 'seeming',
        present: 'seems',
    },
    {
        base: 'feel',
        past: 'felt',
        ing: 'feeling',
        present: 'feels',
    },
    {
        base: 'try',
        past: 'tried',
        ing: 'trying',
        present: 'tries',
    },
    {
        base: 'leave',
        past: 'left',
        ing: 'leaving',
        present: 'leaves',
    },
    {
        base: 'call',
        past: 'called',
        ing: 'calling',
        present: 'calls',
    },
    {
        base: 'spontaneously combust',
        past: 'spontaneously combusted',
        ing: 'spontaneously combusting',
        present: 'spontaneously combusts'
    },
    {
        base: 'combust',
        past: 'combusted',
        ing: 'combusting',
        present: 'combusts'
    },
    {
        base: 'die',
        past: 'died',
        ing: 'dying',
        present: 'dies'
    },
    {
        base: 'kill',
        past: 'killed',
        ing: 'killing',
        present: 'kills'
    }
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
    'ashamed',
    'explosive',
];