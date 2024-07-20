<!-- keep the WIP header pls -->
# changelog

## [WIP] - 2024-xx-xx
[commit](https://github.com/sbrstrkkdwmdr/sbrbot)

### Fixed
- changelog could exceed amount of versions
- changelog pages wouldn't disable when reaching the end

### Changed
- version list only shows max 10 versions at a time

### Added
- pages in versions

## [3.17.4] - 2024-07-11

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/43660f5aaaf3259f51358f5ec8c66ed660a02518)</br>

### Fixed

- changelog command "expected to match a URL"
- changelog command breaking if `<br>` is missing after the commit

## [3.17.3] - 2024-07-05

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/5e93fcae5bd2dcce7c9f402d79c340f125175160)</br>

### Fixed

- debug fetch logs

## [3.17.2] - 2024-07-02

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/1c7edae974fff318ad702ee4258813e2c66c6ef1)</br>

### Fixed

- memory leak (maybe?)
- removed unused depedencies

### Changed

- changelog.txt -> changelog.md
- re-order versions to show newest first
- change formatting and handling in `changelog` command
- edited changelog system (0.3 -> 1.0, 0.4 -> 2.0, 0.5 -> 3.0)
- updated dependencies
- use osu-parsers for replay parsing
- only delete map files if there's > 100

## [3.16.0] - 2024-06-20

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/6680d39562d5ed3f1eb4ca8a5f28a53a9932928a)</br>

### Fixed

- https://osu.ppy.sh/b/[ID]?m=[MODE] links ignoring mode
- changelog versions change count always shows 0
- exactmods vs includemods
- incorrect arg for exclude mods in help embed

### Changed

- pressing the detailed button in the default help window switches to the command list
- remove empty lines in changelog
- config - move properties to important

### Added

- command - janken

### Removed

- "render" from command list (was never gonna implement)
- config - remove unused properties

## [3.15.0] - 2024-05-14

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/5ea2d7269873fbb2ffbf090516962db88d15134c)</br>

### Fixed

- https://osu.ppy.sh/b/[ID]?m=[MODE] links not working
- filter rank using score.mods instead of score.rank
- `+` variant of includemods not working on scorelist cmds
- include mods has to include all mods given instead of just one
- changelog crashing if there is no `changes:` string
- changelog crashing on version list
- changelog - page buttons not disabling correctly
- changelog - BigLeftArrow not going to first version
- changelog - early cut off when `changes:` is present in the changes list

### Changed

- rewrote code for base conversions
- rewrote msg args parsing
- miss and bpm filters now allow for equal values
- show changes count in version list
- show pending changes in version list

### Added

- option to show which countries observe DST in time command
- "versions" alias for changelog
- debug - clear option for map pp calc files only

## [3.14.2] - 2024-04-29

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/1c9333b5988d583962ccac7c8a6f46767ffb0a90)</br>

### Fixed

- usernames defined with `"` not working
- support for converted maps

## [3.14.0] - 2024-04-16

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/ef9d81fac2404042c0d28b416c82ecb556ce8b0e)</br>

### Changed

- added a general help page to `help`. use `sbr-list` or `sbr-help list` to see the list of commands.
- reworked mod args
- changelog links to changelog.txt by default
- add args to `info`
- reworked `convert` in order to support base number conversions

### Added

- added exclude mods arg to some commands
- base number converter (useable in `convert` cmd)

## [3.13.0] - 2024-03-05

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/823051a77e12a6061cdcac95a0cfbf9e765c9c69)</br>

### Fixed

- lb empty list - modechecker was always returning null instead of 'osu' as a default value
- lb - spacing
- lb - page buttons not changing the page
- lb - using buttons always changes server to current guild (rip global)
- lb - cant go back to page 1 from page 2
- debug - incorrect user and channel counts
- alt help command breaks interaction commands
- error handling for `find`
- inspire - some misformatted quotes

### Changed

- convert - input value can be in any spot ie `[in] [out] [val]`, as well as `[val] [in] [out]` and `[in] [val] [out]` all are valid
- lb - update interaction version
- wording
- change `find`'s default image
- add command option aliases to helpinfo
- add weather and tropicalweather to debug
- command list links to website

### Added

- find command - really old command i kinda forgot about
- more stuff to inspire
- debug - add ls option

### Removed

- get command

## [3.12.0] - 2024-02-12

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/8840263edd97c37103ec3c92d02371b0ffb1ed4a)</br>

