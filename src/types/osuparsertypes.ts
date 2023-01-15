
export type Beatmap = {
    general: BeatmapGeneralSection,
    editor: BeatmapEditorSection,
    difficulty: BeatmapDifficultySection,
    metadata: BeatmapMetadataSection,
    colors: BeatmapColorSection,
    events: BeatmapEventSection,
    controlPoints: ControlPointInfo,
    hitObjects: (HittableObject | SlidableObject)[],
    fileFormat: number,
    fileUpdateDate: Date,
    originalMode: number;
};

export type BeatmapGeneralSection = {
    audioFileName: string,
    overlayPosition: string,
    skinPreference: string,
    audioLeadIn: number,
    previewTime: number,
    countdown: number,
    stackLeniency: number,
    countdownOffset: number,
    sampleSeet: number,
    letterboxInBreaks: boolean,
    useSkinSprites: boolean,
    epilepsyWarning: boolean,
    specialStyle: boolean,
    widescreenStoryboard: boolean,
    samplesMatchPlaybackRate: boolean,
};

export type BeatmapEditorSection = {
    bookmarks: any[],
    distanceSpacing: number,
    beatDivisor: number,
    gridSize: number,
    timelineZoom: number,
};

export type BeatmapDifficultySection = {
    _CS: number,
    _HP: number,
    _OD: number,
    _multiplier: number,
    _tickRate: number,
    _rate: number,
};

export type BeatmapMetadataSection = {
    title: string,
    artist: string,
    creator: string,
    version: string,
    source: string,
    tags: string[],
    beatmapId: number,
    beatmapSetId: number,
    _titleUnicode: string,
    _artistUnicode: string,
};
export type BeatmapColorSection = {
    comboColors: Color[];
};

export type BeatmapEventSection = {
    backgroundPath: string,
    breaks: BeatmapBreakEvent[],
    storyboard: any,
};

export type ControlPointInfo = {
    groups: ControlPointGroup[],
    difficultyPoints: any[];
};

export type HittableObject = {
    kiai: boolean,
    nestedHitObjects: any[],
    startTime: number,
    hitType: number,
    hitSound: number,
    samples: HitSample[],
    startPostion: Vector2,
    hitWindows: HitWindows,
    isNewCombo: boolean,
    comboOffset: number;
};

export type SlidableObject = {
    kiai: boolean,
    nestedHitObjects: any[],
    startTime: number,
    hitType: number,
    hitSound: number,
    samples: HitSample[],
    startPostion: Vector2,
    hitWindows: HitWindows,
    repeats: number,
    velocity: number,
    path: SliderPath,
    legacyLastTickOffset: number,
    nodeSamples: HitSample[][],
    isNewCombo: boolean,
    comboOffset: number;
};

export type Color = {
    red: number,
    green: number,
    blue: number,
    alpha: number;
};

export type BeatmapBreakEvent = {
    startTime: number,
    endTime: number,
};

export type ControlPointGroup = {
    controlPoints: (TimingPoint | SamplePoint)[],
    startTime: number;
};

export type TimingPoint = {
    group: any,
    pointType: number,
    _beatLength: number,
    timeSignature: number;
};

export type SamplePoint = {
    group: any,
    pointType: number,
    sampleSet: 'Soft' | 'Drum' | 'Normal',
    customIndex: number,
    volume: number;
};

export type HitSample = {
    sampleSet: 'Soft' | 'Drum' | 'Normal',
    hitSound: string,
    customIndex: number,
    suffix: string,
    volume: number,
    isLayered: boolean,
    filename: string;
};

export type Vector2 = {
    x: number, y: number;
};

export type HitWindows = {
    _perfect: number,
    _great: number,
    _good: number,
    _ok: number,
    _meh: number,
    _miss: number,
};

export type SliderPath = {
    _calculatedLength: number,
    _calculatedPath: any[],
    _cumulativeLength: any[],
    _isCached: boolean,
    _curveType: string,
    _controlPoints: PathPoint[],
    _expectedDistance: number,
};

export type PathPoint = {
    position: Vector2,
    type: string
};