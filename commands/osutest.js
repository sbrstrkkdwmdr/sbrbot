const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../osuauth.json');
const { std_ppv2 } = require('booba');
module.exports = {
    name: 'osutest',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
       if(message.author.id == '503794887318044675'){ 
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - osutest")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 

        try{
            
const API_KEY = osuapikey; // osu! api v1 key
const USER = '1023489';

(async () => {
  const response = await fetch(`https://osu.ppy.sh/api/get_user_recent?k=${API_KEY}&u=${USER}&limit=1`);
  const json = await response.json();
  const [score] = json;

  const pp = new std_ppv2().setPerformance(score);

  console.log(await pp.compute())
  /* => {
    aim: 108.36677305976224,
    speed: 121.39049498160061,
    fl: 514.2615576494688,
    acc: 48.88425340242263,
    total: 812.3689077733752
  } */
})();
        } catch(err){
            console.log(err)
        } }
}
}
//client.commands.get('').execute(message, args)