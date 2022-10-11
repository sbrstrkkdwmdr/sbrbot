import cmdchecks = require('../src/checks');
import fs = require('fs');
import calc = require('../src/calc');
import emojis = require('../src/consts/emojis');
import colours = require('../src/consts/colours');
import colourfunc = require('../src/colourcalc');
import osufunc = require('../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../src/log');
import func = require('../src/tools');
import def = require('../src/consts/defaults');
import buttonsthing = require('../src/consts/buttons');
import extypes = require('../src/types/extraTypes');
import helpinfo = require('../src/consts/helpinfo');
import msgfunc = require('./msgfunc');

export function name(input: extypes.commandInput) {
}

export function noperms(commandType, obj, type: 'bot' | 'user') {
    

        switch (type) {
            case 'user': {
                switch (commandType) {
                    //==============================================================================================================================================================================================
                    case 'interaction': {
                        obj.reply({
                            content: 'You do not have permission to use this command.',
                            embeds: [],
                            files: [],
                            ephemeral: true,
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        })
                            .catch();
                    }

                }
            }
                break;
            case 'bot': {
                switch (commandType) {
                    case 'message': {
                        obj.reply({
                            content: 'I am missing permissions to use this command.',
                            embeds: [],
                            files: [],
                            ephemeral: true,
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        })
                            .catch();
                    }
                        break;
                    //==============================================================================================================================================================================================
                    case 'interaction': {
                        obj.reply({
                            content: 'I am missing permissions to use this command.',
                            embeds: [],
                            files: [],
                            ephemeral: true,
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        })
                            .catch();
                    }
                }
            }
        }
    
}