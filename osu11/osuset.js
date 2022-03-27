const fs = require('fs')
module.exports = {
    name: 'osuset',
    description: "Sets your osu! username so you can use osu! commands without specifying a username.",
    async execute(userdatatags, message, args, Discord, currentDate, currentDateISO){
        let pickeduserX = args.splice(0,1000).join(" ");
        if(!pickeduserX || pickeduserX == '' || pickeduserX == []) return message.reply('please input a valid username')
        fs.appendFileSync('osu.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('osu.log', "\n" + "command executed - osu set")
        let consoleloguserweeee = message.author
        fs.appendFileSync('osu.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('osu.log', "\n" + "") 
        //message.reply('...')

		try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			await userdatatags.create({
				name: message.author.id,
				description: pickeduserX,
				username: message.author.id,
			});

			return message.reply(`${pickeduserX} added.`);
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
                affectedRows = await userdatatags.update({ description: pickeduserX }, { where: { name: message.author.id } });
        
            if (affectedRows > 0) {
                return message.reply(`username updated.`);
            }
				//return message.reply('That username is already taken.');
			}

			return message.reply('Something went wrong with adding a username.');
		}
    }
}
