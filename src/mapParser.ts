import fs from 'fs';
import * as osufunc from './osufunc.js';
import * as osuApiTypes from './types/osuApiTypes.js';

/**
 * converts a .osu file to a JSON object
 * @param path path to the .osu file
 */
export async function mapToObject(path: string) {
    let mapString = fs.readFileSync(path, 'utf8');
    /**
     * osu file format v{num}
     * [General]
     * AudioFilename: {audioFilename}
     * AudioLeadIn: {audioLeadIn}
     * PreviewTime: {previewTime}
     * Countdown: {countdown}
     * SampleSet: {sampleSet}
     * StackLeniency: {stackLeniency}
     * Mode: {mode}
     * LetterboxInBreaks: {letterboxInBreaks}
     * SpecialStyle: {specialStyle}
     * WidescreenStoryboard: {widescreenStoryboard}
     * [Editor]
     * DistanceSpacing: {distanceSpacing}
     * BeatDivisor: {beatDivisor}
     * GridSize: {gridSize}
     * TimelineZoom: {timelineZoom}
     * [Metadata]
     * Title:{title}
     * TitleUnicode: {titleUnicode}
     * Artist: {artist}
     * ArtistUnicode: {artistUnicode}
     * Creator: {creator}
     * Version: {version}
     * Source: {source}
     * Tags: {tags}
     * BeatmapID: {beatmapID}
     * BeatmapSetID: {beatmapSetID}
     * [Difficulty]
     * HPDrainRate: {hpDrainRate}
     * CircleSize: {circleSize}
     * OverallDifficulty: {overallDifficulty}
     * ApproachRate: {approachRate}
     * SliderMultiplier: {sliderMultiplier}
     * SliderTickRate: {sliderTickRate}
     * [Events]
     * //Background and Video events
     * {backgroundAndVideoEvents}
     * //Break Periods
     * {breakPeriods}
     * //Storyboard Layer 0 (Background)
     * {storyboardLayer0}
     * //Storyboard Layer 1 (Fail)
     * {storyboardLayer1}
     * //Storyboard Layer 2 (Pass)
     * {storyboardLayer2}
     * //Storyboard Layer 3 (Foreground)
     * {storyboardLayer3}
     * //Storyboard Layer 4 (Overlay)
     * {storyboardLayer4}
     * //Storyboard Sound Samples
     * {storyboardSoundSamples}
     * [TimingPoints]
     * {timingPoints}
     * [Colours]
     * Combo1: {combo1}
     * Combo2: {combo2}
     * Combo3: {combo3}
     * Combo4: {combo4}
     * Combo5: {combo5}
     * Combo6: {combo6}
     * Combo7: {combo7}
     * Combo8: {combo8}
     * SliderBorder: {sliderBorder}
     * SliderTrackOverride: {sliderTrackOverride}
     * [HitObjects]
     * {hitObjects}
     */

    let mapObject: mapObject = {
        General: {
            AudioFilename: mapString?.split('AudioFilename:')[1]?.split('\n')[0],
            AudioLeadIn: +mapString?.split('AudioLeadIn:')[1]?.split('\n')[0],
            PreviewTime: +mapString?.split('PreviewTime:')[1]?.split('\n')[0],
            Countdown: +mapString?.split('Countdown:')[1]?.split('\n')[0],
            SampleSet: mapString?.split('SampleSet:')[1]?.split('\n')[0],
            StackLeniency: +mapString?.split('StackLeniency:')[1]?.split('\n')[0],
            Mode: +mapString?.split('Mode:')[1]?.split('\n')[0],
            LetterboxInBreaks: +mapString?.split('LetterboxInBreaks:')[1]?.split('\n')[0],
            SpecialStyle: +mapString?.split('SpecialStyle:')[1]?.split('\n')[0],
            WidescreenStoryboard: +mapString?.split('WidescreenStoryboard:')[1]?.split('\n')[0]
        },
        Editor: {
            DistanceSpacing: +mapString?.split('DistanceSpacing:')[1]?.split('\n')[0],
            BeatDivisor: +mapString?.split('BeatDivisor:')[1]?.split('\n')[0],
            GridSize: +mapString?.split('GridSize:')[1]?.split('\n')[0],
            TimelineZoom: +mapString?.split('TimelineZoom:')[1]?.split('\n')[0],
        },
        Metadata: {
            Title: mapString?.split('Title:')[1]?.split('\n')[0],
            TitleUnicode: mapString?.split('TitleUnicode:')[1]?.split('\n')[0],
            Artist: mapString?.split('Artist:')[1]?.split('\n')[0],
            ArtistUnicode: mapString?.split('ArtistUnicode:')[1]?.split('\n')[0],
            Creator: mapString?.split('Creator:')[1]?.split('\n')[0],
            Version: mapString?.split('Version:')[1]?.split('\n')[0],
            Source: mapString?.split('Source:')[1]?.split('\n')[0],
            Tags: mapString?.split('Tags:')[1]?.split('\n')[0],
            BeatmapID: +mapString?.split('BeatmapID:')[1]?.split('\n')[0],
            BeatmapSetID: +mapString?.split('BeatmapSetID:')[1]?.split('\n')[0],
        },
        Difficulty: {
            HPDrainRate: +mapString?.split('HPDrainRate:')[1]?.split('\n')[0],
            CircleSize: +mapString?.split('CircleSize:')[1]?.split('\n')[0],
            OverallDifficulty: +mapString?.split('OverallDifficulty:')[1]?.split('\n')[0],
            ApproachRate: +mapString?.split('ApproachRate:')[1]?.split('\n')[0],
            SliderMultiplier: +mapString?.split('SliderMultiplier:')[1]?.split('\n')[0],
            SliderTickRate: +mapString?.split('SliderTickRate:')[1]?.split('\n')[0],
        },
        Events: {
            BackgroundAndVideoEvents: [],
            BreakPeriods: [],
            StoryboardLayer0: [],
            StoryboardLayer1: [],
            StoryboardLayer2: [],
            StoryboardLayer3: [],
            StoryboardLayer4: [],
            StoryboardSoundSamples: []
        },
        TimingPoints: mapToObject_TimingPoints(mapString),
        HitObjects: mapToObject_HitObjects(mapString,
            osufunc.modeValidator(+mapString?.split('Mode:')[1]?.split('\n')[0])
        )

    };
    return mapObject;
}

