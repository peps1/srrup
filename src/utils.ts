
import fs from 'fs';
import https from 'https';

export const version = process.env.npm_package_version || '0.999-git';

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

export const fileSizeOk = (file: string): boolean => {
    const stats = fs.statSync(file);
    if (stats.size >= 52428800 || stats.size === 0) {
        return false;
    } else {
        return true;
    }
};

export const httpsAgent = new https.Agent({ keepAlive: true });

export const setFolder = (folder: string): boolean => {
    if (!fs.existsSync(folder)) {
        fs.mkdir(folder, { recursive: true }, (err) => {
            return err;
        });
    }
    return true;
};

export const extractUid = (cookie: string): number => {
    const c = cookie.split(' ');
    let ret = 0;
    c.forEach((k) => {
        if (k.startsWith('uid=')) {
            ret = Number(k.split('=')[1].slice(0, -1));
        }
    });

    return ret;
};