### Fixed

- osu!track - null pp (osu!api returning null pp 2024-02-02)
- ubm - approved/qualified time formatted incorrectly
- discord formatting map names with special characters in the name
- whatif - mode icons returning "undefined"
- osutop - inaccurate weighted pp
- `sbr-info` - incorrect link
- cooldown even on non-cooldown commands

### Changed

- check if FC - switch from using score.perfect to maxcombo == beatmap.maxcombo
- show total amount of changes in changelog
- exceeded text length message for changelog
- whatif - round estimated rank
- whatif - show amount of entries used
- alt help command - `[command] -h` instead of `help [command]`
- access command categories via just text
- extend map cache lifespan

## [3.11.0] - 2024-01-30

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/1765f7dd0416a56e498bf8a90c4ac3f4264c7503)</br>

### Fixed

- maplb via button would hang - cmdtxt in wrong "if" statement
- simulated pp being ridiculously high (how tf did it get 1290pp with 7x miss on a map woth 760 if fc https://cdn.discordapp.com/attachments/515827485733027850/1200257525816242226/53pVGKu.png)
- pp on scorelist returning 0pp
- simulate embed showing incorrect input values
- simulate not parsing mapid arg
- trackfile sorting

### Changed

- only calculate passed objects on failed scores
- refine `mapIdFromLink()`

### Added

- lazer grade calculations

## [3.10.0] - 2024-01-23

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/637359f840fcfed8dc5bfb1b0316a1237052cb5c)</br>

### Fixed

- debug command missing args in helpinfo
- missing power units in `convert help`
- undefined (reading 'score') //`newData[scoreoffset].score` -> `newData[scoreoffset]?.score`
- fix apiget(); testing mode
- scorelist commands ignoring user param if other params given

### Changed

- move error msg handling to a single universal function
- show ranked status on map debug
- rework nochokes to unchoke plays instead of removing 0 miss plays

### Added

- `get` command

## [3.9.0] - 2023-12-25

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/db4e489c7fdcd9b91c8b11e871b73fea3b3960bb)</br>

### Fixed

- missing `\n` in recmap
- recmap error handling
- map - guest mapper data
- map - difficulty selector when using -? would only show the top diff
- map - search selector disappearing when switching difficulties
- time and weather buttons missing from helpinfo
- scoreparse crashing the bot if args were null
- `config/osuauth.json` missing
- remove separate handling of sigfigs that are 10^1 or 10^-1
- extra : in osu -d
- "special" statuses not working properly

### Changed

- map - difficulty selector labels show version instead of song title
- math - change OD from +- to ±
- make changelog command more readable
- status timer based off song length

### Added

- purge command
- debug map command
- power conversions

### Removed

- map - remove #s in difficulty/map selectors

## [3.8.0] - 2023-11-20

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/9494021cc189924cea0be7e9528795720cda663a)</br>

### Fixed

- math od to ms returning undefined
- changelog - allow `-` before pending arg (`pending` would work but `-pending` would cause an error)
- map search strings with non-alphanumeric characters resulting in inaccurate results
- speed multipliers being applied twice
- fix sig figs being extremely long (ie 57.400000000000006 instead of 57.4)
- `.osu` files not parsing (extra space in the path)
- `.osu` map file parse - map values (cs,ar,od,hp) not changing with mods applied
- `.osu` map file parse - NaN hitobject counters
- `.osu` map file parse - NaN BPM
- scorelists not being able to filter by NM
- scorelists changing `exact mods` to `include mods` when changing pages

### Changed

- move pp calc to be part of map cmd
- separate the "select map" tab into separate difficulty and map tabs
- tweak searchMatch();
- recommend map command - add "closest" and "random" arg
- move arg mode checkers to one function
- recmap - show map pool size
- change mode icons
- show # of servers/users/channels
- show # of scores in score list commands

### Added

- add a "select difficulty" tab to map
- country command

### Removed

- remove multiple difficulties from the same set and only show the first in search tabs

## [3.7.0] - 2023-11-06

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/83a9adc44875c48e16f1c1b8a34680c7e76db9f0)</br>

### Fixed

