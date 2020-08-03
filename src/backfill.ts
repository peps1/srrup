import fs from 'fs';

import * as utils from './utils';
import * as srr from './srr';

const lockfile = `${utils.backfillFolder}/_srrup.lock`

const checkLockFile = (): boolean|string|void => {
    fs.stat(lockfile, (err, stats) => {
        if (stats.isFile()) {
            return stats.mtime;
        } else {
            return false;
        }
    })
}

// create lock file in backfill folder, if none exists
const setLockFile = (): boolean => {
    const locked = checkLockFile()
    if (!locked) {
        fs.closeSync(fs.openSync(lockfile, 'a'));
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
    console.log(files.length)
    if (setLockFile()) {
        // upload each file
        for (const file of files) {
            console.log(file);
            if (srr.srrUpload(`${utils.backfillFolder}/${file}`)) {
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
    } else {
        console.log('Something when wrong with the lockfile..')
    }


    // remove file when upload successful
    // when error stop trying
    // remove lock file
}
