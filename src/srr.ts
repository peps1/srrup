import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import * as utils from './utils';


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
                    return false;
                } else {
                    console.log(
                        `${response.status} ${response.statusText}: Successful uploaded file ${file}${response.data.files[0].message}`
                    );
                    return true;
                }
            })
            .catch(error => {
                console.log(
                    `${error.response.status} ${error.response.statusText}: Error while uploading file ${file}`
                );
                console.log(error);
                return false;
            });
    }
    return true;
};