- simulate - map predicted pp being too high/low (forced clockrate of 1 instead of matching DT/HT/specified)
- sig figs - negative numbers would cause loops to infinitely recur. Changed n to Math.abs(n)
- simulate - displayed accuracy only changing from `-acc` param (n300,100 etc. would be ignored)
- scorelist command filters would be removed when changing pages - some variable checkers missing
- using multiple args for scorelist commands would result in omissions of some params
- sig figs of 1 cutting off trailing digits (ie 35.6 -> 3 instead of 4e1 or 40)
- `precomppath` being the same as `path`

### Changed

- simulate - pull values from previously used score if map id matches
- simulate - force acc to be 2 decimal places
- add more stats to info command
- osu - automatically refreshes user data

### Added

- simulate - show star rating
- added aliases
- osu - add average daily and monthly play count to detailed
- sex 😈

## [3.6.2] - 2023-10-26

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/6a1cb29237822513fe2b234b755639b9a317ae4e)</br>

### Fixed

- avatar no longer requires admin
- error handling for weather

## [3.6.0] - 2023-10-26

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/e38de7573df02eb6f38a70ff8ea7a81089ae88ad)</br>

### Fixed

- incorrect capitalisation in tz
- remove "." at the ends of sig fig numbers if there are no trailing digits
- weather precipitation hours being incorrect - hours would always be consecutive (ie 01:00, 02:00, 03:00 instead of 01:00, 03:00, 04:00)
- remove leading 0s on sig figs
- ts endlessly hanging when selecting a storm
- all conversions being labelled as "Unknown conversion"
- crashing on axios timeout error when updating changelog
- urls in help command not embedding properly

### Changed

- move conversions to a separate function
- added imperial units to weather cmd
- fixed missing timezones from dst
- make rs embeds use string ver like other score list commands
- changed functions that use x \* 10\*\* y to xey
- edit invalid conversion message
- fix up conversions - accuracy, formulae etc.

### Added

- added aliases to temp conversions
- added page buttons to ytsearch
- added btu, watt hours and square inches to conversions

### Removed

- remove full numbers from convert SI prefix list

## [3.5.7] - 2023-10-12

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/af0906ee036b8a140884fa77ab0db78889a46823)</br>

### Fixed

- reminder list saying "sending reminder _in in_"
- usa dst
- osu!auth token not updating

### Changed

- improve time command tz selector
- time command capitalising multi-word names
- weather command shows past 2 days and next 3 days

### Added

- add aliases to roll

## [3.5.0] - 2023-10-09

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/0fb571588c6253e7ebc03f03bda1441f367142c3)</br>

### Fixed

- replayparse and mapfileparse not running (discord changed file URLs)
- tracking files folder being created as an empty file by accident
- daylight savings being offset by a month
- map crashing if api data was null
- sig figs returning long values (ie instead of 68.9 it gives 68.89999999999999 when converting 175 cm to inches)

### Changed

- auto-censor config properties in cache
- edit graph colours
- strains and failtimes use map cover as background
- show flags in map leaderboards
- add server filter to debug commandfiletype
- combo is grabbed from pp calc where possible
- increase resolution of graphs
- better graph placeholder
- speed flag (-speed x) modifies map values
- edit time command StringSelectMenuBuilder
- edit timezones
- switch from node-fetch to axios

### Added

- "temperature" as weather cmd alias
- add link usage to link commands
- added aliases to remind
- add "pending" argument to changelog

## [3.4.0] - 2023-09-20

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/8f273ea03e3baed6388b033063364e30f9ce84f9)</br>

### Fixed

- server name when showing global leaderboard
- mania mods being applied to non-mania maps
- bws crashing when using interaction version
- compare (top plays) not working with page buttons - was looking for `u/id` instead of `users/id`
- error messages being unspecific
- fix help list having an extra , at the end
- scoreparse using emojis for mods even if `useEmojis.mods: false`
- convert command - multiplying instead of dividing and vice versa

### Changed

- change saved mods to `null` (NM) if from a map/ppcalc command (when no args are given, map id and mods are taken from last used)
- update helpinfo
- add timestamp to time cmd
- add "#" to global rank
- convert preserves sig figs
- rewrite convert
- add missing buttons to help command
- time cmd uses first tz found
- scoreparse can read scores via link when using command version

### Added

- add fortnight conversions
- interaction commands for changelog, weather, tropicalweather
- add tz and location to saved

## [3.3.0] - 2023-09-03

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/40c3b6731e34f42cbff523a015904aa12e4232bd)</br>

### Fixed

