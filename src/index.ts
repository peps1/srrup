
import { config } from "dotenv"
import program from 'commander';
import * as functions from './functions';

// Load .env file
config

const backfillFolder = "backfill";

functions.setFolder(backfillFolder);

// define CLI parameters
program
  .version(functions.version);

program
  .command('upload <file>')
  .description('Upload an srr file to srrdb.')
  .action(function (files) {
    files.forEach((file: string) => {
      console.log(`Uploading file: ${file}`)
      //functions.srrUpload(file);
    });
  });

program
  .command('get-login')
  .description('Logging in to srrdb and getting the login cookie.')
  .action(function () {
    console.log("Executing get-login...");
    functions.getLoginCookie();
  });

program.parse(process.argv);





