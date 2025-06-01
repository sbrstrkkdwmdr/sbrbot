# TO-DO LIST

newest-oldest

## current
- [ ] reduce code complexity
- [x] fix changelog (buttons switch commands, etc.)
- [x] fix commands re-sending api calls when switching pages
- [x] fix button commands
- [x] test admin cmds
- [x] test misc cmds
- [x] test osu_other cmds
- [x] ensure all commands have `this.name` set
- [x] use `this.send` instead of `commands.sendMessage` when possible
- [x] change user == null to `validUser`
- [x] fix FileNotFound in map commands
- [x] get command to work in DMs (atm. only message commands)
- [x] interaction commands
- [x] map PP values all the same
- [x] custom cs,ar,od,hp in simulate
- [x] handling for mod adjustments (DA, DT rate change)
- [x] AR in `map` and `ppcalc` being higher than expected
- [x] previously requested maps calling the wrong beatmap ID
- [x] maps unable to request beatmapset
- [x] maplb score #s not updating with the page
- [x] fc pp being way lower than expected
- [x] pages buttons not working
- [x] `changelog` pages being broken after using select page 
- [x] maplb doesnt filter by mods
- [x] `recent` showing star rating as `undefined`

## 4.0.0 rewrite
- [x] re-implement all commands
- [x] command handler
- [x] link handler
- [x] button handler
- [ ] interaction handler
- [x] loops
- [x] bug fixing


### bug fixes
- [x] mods not working in pp calculations
- [x] calling map command via button causes an "interaction already replied/deferred" error
- [x] buttons that call commands (eg map, user) replace the old embed instead of making a new message
- [x] page buttons not doing anything
- [x] overrides via command aliases not working (rl, ubm) 
- [x] whatif accepting ALL arguments as the user argument (whatif 300 -> "could not find user 300", whatif saberstrike 300 -> "could not find user saberstrike 300)
- [x] scoreparse not working with new score ids

## pre 4.0.0 

- [x] bot docs allow search by command alias
- [x] support userlinks in commands that take user as a param
- [ ] https://stackoverflow.com/questions/59655314/how-to-generate-an-image-from-dynamically-created-html-in-nodejs
- [x] convert now returns NaN
- [ ] fix new graph method not having a background
- [ ] scoreparse not working with new score ids on website -> https://osu.ppy.sh/scores/osu/4308973497 and https://osu.ppy.sh/scores/1637688819 are the same but only the first link works
- [x] save osutopdata, pinnedscoresdata and firstsdata by user id instead of command id
- [x] re-order nochokes scores
- [x] remove (if FC) from nochokes
- [x] use tenor API (or similar) for gif commands
- [x] fix lb command showing an empty list 
- [ ] bugtracker command 
- [ ] medals command 
- [x] make strain graphs use osu map background
- [x] weather command - add wind,temperature, precipitation graphs 
- [x] weather command - add wind direction 
- [x] map of all systems in tropical weather command
- [x] add natural disasters/warnings to weather cmd (hurricane, tsunami etc.) (partially implemented via tropical weather command)
- [x] redo how commands show unicode titles
- [x] gif commands
- [x] fix strains graph showing NaN:NaN
- [x] set time command
- [x] random string gen recursive function
- [x] label all versions in changelog.txt commits
- [x] add energy, area, angle and speed conversions
- [ ] time command can parse a time eg. in (x) hours
- [x] add button version and current version to outdated command message
- [x] make option options more distinct in helpinfo
- [x] show timezone map on time command
- [x] add every* continent and country to the timezone db (excluding antartica)
- [x] put time command times all starting off the same column for readability + keep timezone name when using select menu 
- [x] "requested by x" text on some button commands
- [x] badges command
- [x] add place names to time command (ie singapore, auckland etc.)
- [x] add scores button to rs and scoreparse
- [ ] put strains and fails graph on the same graph
- [x] add timezone options to time (ie AEDT, CST)
- [x] add `most played`, `ranked` etc. aliases to `userbeatmaps`
- [x] command options like filter and sort in a separate embed or section (partially implemented)
- [x] edit arg handling in score list commands
- [x] add score + rank filter to score list commands
- [x] make all button emojies the same theme
- [x] osu map ranks command (#1s, #10s etc.) (FEATURE REMOVED 202X-XX-XX)
- [ ] show fail point on `recent` strains graph
- [x] health + strains graph (`recent` and `scoreparse`)
- [x] fix map parser
- [x] fix pages on maplb
- [x] recommend map command

## DEPRECATED
won't be implemented
- [ ] profile card command (like show a jpg)
- [ ] score title/thumbnail generator
- [ ] PV=nRT, n=m/M calculations
- [ ] unstable rate calculator
- [ ] render command

## SSOB V4 REWRITE
- [ ] command handler
- [ ] button handler
- [ ] link handler
- [ ] commands
- [x] osu api
- [x] osu pp calculator
- [ ] helper functions