const fs = require('fs');
//const helper = require('../helper.js');
//const w 
const sql = require("sqlite");
module.exports = {
    name: 'osusave',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) { 
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - osusave")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        let userid = message.author.id

        message.reply("WIP (can someone else code this for me pls im dumb)")


        sql.open("./database.sqlite")
sql.run("CREATE TABLE IF NOT EXISTS userData (userId TEXT, money INTEGER)").then(() => {
    sql.run("INSERT INTO userData (userId, money) VALUES (?, ?)", [userid, 0]);
});
sql.get(`SELECT * FROM userData WHERE userId = ${message.author.id}`).then(row => { //the row is the user's data
    if(!row) { //if the user is not in the database
      sql.run("INSERT INTO userData (userId, money) VALUES (?, ?)", [`${guildId}`, userid, 0]); //let's just insert them
      msg.channel.send("Registered.")
    } else { //if the user is in the database
      sql.run(`UPDATE userData SET money = ${row.money + 100} WHERE guild = ${msg.guild.id}`)
    }
});
}
}
//client.commands.get('').execute(message, args)