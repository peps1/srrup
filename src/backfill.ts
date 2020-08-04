import fs from 'fs';

import * as utils from './utils';
import * as srr from './srr';

const lockfile = `${utils.backfillFolder}/_srrup.lock`

const checkLockFile = (): boolean|string|void => {
    let ret;
    fs.stat(lockfile, (err, stats) => {
        if (stats && stats.isFile()) {
            ret = stats.mtime;
        } else {
            ret = false;
        }
    })
    return ret;
}

// create lock file in backfill folder, if none exists
const setLockFile = (): boolean => {
    const locked = checkLockFile()
    if (!locked) {
        fs.closeSync(fs.openSync(lockfile, 'a'));
        console.log('Created lockfile.');
        return true;
    } else {
        console.log(`Lockfile already exists.. giving up. ${locked}`);
        return false;
    }
}

const clearLockFile = (): void => {
    fs.unlink(lockfile, (err) => {
        if (err) { throw err};
        console.log('Lockfile cleared.');
    });
}

export const processBackfill = (): void => {
    // list all files in backfill
    const files = fs.readdirSync(utils.backfillFolder)
    console.log(files);
    // log number of files
    if (files.length === 0) { return };
    if (setLockFile()) {
        // upload each file
        for (const file of files) {
            console.log(file);
            if (srr.srrUpload(`${utils.backfillFolder}/${file}`)) {
                // remove file when upload successful
                fs.unlink(file, (err) => {
                    if (err) { throw err};
                    console.log(`File ${file} deleted from backfill folder.`);
                });
            } else {
                // If upload fails during backfill processing, stop the processing
                break;
            }
        }
        // when all is done, clear the lock file
        clearLockFile();
    }

}
