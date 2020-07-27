#!/usr/bin/env node

/* eslint-disable no-console */

import { config } from 'dotenv'
import minimist from 'minimist';

import * as functions from './functions';

// Load .env file
config()

const backfillFolder = 'backfill';

functions.setFolder(backfillFolder);

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


  if (args.help) {
    console.log(functions.printHelpText);
  }

  else if (args.version) {
    console.log(functions.version);
  }

  else if (args.login) {
    const validCookie = await functions.checkLoginCookie()
    if (!validCookie) {
      console.log('Please login to srrdb.com...');
      functions.getLoginCookie();
    }
  }

  // When no switch consider every parameter as file to upload
  // https://github.com/substack/minimist#var-argv--parseargsargs-opts
  else if (args._) {
    // User needs to log in first.
    const cookie = process.env.COOKIE || '';
    if (cookie === '') {
      console.log('No existing login cookie found, please login to srrdb.com first...');
      await functions.getLoginCookie();
    }
    args._.forEach((file: string) => {
      console.log(`Uploading file: ${file}`)
      // functions.srrUpload(file);
    });
  }


})();
