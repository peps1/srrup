#!/usr/bin/env node

/* eslint-disable no-console */

import './env';

import minimist from 'minimist';

import * as utils from './utils';
import * as cookies from './cookies';
import * as srr from './srr';
import * as backfill from './backfill';


const args = minimist(process.argv.slice(2), {

    // All options / switches
    'boolean': [
        'debug',
        'help',
        'login',
        'version'
    ],

    // Aliases for options
    alias: {
        d: 'debug',
        h: 'help',
        l: 'login',
        v: 'version'
    },

});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(async () => {

    // Ensure config and backfill folder are created
    utils.setFolder(utils.configFolder)
    utils.setFolder(utils.backfillFolder);

    // -h | --help command
    if (args.help) {
        console.log(utils.printHelpText);
    }

    // -v | --version command
    else if (args.version) {
        console.log(utils.version);
    }

    // -l | --login command
    else if (args.login) {
        const validCookie = await cookies.checkLoginCookie()
        if (!validCookie) {
            console.log('Please login to srrdb.com...');
            cookies.getLoginCookie();
        }
    }

    // When no switch consider every parameter as file to upload
    // https://github.com/substack/minimist#var-argv--parseargsargs-opts
    else if (args._) {
        // User needs to log in first.
        const cookie = process.env.COOKIE || '';
        if (cookie === '') {
            console.log('No existing login cookie found, please login to srrdb.com first...');
            await cookies.getLoginCookie();
        }

        let lastUploadSuccessful = false;

        // Call srrUpload for each file
        args._.forEach((file: string) => {
            if (srr.srrUpload(file)) {
                lastUploadSuccessful = true;
            } else {
                lastUploadSuccessful = false;
            }
        });

        // if the most recent file upload succeeded, take a look in backfill folder and process them
        if (lastUploadSuccessful){
            backfill.processBackfill();
        }
    }


})();
