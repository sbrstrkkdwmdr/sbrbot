const fs = require("fs");
const https = require("https");
module.exports = (
  client,
  Discord,
  osuauthtoken,
  osuapikey,
  osuclientid,
  osuclientsecret,
  trnkey,
  ytdl,
  monitorEventLoopDelay,
  setInterval,
  token
) => {
  const { prefix } = require("./config.json");
  client.linkdetect = new Discord.Collection();
  const { recordingchannel } = require("./config.json");

  const linkFiles = fs
    .readdirSync("./links/")
    .filter((file) => file.endsWith(".js"));
  for (const file of linkFiles) {
    const link = require(`./links/${file}`);

    client.linkdetect.set(link.name, link);
  }
  client.on("messageCreate", (message) => {
    const args = message.content.slice(prefix.length).split(/ +/); //args are the message content but without the prefix
    const linkargs = message.content.split(/ +/); //linkargs are the message content

    let consoleloguserweeee = message.author;
    let currentDate = new Date();
    let currentDateISO = new Date().toISOString();
    let currentDateForSomeApiThing = new Date().toISOString().slice(0, 10);
    let timeStamp = new Date().getTime();
    let curdateyesterdaytimestamp = timeStamp - 24 * 60 * 60 * 1000;
    let curdateyesterday = new Date(curdateyesterdaytimestamp)
      .toISOString()
      .slice(0, 10);
    let curdatetmrtimestamp = timeStamp + 24 * 60 * 60 * 1000;
    let curdatetmr = new Date(curdatetmrtimestamp).toISOString().slice(0, 10);
    let split = new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/);
    let curtimezone = split[split.length - 1];

    /*const inventory = [
        {name: 'apples', quantity: 2},
        {name: 'cherries', quantity: 8},
        {name: 'bananas', quantity: 0},
        {name: 'cherries', quantity: 5},
        {name: 'cherries', quantity: 15},
        
      ];
      
      const result = inventory.find( ({ name }) => name === 'cherries' );
      
      console.log(result) // { name: 'cherries', quantity: 5 }*/
    //client.linkdetect.get('messagesaver').execute(linkargs, message, args, currentDate, currentDateISO);

    if (
      message.content.startsWith("https://osu.ppy.sh/b/") ||
      message.content.startsWith("osu.ppy.sh/b/") ||
      message.content.startsWith("https://osu.ppy.sh/beatmaps/") ||
      message.content.startsWith("osu.ppy.sh/beatmaps/")
    ) {
      client.linkdetect
        .get("osumaplink")
        .execute(
          linkargs,
          message,
          args,
          Discord,
          currentDate,
          currentDateISO,
          osuapikey,
          osuauthtoken,
          osuclientid,
          osuclientsecret
        );
    }
    if (
      message.content.startsWith("https://osu.ppy.sh/beatmapsets/") ||
      message.content.startsWith("osu.ppy.sh/beatmapsets")
    ) {
      client.linkdetect
        .get("osulongmaplink")
        .execute(
          linkargs,
          message,
          args,
          Discord,
          currentDate,
          currentDateISO,
          osuapikey,
          osuauthtoken,
          osuclientid,
          osuclientsecret
        );
    }
    if (
      message.content.startsWith("https://osu.ppy.sh/u/") ||
      message.content.startsWith("osu.ppy.sh/u/") ||
      message.content.startsWith("https://osu.ppy.sh/users/") ||
      message.content.startsWith("osu.ppy.sh/users/")
    ) {
      client.linkdetect
        .get("osuprofilelink")
        .execute(
          linkargs,
          message,
          args,
          Discord,
          currentDate,
          currentDateISO,
          osuapikey,
          osuauthtoken,
          osuclientid,
          osuclientsecret
        );
    }
    if (
      message.content.startsWith("https://osu.ppy.sh/scores/") ||
      message.content.startsWith("osu.ppy.sh/scores/")
    ) {
      client.linkdetect
        .get("osuscorelink")
        .execute(
          linkargs,
          message,
          args,
          Discord,
          currentDate,
          currentDateISO,
          osuapikey,
          osuauthtoken,
          osuclientid,
          osuclientsecret
        );
    }

    //REPLAY GRABBER
    if (
      message.attachments.size > 0 &&
      message.attachments.every(attachIsOsr)
    ) {
      attachosr = message.attachments.first().url;
      //console.log(attachosr)

      let osrdlfile = fs.createWriteStream("./files/replay.osr");
      let requestw = https.get(`${attachosr}`, function (response) {
        response.pipe(osrdlfile);

        //console.log('success')
      });
      console.log("");
      setTimeout(() => {
        client.linkdetect
          .get("replayparse")
          .execute(
            linkargs,
            message,
            args,
            Discord,
            currentDate,
            currentDateISO,
            osuapikey,
            osuauthtoken,
            osuclientid,
            osuclientsecret
          );
      }, 1500);
      if (message.channelId == recordingchannel) {
        //replayrecord
        function exec(
          cmd,
          handler = function (error, stdout, stderr) {
            console.log(stdout);
            if (error !== null) {
              console.log(stderr);
            }
          }
        ) {
          const childfork = require("child_process");
          return childfork.exec(cmd, handler);
        }
        setTimeout(() => {
          //client.linkdetect.get('replayrecord').execute(exec, linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
          client.linkdetect
            .get("replayrecordv2")
            .execute(
              exec,
              linkargs,
              message,
              args,
              Discord,
              currentDate,
              currentDateISO,
              osuapikey,
              osuauthtoken,
              osuclientid,
              osuclientsecret
            );
        }, 1500);
      }
    }

    function attachIsOsr(msgAttach) {
      var url = msgAttach.url;
      return url.indexOf("osr", url.length - "osr".length /*or 3*/) !== -1;
    } //check if attachments are osr. can be changed to other file types
  });
}; // end
