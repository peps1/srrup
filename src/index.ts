#!/usr/bin/env node

/* eslint-disable no-console */

import { config } from 'dotenv'
import 'minimist'
import * as functions from './functions';
import minimist from 'minimist';

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

})


if (args.help) {
  console.log(functions.printHelpText);
}

else if (args.version) {
  console.log(functions.version);
}

else if (args.login) {
  console.log('Please login to srrdb.com...');
  functions.getLoginCookie();
}

// When no switch consider every parameter as file to upload
else if (args._) {
  console.log(args._);
  args._.forEach((file: string) => {
    console.log(`Uploading file: ${file}`)
  //  // functions.srrUpload(file);
  });
}


