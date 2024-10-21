import fs from "node:fs";
import os from "node:os";
import { Agent } from "node:https";
import { version as ver } from "./version.ts";

export const configFolder = `${os.homedir()}/.config/srrdb`;
export const backfillFolder = `${os.homedir()}/.config/srrdb/backfill`;
export const logFolder = `${os.homedir()}/.config/srrdb/logs`;

export const version = ver;
export const MAX_UPLOAD_SIZE = 104857600;

export const printHelpText = `Usage: srrup file.srr <file2.srr> <file3.srr>
Upload one or more .srr files to srrdb.com, if no option is specified as listed below,
all parameters are expected to be .srr files and will be uploaded.
Output will be logged to ~/.config/srrdb/logs

Example:
    srrup files/file1.srr more/file2.srr
Options:
    -l, --login     login to srrdb.com and save auth info (~/.config/srrdb/.env)
    -b, --backfill  process files in backfill folder (~/.config/srrdb/backfill)
    -h, --help      show this help
    -v, --version   print the current version
`;

// srrDB file max upload size is 100MiB
export const fileSizeOk = (file: string): boolean => {
  const stats = fs.statSync(file);
  if (stats.size >= MAX_UPLOAD_SIZE + 1 || stats.size === 0) {
    return false;
  } else {
    return true;
  }
};

export const httpsAgent = new Agent({
  keepAlive: true,
});

// create folder if it doesn't exist
export const setFolder = (folder: string): boolean => {
  if (!fs.existsSync(folder)) {
    if (fs.mkdirSync(folder, { recursive: true })) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

// extract uid from cookie
export const extractUid = (cookie: string): number => {
  const c = cookie.split(" ");
  let ret = 0;
  c.forEach((k) => {
    if (k.startsWith("uid=")) {
      ret = Number(k.split("=")[1].slice(0, -1));
    }
  });

  return ret;
};