- page # when requesting to show all versions (changelog)
- east/west coords being swapped
- errors in replayparse
- rsbest saying "play" instead of "plays"
- east/west using latitude instead of longitude

### Changed

- versions are now evenly spaced (changelog)
- change wind directions to shorthand (west-southwest -> WSW)
- show all versions instead of just latest when an invalid input is given (changelog)
- changes in changelog are categorised by type
- show grade if passed (recent)
- update config checker and README
- switched rank pp to use regression to predict
- store weather data to reduce api calls needed
- put weather precipitation data on the same graph
- categories are now shown in tropical storms selector
- override pp/rank predictions if a value is almost the exact same as the input
- change map fail graph from line to stacked bar graph
- change precipitation graph to bar graph
- show storm positions as NESW instead of +-
- ppcalc pp values start on same vertical line
- don't show flashlight pp if 0
- re-add score to recent
- change buttons on recent
- precipitation graph shows each type
- colour coded changelog headings
- remove null results from lb

### Added

- add buttons to turn graph mode to user profile mode on osu cmd
- add sun/moon emojis to day/night
- add reminders list if no args (remind)
- set weather command
- added global and id opts to lb

## [3.2.0] - 2023-08-17

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/c4bca0407a8ff85ad7c078e0968d1bc345470e7c)</br>

### Fixed

- recent going back to most recent score when using non-page buttons
- fix changelog showing 0.4.1 instead of 0.4.1x
- debug commandfiletype not accepting "recent_activity"
- tropical storm global map not working

### Changed

- fix changelog showing 0.4.1 instead of 0.4.1x
- graph key
- update command checkers
- weather command automatically picks first result
- keep location selector in weather command

### Added

- add buttons to changelog
- wind gusts to weather command graphs
- WIP testing mode
- support for multiple datasets per graph
- added config checker
- DST support for time command
- add wind angle to wind direction

## [3.1.0] - 2023-08-05

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/bacac7be3a9b1511bbc9621f721ba30a01028409)</br>

### Fixed

- typing event being sent after command was replied to
- exactmods flag not parsing properly
- time broken in weather command
- tropical storm using wrong value for maximum category
- extraTypes differs from extratypes only in casing
- version undefined
- no such file or directory (path\\genStormMap)

### Changed

- changed icons for more/less details

### Added

- bpm sort
- weather graphs
- scorepost command - thumbnail and title generator. VERY WIP TEXT DOESN'T ALIGN PROPERLY YET
- added a tropical storm world map (broken)
- added supporter tag to osu command
- `commandfiletype` option in debug - returns the last used data for specified command
- changelog command

## [3.0.0] - 2023-06-16

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/6cd863f64c6a006170e9a663b292dac40ad5fd1b)</br>

### Fixed

- fixed users not showing in "tracklist"
- fixed tracklist showing "undefined" as gamemode
- score hyperlinks on scorelists not working
- SI prefixes no longer work on imperial measurements
- debugs clear arg (and added graph option)
- changed how get prev id is handled if there is no previous data to pull from
- changed ?.error to ?.hasOwnProperty('error') || api gives error property but error always == null so if statements return always false using if(?.error) but if(hasOwnProperty('error')) returns true
- image parsing
- map search being slightly broken
- correct difficulty is now shown when using image parse (previously would use highest)

### Changed

- emit typing event when receiving a command
- `err` logtofile logs to `err.log`
- changed empty fields on embeds from "-" to "⠀" (U+2800)
- prevent trackadd/remove from being used outside the guild's trackchannel
- edit osu!track timer to make debugging easier
- convert now accepts shorthand SI prefixes (ie kg, instead of kilogram)
- update error messages
- moved conversions.ts to src/consts/
- rewrote some of the sorting flags to fit the change above
- rewrote index numbers on scorelist commands
- remind command now tells what time the reminder will be sent at
- debug clear default now only clears temporary files
- command descriptions now link to the website version of the command
- more informative debug clear messages

### Added

- error checkers for missing perms in trackadd/remove
- new SI prefixes - quetta, ronna, ronto, quecto
- arbitrary conversions
- added greater/less than args to filter by pp, score etc.
- more time conversions
- `weather` command
- `inspire` command
- tropical storm command
- added debug to helpinfo

## [2.18.2] - 2023-04-10

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/c328732d575b4aae819ec07d35d5c0cf99de912a)</br>

### Fixed

- random map causing crashes
- `rl` sorting by pp

