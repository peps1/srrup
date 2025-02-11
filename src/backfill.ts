import fs from "node:fs";

import * as utils from "./utils.ts";
import * as srr from "./srr.ts";
import { debugLogger, logger } from "./logger.ts";

const fsPromises = fs.promises;

const lockfile = `${utils.backfillFolder}/_srrup.lock`;

const checkLockFile = async (): Promise<boolean | Date> => {
  let ret;
  if (fs.existsSync(lockfile)) {
    const stats = await fsPromises.stat(lockfile);
    if (stats.isFile()) {
      ret = stats.mtime;
    } else {
      ret = false;
    }
  } else {
    ret = false;
  }

  return ret;
};

// create lock file in backfill folder, if none exists
const setLockFile = async (): Promise<boolean> => {
  const locked = await checkLockFile();
  if (!locked) {
    fs.closeSync(fs.openSync(lockfile, "a"));
    debugLogger.debug("Created lockfile.");
    return true;
  } else {
    logger.info(
      `Lockfile found, cancelling backfill. Locked since ${locked.toString()}.`,
    );
    return false;
  }
};

const clearLockFile = async (): Promise<void> => {
  await fsPromises.unlink(lockfile);
  debugLogger.debug("Lockfile cleared.");
};

export const processBackfill = async (): Promise<void> => {
  // list all files in backfill
  const files = fs.readdirSync(utils.backfillFolder);
  debugLogger.debug(`Backfill content: ${files.toString()}`);

  // Do nothing, when there's no files
  if (files.length === 0) return;

  logger.info(
    `${files.length} file[s] found in backfill folder, will process now...`,
  );
  const lockedSuccessful = await setLockFile();
  if (lockedSuccessful) {
    // upload each file
    for (const file of files) {
      const filePath = `${utils.backfillFolder}/${file}`;
      const uploadSucess = await srr.srrUpload(filePath);
      if (uploadSucess) {
        // remove file when upload successful
        fs.unlink(filePath, (err) => {
          if (err) console.log(err);
          debugLogger.debug(`File ${file} deleted from backfill folder.`);
        });
      } else {
        // If upload fails during backfill processing, stop the processing
        logger.info("Last file upload failed, cancelling backfill.");
        break;
      }
    }
    // when all is done, clear the lock file
    await clearLockFile();
  }
};
