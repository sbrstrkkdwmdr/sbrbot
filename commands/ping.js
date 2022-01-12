module.exports = {
    name: 'ping',
    description: 'ping',
    execute(message, args, client, Discord) {
      let currentDate = new Date();
      let currentDateISO = new Date().toISOString();
      message.channel.send('pong!');   
      message.channel.send(`Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
      console.log(`${currentDateISO} | ${currentDate}`)
      console.log("command executed - ping")
      let consoleloguserweeee = message.author
      console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
      console.log(`Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
      console.log("")
    }
}
// @ts-check // Can be removed, used to check typings and valid actions

const { MessageEmbed } = require('discord.js');
const quick = require('quick.db');

//BELOW IS SOME VERSION I FOUND ON CODELYON DISCORD. IDK WHAT TO CHANGE TO FIX IT
/*module.exports = {
  name: 'ping',
  aliases: [],
  description: 'Get bot ping.',
  async execute(client, message, args, Discord) {
    const ping = await getDBPingData();
    const messagePing = Date.now(); // start before message sent
    const msg = await message.channel.send('Loading...');
    const endMessagePing = Date.now() - messagePing; // end of message sent

    const embed = new MessageEmbed() // build message embed
      .setDescription(
        `
        Database ping data:
        - Fetch ping: \`${ping.endGet}ms\`
        - Wright ping: \`${ping.endWright}ms\`
        - Avrage ping: \`${ping.avarage}ms\`
        Message ping: \`${endMessagePing}ms\`
      `
      )
      .setColor('GREEN')
      .setTimestamp();

    msg.edit({
      content: '',
      embed,
    }); // edit message content
  },
};

async function getDBPingData() {
  // get the fetch data ping
  const startGet = Date.now();
  await quick.get('QR=.');
  const endGet = Date.now() - startGet;

  // get the wright data ping
  const startWright = Date.now();
  await quick.set('QR=.', Buffer.from(startWright.toString()).toString('base64'));
  const endWright = Date.now() - startWright;

  // avrage ping time
  const avarage = (endGet + endWright) / 2;
  try {
    quick.delete('QR=.'); // try deleteing
  } catch (error) {}
  return { endGet, endWright, avarage }; // return the ping data
}*/
