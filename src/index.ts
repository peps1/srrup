#!/usr/bin/env node

import "./env.ts";

import minimist from "minimist";

import * as utils from "./utils.ts";
import * as cookies from "./cookies.ts";
import * as srr from "./srr.ts";
import * as backfill from "./backfill.ts";
import process from "node:process";

const args = minimist(process.argv.slice(2), {
  // All options / switches
  "boolean": [
    "backfill",
    "debug",
    "help",
    "login",
    "version",
  ],

  // Aliases for options
  alias: {
    b: "backfill",
    d: "debug",
    h: "help",
    l: "login",
    v: "version",
  },
});

void (async () => {
  // Ensure config and backfill folder are created
  utils.setFolder(utils.configFolder);
  utils.setFolder(utils.backfillFolder);
  utils.setFolder(utils.logFolder);

  // -h | --help command
  if (args.help) {
    console.log(utils.printHelpText);
  } // -v | --version command
  else if (args.version) {
    console.log(utils.version);
  } // -l | --login command
  else if (args.login) {
    const validCookie = await cookies.checkLoginCookie();
    if (!validCookie) {
      console.log("Please login to srrdb.com...");
      await cookies.getLoginCookie();
    }
  } else if (args.backfill) {
    const validCookie = await cookies.checkLoginCookie();
    if (!validCookie) {
      console.log("Please login to srrdb.com...");
      await cookies.getLoginCookie();
    }

    void backfill.processBackfill();
  } // When no switch consider every parameter as file to upload
  // https://github.com/substack/minimist#var-argv--parseargsargs-opts
  else if (args._) {
    // User needs to log in first. We don't check if the cookie is still valid here to save unnecessary calls to srrdb.
    const cookie = process.env.COOKIE || "";
    if (cookie === "") {
      console.log(
        "No existing login cookie found, please login to srrdb.com first...",
      );
      await cookies.getLoginCookie();
    }

    let lastUploadSuccessful = false;

    // Call srrUpload for each file
    for (const file of args._) {
      const uploaded = await srr.srrUpload(file);
      if (uploaded) {
        lastUploadSuccessful = true;
      } else {
        lastUploadSuccessful = false;
      }
    }

    // if the most recent file upload succeeded, take a look in backfill folder and process them
    if (lastUploadSuccessful) {
      void backfill.processBackfill();
    }
  }
})();