export async function mapObject_Alt(path: string) {
    let mapString = fs.readFileSync(path, 'utf8');
    /**
     * osu file format v{num}
     * [General]
     * AudioFilename: {audioFilename}
     * AudioLeadIn: {audioLeadIn}
     * PreviewTime: {previewTime}
     * Countdown: {countdown}
     * SampleSet: {sampleSet}
     * StackLeniency: {stackLeniency}
     * Mode: {mode}
     * LetterboxInBreaks: {letterboxInBreaks}
     * SpecialStyle: {specialStyle}
     * WidescreenStoryboard: {widescreenStoryboard}
     * [Editor]
     * DistanceSpacing: {distanceSpacing}
     * BeatDivisor: {beatDivisor}
     * GridSize: {gridSize}
     * TimelineZoom: {timelineZoom}
     * [Metadata]
     * Title:{title}
     * TitleUnicode: {titleUnicode}
     * Artist: {artist}
     * ArtistUnicode: {artistUnicode}
     * Creator: {creator}
     * Version: {version}
     * Source: {source}
     * Tags: {tags}
     * BeatmapID: {beatmapID}
     * BeatmapSetID: {beatmapSetID}
     * [Difficulty]
     * HPDrainRate: {hpDrainRate}
     * CircleSize: {circleSize}
     * OverallDifficulty: {overallDifficulty}
     * ApproachRate: {approachRate}
     * SliderMultiplier: {sliderMultiplier}
     * SliderTickRate: {sliderTickRate}
     * [Events]
     * //Background and Video events
     * {backgroundAndVideoEvents}
     * //Break Periods
     * {breakPeriods}
     * //Storyboard Layer 0 (Background)
     * {storyboardLayer0}
     * //Storyboard Layer 1 (Fail)
     * {storyboardLayer1}
     * //Storyboard Layer 2 (Pass)
     * {storyboardLayer2}
     * //Storyboard Layer 3 (Foreground)
     * {storyboardLayer3}
     * //Storyboard Layer 4 (Overlay)
     * {storyboardLayer4}
     * //Storyboard Sound Samples
     * {storyboardSoundSamples}
     * [TimingPoints]
     * {timingPoints}
     * [Colours]
     * Combo1: {combo1}
     * Combo2: {combo2}
     * Combo3: {combo3}
     * Combo4: {combo4}
     * Combo5: {combo5}
     * Combo6: {combo6}
     * Combo7: {combo7}
     * Combo8: {combo8}
     * SliderBorder: {sliderBorder}
     * SliderTrackOverride: {sliderTrackOverride}
     * [HitObjects]
     * {hitObjects}
     */

    let mapObject: mapObject = {
        General: {
            AudioFilename: null,
            AudioLeadIn: null,
            PreviewTime: null,
            Countdown: null,
            SampleSet: null,
            StackLeniency: null,
            Mode: +mapString?.split('Mode:')[1]?.split('\n')[0],
            LetterboxInBreaks: null,
            SpecialStyle: null,
            WidescreenStoryboard: null,
        },
        Editor: {
            DistanceSpacing: null,
            BeatDivisor: null,
            GridSize: null,
            TimelineZoom: null,
        },
        Metadata: {
            Title: null,
            TitleUnicode: null,
            Artist: null,
            ArtistUnicode: null,
            Creator: null,
            Version: null,
            Source: null,
            Tags: null,
            BeatmapID: null,
            BeatmapSetID: null,
        },
        Difficulty: {
            HPDrainRate: +mapString?.split('HPDrainRate:')[1]?.split('\n')[0],
            CircleSize: +mapString?.split('CircleSize:')[1]?.split('\n')[0],
            OverallDifficulty: +mapString?.split('OverallDifficulty:')[1]?.split('\n')[0],
            ApproachRate: +mapString?.split('ApproachRate:')[1]?.split('\n')[0],
            SliderMultiplier: +mapString?.split('SliderMultiplier:')[1]?.split('\n')[0],
            SliderTickRate: +mapString?.split('SliderTickRate:')[1]?.split('\n')[0],
        },
        Events: {
            BackgroundAndVideoEvents: [],
            BreakPeriods: [],
            StoryboardLayer0: [],
            StoryboardLayer1: [],
            StoryboardLayer2: [],
            StoryboardLayer3: [],
            StoryboardLayer4: [],
            StoryboardSoundSamples: []
        },
        TimingPoints: mapToObject_TimingPoints(mapString),
        HitObjects: mapToObject_HitObjects(mapString,
            osufunc.modeValidator(+mapString?.split('Mode:')[1]?.split('\n')[0])
        )

    };
    return mapObject;
}

