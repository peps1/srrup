
import fs from 'fs';
import os from 'os';
import https from 'https';
import {version as ver} from './version';

export const configFolder = `${os.homedir()}/.config/srrdb`
export const backfillFolder = `${os.homedir()}/.config/srrdb/backfill`;

export const version = ver;

export const printHelpText = `Usage: srrup file.srr <file2.srr> <file3.srr>
Upload one or more .srr files to srrdb.com, if no option is specified as listed below,
all parameters are expected to be .srr files and will be uploaded.

Example:
    srrup files/file1.srr more/file2.srr
Options:
    -l, --login     login to srrdb.com and save auth info
    -h, --help      show this help
    -v, --version   print the current version
`

export const fileSizeOk = (file: string): boolean => {
    const stats = fs.statSync(file);
    if (stats.size >= 52428800 || stats.size === 0) {
        return false;
    } else {
        return true;
    }
};

export const httpsAgent = new https.Agent({ keepAlive: true });

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

export const extractUid = (cookie: string): number => {
    const c = cookie.split(' ');
    let ret = 0;
    c.forEach((k) => {
        if (k.startsWith('uid=')) {
            ret = Number(k.split('=')[1].slice(0, -1));
        }
    });

    return ret;
};
