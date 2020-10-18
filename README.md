# srrDB Uploader ![build](https://github.com/peps1/srrup/workflows/build/badge.svg)

Works on Linux/MacOS/Windows!

## Features

* Login through the CLI
* Save and reuse login cookie (Linux/MacOS: `~/.config/srrdb/.env` or Windows: `%HOMEPATH%\.config\srrdb\.env`)
* Better error handling
* Save failed uploads file to backfill folder (Linux/MacOS: `~/.config/srrdb/backfill` or Windows: `%HOMEPATH%\.config\srrdb\backfill`)
* On every successful upload the backfill folder is checked for files still needing to be uploaded
* logging (Linux/MacOS: `~/.config/srrdb/logs` or Windows: `%HOMEPATH%\.config\srrdb\logs`)

## Planned features
* check that file is really a srr file
* provide standalone binary

## Requirements
* Linux, MacOS or Windows
* NodeJS >= 10 [https://nodejs.org/en/download/package-manager/](https://nodejs.org/en/download/package-manager/)
* npm [https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm)

## Install
`sudo npm i -g srrup`

## Upgrade
`npm update -g srrup`

## Usage
`srrup --help`

```
Usage: srrup file.srr <file2.srr> <file3.srr>
Upload one or more .srr files to srrdb.com, if no option is specified as listed below,
all parameters are expected to be .srr files and will be uploaded.
Output will be logged to ~/.config/srrdb/logs

Example:
    srrup files/file1.srr more/file2.srr
Options:
    -l, --login     login to srrdb.com and save auth info (~/.config/srrdb/.env)
    -b, --backfill  process files in backfill folder (~/.config/srrdb/backfill)
    -h, --help      show this help
    -v, --version   print the current version
```

## Debug Output
You can enable debugging output using DEBUG environment variable

`DEBUG=debug srrup files/file1.srr more/file2.srr`