# changelog

## [WIP] 
## [0.5.17] - date_time
## [0.5.16] - date_time
## [0.5.15] - date_time
## [0.5.14] - date_time
## [0.5.13] - date_time
## [0.5.12] - date_time
## [0.5.11] - date_time
## [0.5.10] - date_time
## [0.5.9] - date_time
## [0.5.8] - date_time
## [0.5.7] - date_time
## [0.5.6] - date_time
## [0.5.5_b] - date_time
## [0.5.5_a] - date_time [YANKED]
## [0.5.4] - date_time
## [0.5.3] - date_time
## [0.5.2] - date_time
## [0.5.1] - date_time
## [0.5.0] - date_time
## [0.4.18_b] - date_time
## [0.4.18_a] - date_time [YANKED]
## [0.4.17] - date_time
## [0.4.16] - date_time
## [0.4.15] - date_time
## [0.4.14] - date_time
## [0.4.13] - date_time
## [0.4.12] - date_time
## [0.4.11] - date_time
## [0.4.10] - date_time
## [0.4.9] - date_time
## [0.4.8] - date_time
## [0.4.7] - date_time
## [0.4.6] - date_time
## [0.4.5] - 2022-12-16
[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/5f57e70d361d3ced78e2fd900e29d2ef08f0ae37)</br>
### Fixed
- `osutop` sorting by recent instead of pp
- `beatmapsetApprove` event not handled in `rsact` command
- last online showing 53+ years ago
- spacing on most played count
- `stats` crashing due to invalid paths
### Changed
- `rsact` formatting
- osu grades from sbr v11 to osu! default 
### Added
- medals count in `osu` command
- display map button to `rs` and `scoreparse`
## [0.4.4] - 2022-12-13
[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/9b2d8f945091bd9c798e367ecb662a369664497a)</br>
### Fixed
- medals in `rsact` displaying as `[object Object]`
- rl only showing one score
- permissions checker
- `maplb` and `scores`/`c` crashing when calculating performance (undefined map object)
- map ids not being stored in the correct path

## [0.4.3] - 2022-12-10
[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/d7f4856f3fa92458ecb5a5e448d0bcabf973dc22)</br>
### Fixed
- pages for expanded lists
- ppcalc being slow
### Changed
- code clean up
#### Added
- `recentactivity`/`rsact` command
## [0.4.2] - 2022-12-06
[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/3293ee645ab4bf4cb5cd3debd950334b5c5fd74b)</br>
### Fixed
- `simulate` and local map parse (re-added)
- page search
- `recent`/`rs` showing incorrect star rating
- permission errors
### Changed
- reworked rank/pp estimates(should be more accurate)
- general code clean up
### Added
- mode aliases for `osu` command
- buttons in help

## [0.4.1] - 2022-12-03
[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/9854e19840ef21abb1653be5c4b0e4535627a174)</br>
### Fixed
- links and `.osr`s not working
### Changed
- updated buttons
- switched from commonjs to nodenext (tsconfig)
### Added
- detail levels for `firsts`, `osutop`/`top`, `nochokes`/`nc`, `sotarks`, `pinned`, `recent`/`rs`/`rl`, `scores`/`c`, `userbeatmaps`/`ubm`
- graph button in `osu` command
- `ppcalc` command
### Removed
- `simulate` (temporary)
- local map parse (temporary)

## [0.4.0] - 2022-09-14 --- 2022-11-07 --- 2022-12-01
[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/16c5c46a499dd6541ac027857ab9634be54383e4)</br>
### Fixed
- server leaderboards
- osutrack
- pp calculations not working on non-std
- pages on scores command
### Changed
- updated discord.js (13.x.x -> 14.x.x)
- different typescript implementation (old one couldn't compile properly)
- edited database setup
- cooldown only affects osu! commands
- debugging
- graphs don't disappear after 3 days (switched from using a temp link to uploading the image directly to discord)
### Added
- command select menu in help command
- server prefix command
- admin commands
- `pp`/`rank` estimate command
- `compare` top plays command
- `bws` command
- #1 scores (`firsts`) command
- `osutrack` command
- `nochokes` command
- `whatif` command
- show global rank in scoreparse
- `userbeatmaps` command
- map commands work using a map link as an arg
- get avatar command

## [0.3.2] - 2022-09-03
[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/c9eed60322ae19a7b0e040997d29b5e2fa4d7ca0)</br>
undocumented
## [0.3.1] - YYYY-MM-DD
undocumented
## [0.3.0] - 2022-06-09
[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/c3566227ccecb19e93935a5be65f1c63dc7a0949)</br>
### Changed
- switched pp calculator (booba -> rosu-pp-js)
- code cleanup
## [0.2.0] - 2022-03-11
[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/10bf389f91247ae4070e2f5be3eb013ba2e80337)</br>
### Changed
- upgraded to discord.js v13.x.x
### Added
- first implementation of slash commands
- osu commands
## [0.1.1] - 2021-12-29
[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/34d53fbac325157b63093a4bae5c514bc60f64b1)</br>
no recorded changes </br>
old version preserved [here](https://github.com/sbrstrkkdwmdr/sbrbot/tree/discordjs-v12)
## [0.1.0] - 2021-11-04
[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/de46d2dc56986e59f1a33f189f232d185327c9a0)</br>
no changes (first version)</br>
running on discord.js v12.x.x</br>
## [0.0.0] - 2021-08-07
[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/7005504084d13a619e43b9781d27a8fa1470bf13)</br>
project created