export function mapToObject_TimingPoints(str: string) {
    const arr: timingPoints[] = [];
    const section = str.split('[TimingPoints]\n')[1]?.split('[')[0];

    for (let i = 0; i < section?.split('\n')?.length ?? 0; i++) {
        const cur = section.split('\n')[i];
        if (cur.trim().length == 0) break;
        const curAsArr = cur.split(',');
        arr.push({
            Offset: +curAsArr[0],
            MsPerBeat: +curAsArr[1],
            Meter: +curAsArr[2],
            SampleType: +curAsArr[3],
            SampleSet: +curAsArr[4],
            Volume: +curAsArr[5],
            Inherited: +curAsArr[6],
            Kiai: +curAsArr[7],
        });
    }
    return arr;
}

export function mapToObject_HitObjects(str: string, mode: osuApiTypes.GameMode) {
    const arr: hitObjects[] = [];
    const section = str.split('[HitObjects]')[1];

    //for each line, get the hitobject
    for (let i = 0; i < section?.split('\n')?.length ?? 0; i++) {
        const cur = section.split('\n')[i];
        if (!(cur.trim().length == 0)) {
            const currentObject: hitObjects = {
                position: {
                    x: +cur.split(',')[0],
                    y: +cur.split(',')[1]
                },
                time: +cur.split(',')[2]
            };

            switch (mode) {
                case 'osu': default: {

                }
                    break;
                case 'taiko': {

                }
                    break;
                case 'fruits': {

                }
                    break;
                case 'mania': {

                }
                    break;
            }
            arr.push(currentObject);
        }
    }
    return arr;
}