## [2.18.0] - 2023-04-10

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/c328732d575b4aae819ec07d35d5c0cf99de912a)</br>

### Changed

- recommend map design
- recommend map and random map re-direct to the `map` command
- edit how non-latin character map titles are shown (ie japanese)
- update dependencies

### Added

- median value in scorestats
- error embed for recommend map and random map
- re-add `gif` command

## [2.17.0] - 2023-03-26

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/687aa84a0698b1a77ea78b3f5d4331a075b6d043)</br>

### Fixed

- get fail point causing crashes
- `compare` hanging
- fix get fail point showing wrong fail time
- disabled commands still running

### Changed

- dates are now shown using discord timestamps (rather than showing all times in UTC+0)

### Deprecated

- `osc`/`globals` command

## [2.16.0] - 2023-03-24

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/ddf104c2d6954e726f9662ad2dc2220db561af12)</br>

### Fixed

- null property in apiget causing crashes

### Changed

- update dependencies

### Added

- lightspeed conversion
- recommend map command

## [2.15.0] - 2023-03-12

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/3fc799cc5c28c4d6c88e7d6a8e1bdb750df0504c)</br>

### Fixed

- map file parse
- strains with NaN times

### Changed

- update coin flip images
- select/dropdown list in `time` command
- show strains in other gamemodes

### Added

- more timezones
- set timezone command

## [2.14.0] - 2023-02-26

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/d9151bbb43245b46b0a16047ebc125c2a1b8a23f)</br>

### Fixed

- SI prefixes not dividing/multiplying correctly
- `[optional arg]` `<required arg>` not being on a separate line
- filtering by `most played` causing crashes

### Changed

- conversion formulas include SI prefixes
- update args to retrieve help menu and si prefixes in `convert`
- `most played` shows map difficulty

### Added

- `-bg` in `map` command shows only background url(s)

## [2.13.0] - 2023-02-19

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/ad076f1511dc8fefad7369bb97b49f68101249fa)</br>

### Changed

- reworked `convert` command
- changed `map` command layout

### Added

- SI prefixes
- buttons that call separate commands now say "Requested by `<user>`"
- pressure, energy, area, angle and speed conversions

## [2.12.0] - 2023-02-11

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/15801df248b24e2b6d68da8fa208abb79db784cd)</br>

### Fixed

- using locally stored images in embeds
- `time` command showing day of year instead of day of month

### Changed

- outdated messages show bot and disabled command version
- changed required options to be listed as `<arg>` and optional as `[arg]`

### Added

- added heads or tails images to coin flip

### Removed

- graphChannelId property from config

## [2.11.0] - 2023-02-05

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/15801df248b24e2b6d68da8fa208abb79db784cd)</br>

### Fixed

- `time` command crashing on invalid timezones
- remove excess new line between score hits and score rank/fail info
- math command uses `string-math` instead of `eval();`

### Changed

- edit hitlist
- change 'fcacc' from using if statements to a switch statement
- remove case sensitivity for timezones

### Added

- more aliases for individual timezones
- coin flip command

### Removed

- remove UR on `replayparse`
- `rs`s compact mode
- `gif` command from `helpinfo.ts`

## [2.10.0] - 2023-01-22

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/67de12ec87dc9a74c738069fb4efd0d0842c8221)</br>

### Fixed

- re-add reverse arguments to score list commands
- move interaction.deferUpdate() to fix false interaction failed errors
- HT returning the wrong AR

### Changed

- time command shows days again
- README.md and LICENSE
- if max combo is reached, the combo is now bold
- time command no longer shows UTC if another timezone is requested
- time still displays original timezone on clashing timezones
- time is displayed in specific columns for readability

### Added

- add scores button to `rs` and `scoreparse`
- `badges` command

## [2.9.0] - 2023-01-12

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/ec60a52823a7720a8c9e3e6efbc9bb81e2b4a1e3)</br>

### Fixed

- `time` command time offset displaying incorrectly
- sorting by cs/ar/od/hp/length not working in `ubm`

### Changed

- rework fail point calculator (more accurate)
- reworked time command: uses timezones like CST, AEST and UTC+10 instead of (region)/(city)
- moved errors to `src/consts/errors.ts`

### Added

- graph that shows exact point of fail in rs
- added stats for score grades to scorestats

## [2.8.0] - 2023-01-04

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/1fe82480c9bb288321264c4d33b0d9b8dc570fb4)</br>

