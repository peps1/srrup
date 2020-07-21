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
  const password = prompt('Password: ', {echo: '*'});

  console.log()
  if (username === '' || password === '' || !username || !password) {
    console.error('Incomplete login information entered.');
    process.exit(1);
  }

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
      const cookies: string[] = [];

      // Iterate through received cookies
      (response.headers)['set-cookie'].forEach( (cookie: string) => {
        if (cookie.startsWith('uid=')) {
          console.log(cookie)
          cookies.push(cookie);
        }
        else if (cookie.startsWith('hash=')) {
          console.log(cookie)
          cookies.push(cookie);
        }
      });

      if (cookies.length !== 2) {
        console.error('Couldn\'t get all necessary headers, try again.')
        console.debug((response.headers)['set-cookie'])
      }
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

export const printHelpText = (): string => {
  return `Usage: srrup file.srr <file2.srr> <file3.srr>
Upload one or more .srr files to srrdb.com, if no option is specified as listed below,
all parameters are expected to be .srr files and will be uploaded.

Example:
  srrup files/file1.srr more/file2.srr
Options:
  -l, --login     login to srrdb.com and save auth info
  -d, --debug     print debug information
  -h, --help      show this help
  -v, --version   print the current version
`
}
