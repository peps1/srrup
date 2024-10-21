# srrDB CLI Uploader [![GitHub Actions][build-badge]][build] [![snyk][snyk-badge]][snyk] [![codecov][coverage-badge]][coverage] [![codeclimate][codeclimate-badge]][codeclimate]

Works on Linux/MacOS/Windows!

## Features

- Single binary without dependencies
- Login through the CLI
- Save and reuse login cookie (Linux/MacOS: `~/.config/srrdb/.env` or Windows:
  `%HOMEPATH%\.config\srrdb\.env`)
- Better error handling
- Save failed uploads file to backfill folder (Linux/MacOS:
  `~/.config/srrdb/backfill` or Windows: `%HOMEPATH%\.config\srrdb\backfill`)
- On every successful upload the backfill folder is checked for files still
  needing to be uploaded
- logging (Linux/MacOS: `~/.config/srrdb/logs` or Windows:
  `%HOMEPATH%\.config\srrdb\logs`)

## Planned features

- check that file is really a srr file

## Requirements

- Linux, MacOS or Windows
- None others, created with Deno 2 (https://deno.com/blog/v2.0)

## Install

**Linux / MAC**:
- Download latest binary for your platform from the Release page:  https://github.com/peps1/srrup/releases
- Run it from your terminal `./srrup --help`

**Windows**:
- Download latest binary for your platform from the Release page:  https://github.com/peps1/srrup/releases
- Run it from your terminal e.g. PowerShell `.\srrup.exe --help`

## Usage

`./srrup --help`

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

`DEBUG=debug ./srrup files/file1.srr more/file2.srr`

## Development

### Install Deno

https://docs.deno.com/runtime/getting_started/installation/

### Install NodeJS and npm

#### Linux

**Debian/Ubuntu** packages provided by NodeSource - https://github.com/nodesource/distributions/blob/master/README.md#debinstall

**CentOS/Fedora** packages provided by NodeSource - https://github.com/nodesource/distributions/blob/master/README.md#rpminstall

**ArchLinux**: https://nodejs.org/en/download/package-manager/#arch-linux

#### MacOS
https://nodejs.org/en/download/package-manager/#macos

#### Windows
https://nodejs.org/en/#home-downloadhead

Also available through Chocolatey or Scoop
https://nodejs.org/en/download/package-manager/#alternatives-1


### Run from source

```
deno run -A src/index.ts
```

[build-badge]: https://github.com/peps1/srrup/workflows/build/badge.svg
[build]: https://github.com/peps1/srrup/actions
[coverage-badge]: https://codecov.io/gh/peps1/srrup/branch/master/graph/badge.svg
[coverage]: https://codecov.io/gh/peps1/srrup
[codeclimate-badge]: https://api.codeclimate.com/v1/badges/76aa2bec4ed3c08ba903/maintainability
[codeclimate]: https://codeclimate.com/github/peps1/srrup/maintainability
[snyk-badge]: https://snyk.io/test/github/peps1/srrup/badge.svg
[snyk]: https://snyk.io/test/github/peps1/srrup
