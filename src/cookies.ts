import axios from 'axios';
import fs from 'fs';
import promptSync from 'prompt-sync';
import qs from 'qs';

import * as utils from './utils';
import logger from './logger';

const prompt = promptSync();

export const testLoginCookie = async (): Promise<boolean> => {
    // try api call with the cookie
    const url = 'https://www.srrdb.com/account/settings';
    const cookie = process.env.COOKIE || '';
    const uid = utils.extractUid(cookie);

    console.log(
        'Connecting to srrdb.com to check if the cookie is still valid...'
    );

    if (uid === 0) {
        console.log(
            'Couldn\'t extract uid from cookie, need to create new login cookie'
        );
        return false;
    } else {
        let ret = false;
        await axios({
            url,
            method: 'get',
            responseType: 'json',
            httpsAgent: utils.httpsAgent,
            maxRedirects: 0,
            headers: {
                'User-Agent': `srrup.js/${utils.version}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Cookie: cookie,
            },
        })
            .then((response) => {
                // handle success
                console.log(
                    `${response.status} ${response.statusText}: Current login cookie is valid.`
                );
                ret = true;
            })
            .catch((error) => {
                if (error.response.status === 302) {
                    console.log('Current login cookie is invalid.');
                    ret = false;
                } else {
                    console.log(`Unknown error: ${JSON.stringify(error)}`);
                    process.exit(1);
                }
            });

        return ret;
    }
};

export const checkLoginCookie = async (): Promise<boolean> => {
    let overwriteCookie;

    if (!process.env.COOKIE) {
        console.log('No existing cookie found.');
        return false;
    }
    const validCookie = await testLoginCookie();
    if (validCookie) {
        overwriteCookie = prompt(
            'Found valid cookie, do you want to overwrite it? (y/n) ',
            'n'
        );
        if (overwriteCookie === 'y') {
            return false;
        } else {
            return true;
        }
    }

    // false will tell it to create new login Cookie
    console.log('no valid cookie');
    return false;
};

export const getLoginCookie = async (): Promise<any> => {
    const username = prompt('Username: ');
    const password = prompt('Password: ', { echo: '*' });

    console.log();
    if (username === '' || password === '' || !username || !password) {
        console.error('Incomplete login information entered.');
        process.exit(1);
    }

    const url = 'https://www.srrdb.com/account/login';

    const data = qs.stringify({
        username,
        password,
    });

    await axios({
        url,
        method: 'POST',
        httpsAgent: utils.httpsAgent,
        data,
        maxRedirects: 0,
        validateStatus: (status) => {
            return status <= 302; // Reject only if the status code is greater than 302
        },
        headers: {
            'Content-Length': data.length,
            'User-Agent': `srrup.js/${utils.version}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
        .then((response) => {
            // handle success
            const authCookie: string[] = [];

            // Iterate through received cookies
            response.headers['set-cookie'].forEach((cookie: string) => {
                if (cookie.startsWith('uid=')) {
                    authCookie.push(cookie.split(' ')[0]);
                } else if (cookie.startsWith('hash=')) {
                    authCookie.push(cookie.split(' ')[0]);
                } else if (cookie.startsWith('srrdb_session=')) {
                    authCookie.push(cookie.split(' ')[0]);
                }
            });

            if (authCookie.length !== 3) {
                logger.error('Couldn\'t get all necessary headers, try again.');
                logger.debug(response.headers['set-cookie']);
                logger.debug(authCookie);
                process.exit(1);
            } else {
                // transform to cookie format: "uid=uid_here; hash=hash_here; srrdb_session=session_hash_here"
                fs.writeFileSync(`${utils.configFolder}/.env`, `COOKIE="${authCookie.join(' ')}"\n`);
                logger.info(
                    `Writing login Cookie to file ".env". COOKIE="${authCookie.join(' ')}"`
                );
            }
            // write cookie to .env file
        })
        .catch((error) => {
            logger.error(`${error.status} ${error.statusText} - ${error.data}`);
            logger.error(error.headers);
        });
};
