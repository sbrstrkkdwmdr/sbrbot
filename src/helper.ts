import { Client } from 'discord.js';
import Sequelize from 'sequelize';
// bundle all functions in one file
import * as path from './path.js';
import * as api from './tools/api.js';
import * as calculate from './tools/calculate.js';
import * as checks from './tools/checks.js';
import * as colourcalc from './tools/colourcalc.js';
import * as commandTools from './tools/commands.js';
import * as data from './tools/data.js';
import * as formatter from './tools/formatters.js';
import * as game from './tools/game.js';
import * as log from './tools/log.js';
import * as other from './tools/other.js';
import * as performance from './tools/performance.js';
import * as track from './tools/trackfunc.js';

import * as argflags from './vars/argFlags.js';
import * as buttons from './vars/buttons.js';
import * as colours from './vars/colours.js';
import * as commandData from './vars/commandData.js';
import * as commandopts from './vars/commandopts.js';
import * as conversions from './vars/conversions.js';
import * as defaults from './vars/defaults.js';
import * as emojis from './vars/emojis.js';
import * as errors from './vars/errors.js';
import * as gif from './vars/gif.js';
import * as inspire from './vars/inspire.js';
import * as iso from './vars/iso.js';
import * as responses from './vars/responses.js';
import * as timezones from './vars/timezones.js';
import * as versions from './vars/versions.js';

import * as admin from './commands/admin.js';
import * as gen from './commands/general.js';
import * as fun from './commands/misc.js';
import * as osu_maps from './commands/osu_maps.js';
import * as osu_other from './commands/osu_other.js';
import * as osu_profiles from './commands/osu_profiles.js';
import * as osu_scores from './commands/osu_scores.js';
import * as osu_track from './commands/osu_track.js';

import * as bottypes from './types/bot.js';

export const tools = {
    api,
    calculate,
    checks,
    colourcalc,
    commands: commandTools,
    data,
    formatter,
    game,
    log,
    other,
    performance,
    track,
};
export const vars = {
    client: null as Client, // initialised in main.ts
    path,
    config: checks.checkConfig(),
    userdata: null as Sequelize.ModelCtor<Sequelize.Model<any, any>>, // initialised in main.ts
    guildSettings: null as Sequelize.ModelCtor<Sequelize.Model<any, any>>, // initialised in main.ts
    trackDb: null as Sequelize.ModelCtor<Sequelize.Model<any, any>>, // initialised in main.ts
    statsCache: null as Sequelize.ModelCtor<Sequelize.Model<any, any>>, // initialised in main.ts
    cooldownSet: (new Set()) as Set<string>,
    startTime: new Date(),
    id: 0,
    argflags,
    buttons,
    colours,
    commandopts,
    commandData,
    conversions,
    defaults,
    emojis,
    errors,
    gif,
    inspire,
    iso,
    responses,
    timezones,
    versions,
    reminders: [] as bottypes.reminder[],
};
export const commands = {
    gen,
    osu: {
        maps: osu_maps,
        other: osu_other,
        profiles: osu_profiles,
        scores: osu_scores,
        track: osu_track,
    },
    fun,
    admin,
};