### Fixed

- `osu` command crashing on users with null data
- `maplb` page buttons disabling on the second page if mods were selected
- `help` command crashing
- `globals` command crashing

### Changed

- edited author.name sections
- added user info to `recent`'s author.name section
- edit buttons to all be the same style
- all users can access the user, map and maplb buttons even if they didn't send the command
- edited some user-based urls to automatically scroll to certain sections (the osutop url scrolls to top_ranks etc.)
- change incorrect timezone message to ask for region instead of country
- rework score list handler

### Added

- to do list
- added counts of maplbs (#1s, #50s etc...)
- warning on buttons that aren't allowed to be used
- filter scores by rank option

## [2.7.0] - 2022-12-28

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/33b1f2679676931914cbd0ab0b4f58276712fe7b)</br>

### Fixed

- convert not showing the - sign on negative numbers

### Changed

- reworked statuses
- rework get/write prev id to store mods.
- moved moved changelog.txt and bugs.txt to changelog\\
- re-ordered some buttons
- `maplb` no longer uses last map's mods by default

### Added

- statuses use maps cached in .\\cache\\commandData\\
- leaderboard button in `map` command
- bug tracker
- map button in `maplb`

## [2.6.0] - 2022-12-22

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/e413f9b949dc824897a279735a61f44bc412840c)</br>

### Fixed

- paths ('./' => `${path}/`)
- missing config properties
- `osutop` sorting by recent
- rank lost events not using the beatmap url (was using /b/mapid instead of https://osu.ppy.sh/b/mapid)

### Changed

- update help info and docs
- map button on `rs` and `scoreparse` now applies mods from the score
- edit ranking grades (again) for readability

### Added

- unstable rate calculator (WIP - calculations are very off)
- map parser (WIP)
- user button to `bws`, `firsts`, `globals`, `map`, `nochokes`, `osutop`, `pinned`, `recent`, `recentactivity`, `scoreparse`, `scores`, `scorestats`, `ubm`, `whatif`

## [2.5.0] - 2022-12-16

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

## [2.4.1] - 2022-12-13

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/9b2d8f945091bd9c798e367ecb662a369664497a)</br>

### Fixed

- medals in `rsact` displaying as `[object Object]`
- rl only showing one score
- permissions checker
- `maplb` and `scores`/`c` crashing when calculating performance (undefined map object)
- map ids not being stored in the correct path

## [2.4.0] - 2022-12-10

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/d7f4856f3fa92458ecb5a5e448d0bcabf973dc22)</br>

### Fixed

- pages for expanded lists
- ppcalc being slow

### Changed

- code clean up

#### Added

- `recentactivity`/`rsact` command

## [2.3.0] - 2022-12-06

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

## [2.2.0] - 2022-12-03

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

## [2.1.0] - 2022-09-14 --- 2022-11-07 --- 2022-12-01

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

## [1.2.0] - 2022-09-03

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/c9eed60322ae19a7b0e040997d29b5e2fa4d7ca0)</br>

### Info

undocumented

## [1.1.0] - YYYY-MM-DD

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/c9eed60322ae19a7b0e040997d29b5e2fa4d7ca0)</br>

### Info

undocumented

## [1.0.0] - 2022-06-09

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/c3566227ccecb19e93935a5be65f1c63dc7a0949)</br>

### Changed

- switched pp calculator (booba -> rosu-pp-js)
- code cleanup

## [beta-1.0.0] - 2022-03-11

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/10bf389f91247ae4070e2f5be3eb013ba2e80337)</br>

### Changed

- upgraded to discord.js v13.x.x

### Added

- first implementation of slash commands
- osu commands

## [alpha-1.2.0] - 2021-12-29

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/34d53fbac325157b63093a4bae5c514bc60f64b1)</br>

### Info

no recorded changes </br>
old version preserved [here](https://github.com/sbrstrkkdwmdr/sbrbot/tree/discordjs-v12)

## [alpha-1.1.0] - 2021-11-04

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/de46d2dc56986e59f1a33f189f232d185327c9a0)</br>

### Info

no changes (first version)</br>
running on discord.js v12.x.x</br>

## [alpha-1.0.0] - 2021-08-07

[commit](https://github.com/sbrstrkkdwmdr/sbrbot/commit/7005504084d13a619e43b9781d27a8fa1470bf13)</br>

### Info

project created
