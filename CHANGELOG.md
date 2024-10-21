# Changelog

## [v3.0.0](https://github.com/peps1/srrup/tree/v3.0.0) (2024-10-20)

[Full git log](https://github.com/peps1/srrup/compare/v2.1.3...v3.0.0)

### Added

- Switching to Deno 2 (https://deno.com/blog/v2.0)

### Changed
- Added new debug logger for improved logging

### Fixed
- Fixed logging which caused errors

## [v2.1.3](https://github.com/peps1/srrup/tree/v2.1.3) (2021-01-10)

[Full git log](https://github.com/peps1/srrup/compare/v2.1.2...v2.1.3)

### Changed

- Fix ERR_FR_MAX_BODY_LENGTH_EXCEEDED error that appeared since updating axios

## [v2.1.2](https://github.com/peps1/srrup/tree/v2.1.2) (2021-01-07)

[Full git log](https://github.com/peps1/srrup/compare/v2.1.1...v2.1.2)

### Changed

- update dependencies

## [v2.1.1](https://github.com/peps1/srrup/tree/v2.1.1) (2020-08-15)

[Full git log](https://github.com/peps1/srrup/compare/v2.1.0...v2.1.1)

### Fixed

- don't backup srr file when srrdb response includes 'is a different set of
  rars'

## [v2.1.0](https://github.com/peps1/srrup/tree/v2.1.0) (2020-08-08)

[Full git log](https://github.com/peps1/srrup/compare/v2.0.0-beta.1...v2.1.0)

### Added

- logging feature (~/.config/srrdb/logs)
- logrotation

### Fixed

- limit for file uploads (100MiB)

## [v2.0.0](https://github.com/peps1/srrup/tree/v2.0.0-beta.1) (2020-08-04)

[Full git log](https://github.com/peps1/srrup/compare/v1.0.0-beta.4...v2.0.0-beta.1)

### Added

- backfill feature (~/.config/srrdb/backfill)
- new command line switch (-b / --backfill) to trigger backfill directly

### Changed

- Better check to see if srr upload failed

## [v1.0.0](https://github.com/peps1/srrup/tree/v1.0.0-beta.4) (2020-08-01)

[Full git log](https://github.com/peps1/srrup/compare/40204681df9d18e5a376407564dc3585d2bcef3d...v1.0.0-beta.4)

Initial release
