/* eslint-disable no-console */
import FormData from 'form-data';
import axios from 'axios';
import qs from 'qs';
import fs from 'fs';
import https from 'https';
import path from 'path';
import promptSync from 'prompt-sync';

const httpsAgent = new https.Agent({ keepAlive: true });
const prompt = promptSync();

export const version = process.env.npm_package_version || '0.999-git';

export const fileSizeOk = (file: string): boolean => {
  const stats = fs.statSync(file);
  if (stats.size >= 52428800) {
    return false;
  } else {
    return true;
  }
};

export const setFolder = (folder: string): boolean => {
  if (!fs.existsSync(folder)) {
    fs.mkdir(folder, { recursive: true }, (err) => { return err });
  }
  return true;
};

export const getLoginCookie = (): any => {

  const username = prompt('Username: ');
  const password = prompt.hide('Password: ');

  const url = 'https://www.srrdb.com/account/login';

  const data = qs.stringify({
    username,
    password,
  });


  axios({
    url,
    method: 'POST',
    httpsAgent,
    data,
    maxRedirects: 0,
    validateStatus: status => {
      return status <= 302; // Reject only if the status code is greater than 302
    },
    headers: {
      'Content-Length': data.length,
      'User-Agent': `srrup.js/${version}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then( response => {
      // handle success
      console.log((response.headers)['set-cookie']);
      // write cookie to .env file
    })
    .catch( error => {
      console.log(
        `${error.status} ${error.statusText} - ${error.data}`
      );
      console.log(error.headers);
    });
};

export const srrUpload = (file: string): boolean => {
  const cookie = process.env.COOKIE;
  const url = 'https://www.srrdb.com/release/upload';


  const fileName = path.basename(file);
  const fileData = fs.readFileSync(file);

  if (fileSizeOk(file)) {
    const form = new FormData();
    form.append('files[]', fileData, fileName);

    axios({
      url,
      method: 'post',
      httpsAgent,
      data: form,
      headers: {
        'Content-Type': `multipart/form-data; boundary=--${form.getBoundary()}`,
        'Content-Length': form.getLengthSync(),
        'User-Agent': `srrup.js/${version}`,
        'X-Requested-With': 'XMLHttpRequest',
        Cookie: cookie,
      },
    })
      .then( response => {
        // handle success
        console.log(
          `${response.status} ${response.statusText}: Successful uploaded file ${file}`
        );
        console.log(response);
        console.log(response.data);
        return true;
      })
      .catch( error => {
        console.log(
          `${error.status} ${error.statusText}: Error while uploading file ${file}`
        );
        console.log(error);
        return false;
      });
  }
  return true;
};