export type mapObject = {
    General: {
        AudioFilename: string,
        AudioLeadIn: number,
        PreviewTime: number,
        Countdown: number,
        SampleSet: string,
        StackLeniency: number,
        Mode: number,
        LetterboxInBreaks: number,
        SpecialStyle: number,
        WidescreenStoryboard: number;
    },
    Editor: {
        DistanceSpacing: number,
        BeatDivisor: number,
        GridSize: number,
        TimelineZoom: number;
    },
    Metadata: {
        Title: string,
        TitleUnicode: string,
        Artist: string,
        ArtistUnicode: string,
        Creator: string,
        Version: string,
        Source: string,
        Tags: string,
        BeatmapID: number,
        BeatmapSetID: number;
    },
    Difficulty: {
        HPDrainRate: number,
        CircleSize: number,
        OverallDifficulty: number,
        ApproachRate: number,
        SliderMultiplier: number,
        SliderTickRate: number;
    },
    Events: {
        BackgroundAndVideoEvents: string[],
        BreakPeriods: string[];
        StoryboardLayer0: string[],
        StoryboardLayer1: string[],
        StoryboardLayer2: string[],
        StoryboardLayer3: string[],
        StoryboardLayer4: string[],
        StoryboardSoundSamples: string[];
    },
    TimingPoints: timingPoints[],
    HitObjects: hitObjects[],
};

/**
 * {string} {number} {number} {number|string} {number}
 */
export type storyboardLayer = {
    type: string, //Sprite, Animation, Sample
    layer: string,
    origin: string,
    filepath: string,
    x: number,
    y: number,
    actions: storyboardActions[];
};
export type storyboardActions = string | number;

/**
 * offset, num, num, num, num, vol%, num, num,
 * corresponds to:
 * offset, ms per beat (slider velocity mult if negative), meter, sample set, count, volume, inherited, kiai
 * 154,352.941176470588,4,2,6,25,1,0
 * 154ms, 352.941176470588ms per beat, 4/4, soft, 6, 25%, not inherited, not kiai
 * 2095,-25,4,2,6,25,0,0
 * 2095ms, previous timing / 0.25 = slider velocity, 4/4, soft, 6, 25%, inherited, not kiai
 * 
*/
export type timingPoints = {
    Offset: number,
    MsPerBeat: number,
    Meter: number,
    SampleType: number,
    SampleSet: number,
    Volume: number,
    Inherited: number,
    Kiai: number;
};

export type hitObjects = circle | slider | spinner;

export type baseHitObject = {
    position: {
        x: number,
        y: number;
    },
    time: number,
};

/**
 * 112,120,154,5,0,0:0:0:0:
 * x, y, time, type, hitSound, extras
 */
export type circle = baseHitObject & {
    type?: number,
    hitsound?: number,
    //
    //
    //
    //
};

/**
 * 390,275,5270,6,0,P|395:333|403:346,3,46.4100002832642,10|8|8|8,0:2|0:3|0:3|0:3,0:0:0:0:
 * x, y, time, type, hitsound, curve, repeat, pixelLength, edgeHitsounds, edgeAdditions
 */
export type slider = baseHitObject & {
    curveType: string,
    curvePoints: {
        x: number,
        y: number,
    }[];

    //
    //
    //
    //
};

/**
 * 256,192,29536,12,14,30506,0:0:0:0:
 * x, y, time, 
 */
export type spinner = baseHitObject & {
    //
    //
    timeEnding: number;
    //
    //
    //
    //
};