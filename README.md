# srrDB Uploader

## Features

* Login through the CLI
* Save and reuse login cookie
* Better error handling

## Planned features

* check that file is really a srr file.
* Save failed file to backfill/ folder
* On every successful upload the backfill folder is checked for files still needing to be uploaded

## Install

`npm i -g srrdb_uploader`

## Usage

`srrup --help`

```
Usage: srrup file.srr <file2.srr> <file3.srr>
Upload one or more .srr files to srrdb.com, if no option is specified as listed below,
all parameters are expected to be .srr files and will be uploaded.

Example:
    srrup files/file1.srr more/file2.srr
Options:
    -l, --login     login to srrdb.com and save auth info
    -h, --help      show this help
    -v, --version   print the current version
```