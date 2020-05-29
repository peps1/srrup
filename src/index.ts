/* eslint-disable no-console */

import { config } from 'dotenv'
import program from 'commander';
import * as functions from './functions';

// Load .env file
config()

const backfillFolder = 'backfill';

functions.setFolder(backfillFolder);

// define CLI parameters
program
  .version(functions.version);

program
  .command('upload <file>')
  .description('Upload an srr file to srrdb.')
  .action( files => {
    files.forEach((file: string) => {
      console.log(`Uploading file: ${file}`)
      // functions.srrUpload(file);
    });
  });

program
  .command('get-login')
  .alias('login')
  .description('Logging in to srrdb and getting the login cookie.')
  .action( () => {
    console.log('Executing get-login...');
    functions.getLoginCookie();
  });

program.parse(process.argv);

