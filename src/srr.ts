import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import * as utils from './utils';
import logger from './logger';


export const backupSrr = (file: string): void => {
    // copy srr to backup folder
    const fileName = path.basename(file);
    const backfillFile = `${utils.backfillFolder}/${fileName}`;

    if (backfillFile !== file && !fs.existsSync(backfillFile)) {

        fs.copyFile(file, backfillFile, (err) => {
            if (err) { throw err }
            logger.debug(`${fileName} copied to backfill folder.`)
        });

    } else {
        logger.debug(`${fileName} exists already in backfill folder.`)
    }
};

export const srrUpload = async (file: string): Promise<boolean> => {
    const cookie = process.env.COOKIE;
    const url = 'https://www.srrdb.com/release/upload';
    // const url = 'http://localhost/release/upload';
    let ret = false;

    const fileName = path.basename(file);
    let fileData;
    try {
        fileData = fs.readFileSync(file);
    } catch (e) {
        logger.error(e);
        return false;
    }

    if (utils.fileSizeOk(file)) {
        const form = new FormData();
        form.append('files[]', fileData, fileName);

        logger.debug(`Uploading file: ${file}`)
        await axios({
            url,
            method: 'post',
            httpsAgent: utils.httpsAgent,
            data: form,
            maxContentLength: utils.MAX_UPLOAD_SIZE,
            maxBodyLength: utils.MAX_UPLOAD_SIZE,
            headers: {
                'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`,
                'Content-Length': form.getLengthSync(),
                'User-Agent': `srrup.js/${utils.version}`,
                'X-Requested-With': 'XMLHttpRequest',
                Cookie: cookie,
            },
        }).then(response => {
            logger.debug(JSON.stringify(response));

            let message;
            if (response.data.files[0].message) {
                message = response.data.files[0].message.trim();
            }

            // The request can be successful but the upload can still have failed.
            if (response.data.files[0].color === 0) {
                logger.error(`${message} when uploading file ${file}`);

                if (!message.match(/.+ is a different set of rars\.$/i)) {
                    backupSrr(file);
                }

                ret = false;
            } else if (response.data.files[0].color === 1 || response.data.files[0].color === 2) {
                logger.info(`Uploaded ${file}`);
                logger.info(`Response: ${response.data.files[0].message.trim().replace(/^\- /, '')}`);
                ret = true;
            } else {
                // not sure what other errors we could catch here..
                logger.error(`Unknown response: ${response} - please submit a bug report with this output at https://github.com/peps1/srrup/issues`)
                backupSrr(file);
                ret = false;
            }
        }).catch(error => {
            logger.debug(`Response: ${JSON.stringify(error)}`);
            logger.error(
                `${error.response?.status || error.code} ${error.response?.statusText || ''}: Error while uploading file ${file}`
            );
            backupSrr(file);
            ret = false;
        });
    }
    return ret;
};
