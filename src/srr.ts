import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import * as utils from './utils';

const { COPYFILE_EXCL } = fs.constants;

const copyCb = (err: any): void => {
    if (err) { throw err };
}


export const backupSrr = (file: string): void => {
    // copy srr to backup folder
    const fileName = path.basename(file);
    if (`${utils.backfillFolder}/${fileName}` !== file) {
        fs.copyFile(file, `${utils.backfillFolder}/${fileName}`, COPYFILE_EXCL, copyCb);
    } else {
        console.log(`Not copying file ${file} - it is already in backfill folder...`)
    }
};

export const srrUpload = (file: string): boolean => {
    const cookie = process.env.COOKIE;
    const url = 'https://www.srrdb.com/release/upload';


    const fileName = path.basename(file);
    let fileData;
    try {
        fileData = fs.readFileSync(file);
    } catch (e) {
        console.log(e);
        return false;
    }

    if (utils.fileSizeOk(file)) {
        const form = new FormData();
        form.append('files[]', fileData, fileName);

        console.log(`Uploading file: ${file}`)
        axios({
            url,
            method: 'post',
            httpsAgent: utils.httpsAgent,
            data: form,
            headers: {
                'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`,
                'Content-Length': form.getLengthSync(),
                'User-Agent': `srrup.js/${utils.version}`,
                'X-Requested-With': 'XMLHttpRequest',
                Cookie: cookie,
            },
        })
            .then(response => {
                // The request can be successful but the upload can still have failed.
                if (response.data.files[0].color === 0) {
                    console.log(`${response.data.files[0].message} when uploading file ${file}`);
                    backupSrr(file);
                    return false;
                } else {
                    console.log(
                        `${response.status} ${response.statusText}: Successful uploaded file ${file} - ${response.data.files[0].message}`
                    );
                    return true;
                }
            })
            .catch(error => {
                console.log(
                    `${error.response.status} ${error.response.statusText}: Error while uploading file ${file}`
                );
                console.log(error);
                backupSrr(file);
                return false;
            });
    }
    return true;
};