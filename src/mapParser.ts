import charttoimg from 'chartjs-to-image';
import fs from 'fs';
import fetch from 'node-fetch';
import perf from 'perf_hooks';
import rosu from 'rosu-pp';
import Sequelize from 'sequelize';
import config from '../config/config.json';
import * as cmdchecks from './checks.js';
import * as osumodcalc from './osumodcalc.js';
import * as extypes from './types/extratypes.js';
import * as osuApiTypes from './types/osuApiTypes.js';

async function mapToObject(path: string) {
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
        general: {
            audioFilename: '',
            audioLeadIn: 0,
            previewTime: 0,
            countdown: 0,
            sampleSet: '',
            stackLeniency: 0,
            mode: 0,
            letterboxInBreaks: 0,
            specialStyle: 0,
            widescreenStoryboard: 0
        },
        editor: {
            distanceSpacing: 0,
            beatDivisor: 0,
            gridSize: 0,
            timelineZoom: 0
        },
        metadata: {
            title: '',
            titleUnicode: '',
            artist: '',
            artistUnicode: '',
            creator: '',
            version: '',
            source: '',
            tags: '',
            beatmapID: 0,
            beatmapSetID: 0
        },
        difficulty: {
            hpDrainRate: 0,
            circleSize: 0,
            overallDifficulty: 0,
            approachRate: 0,
            sliderMultiplier: 0,
            sliderTickRate: 0
        },
        events: {
            backgroundAndVideoEvents: [],
            breakPeriods: [],
            storyboardLayer0: [],
            storyboardLayer1: [],
            storyboardLayer2: [],
            storyboardLayer3: [],
            storyboardLayer4: [],
            storyboardSoundSamples: []
        },
        timingPoints: {

        },
        hitObjects: {

        }

    };


}

export type mapObject = {
    general: {
        audioFilename: string,
        audioLeadIn: number,
        previewTime: number,
        countdown: number,
        sampleSet: string,
        stackLeniency: number,
        mode: number,
        letterboxInBreaks: number,
        specialStyle: number,
        widescreenStoryboard: number;
    },
    editor: {
        distanceSpacing: number,
        beatDivisor: number,
        gridSize: number,
        timelineZoom: number;
    },
    metadata: {
        title: string,
        titleUnicode: string,
        artist: string,
        artistUnicode: string,
        creator: string,
        version: string,
        source: string,
        tags: string,
        beatmapID: number,
        beatmapSetID: number;
    },
    difficulty: {
        hpDrainRate: number,
        circleSize: number,
        overallDifficulty: number,
        approachRate: number,
        sliderMultiplier: number,
        sliderTickRate: number;
    },
    events: {
        backgroundAndVideoEvents: string[],
        breakPeriods: string[];
        storyboardLayer0: string[],
        storyboardLayer1: string[],
        storyboardLayer2: string[],
        storyboardLayer3: string[],
        storyboardLayer4: string[],
        storyboardSoundSamples: string[];
    },
    timingPoints: {

    },
    hitObjects: {
    },
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
    offset: number,
    msPerBeat: number,
    meter: number,
    sampleType: number,
    sampleSet: number,
    volume: number,
    inherited: number,
    kiai: number;
};

export type hitObjects = circle | slider | spinner;

/**
 * 112,120,154,5,0,0:0:0:0:
 * x, y, time, type, hitSound, extras
 */
export type circle = {

};

/**
 * 390,275,5270,6,0,P|395:333|403:346,3,46.4100002832642,10|8|8|8,0:2|0:3|0:3|0:3,0:0:0:0:
 * x, y, time, type, hitsound, curve, repeat, pixelLength, edgeHitsounds, edgeAdditions
 */
export type slider = {};

/**
 * 256,192,29536,12,14,30506,0:0:0:0:
 * x, y, time, 
 */
export type spinner = {};