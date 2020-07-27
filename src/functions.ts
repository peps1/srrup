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

const extractUid = (cookie: string): number => {
  const c = cookie.split(' ');
  let ret = 0;
  c.forEach( k => {
    if (k.startsWith('uid=')) {
      ret = Number(k.split('=')[1].slice(0, -1))
    }
  });

  return ret;
}

const testLoginCookie = async (): Promise<boolean> => {
  // try api call with the cookie
  const url = 'https://www.srrdb.com/account/settings';
  const cookie = process.env.COOKIE || '';
  const uid = extractUid(cookie);

  if (uid === 0) {
    console.log('Couldn\'t extract uid from cookie, need to create new login cookie')
    return false;
  } else {
    let ret = false;
    await axios({
      url,
      method: 'get',
      responseType: 'json',
      httpsAgent,
      maxRedirects: 0,
      headers: {
        'User-Agent': `srrup.js/${version}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: cookie,
      },
    })
      .then( response => {
        // handle success
        console.log(
          `${response.status} ${response.statusText}: Current login cookie is valid.`
        );
        ret = true;
      })
      .catch( error => {
        if (error.response.status === 302) {
          console.log('Current login cookie is invalid.');
          ret = false;
        } else {
          console.log(`Unknown error: ${error}`);
          process.exit(1)
        }
      });

    return ret;
  }

}

export const checkLoginCookie = async (): Promise<boolean> => {
  let overwriteCookie;

  if (!process.env.COOKIE) {
    console.log('No existing cookie found.')
    return false
  }
  const validCookie = await testLoginCookie()
  if (validCookie) {
    overwriteCookie = prompt('Found valid cookie, do you want to overwrite it? (y/n) ', 'n')
    if (overwriteCookie === 'y') {
      return false;
    } else {
      return true;
    }
  }

  // false will tell it to create new login Cookie
  console.log('no valid cookie')
  return false;
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
      const authCookie: string[] = [];

      // Iterate through received cookies
      (response.headers)['set-cookie'].forEach( (cookie: string) => {
        if (cookie.startsWith('uid=')) {
          authCookie.push(cookie.split(' ')[0]);
        }
        else if (cookie.startsWith('hash=')) {
          authCookie.push(cookie.split(' ')[0]);
        }
        else if (cookie.startsWith('srrdb_session=')) {
          authCookie.push(cookie.split(' ')[0]);
        }
      });

      if (authCookie.length !== 3) {
        console.error('Couldn\'t get all necessary headers, try again.');
        console.debug((response.headers)['set-cookie']);
        console.debug(authCookie);
        process.exit(1);
      } else {
        // transform to cookie format: "uid=uid_here; hash=hash_here; srrdb_session=session_hash_here"
        fs.writeFileSync('.env', `COOKIE=${authCookie.join(' ')}`);
        console.log(`Writing login Cookie to file ".env". COOKIE=${authCookie.join(' ')}`);
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

export const printHelpText = `Usage: srrup file.srr <file2.srr> <file3.srr>
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
