//const helper = require('../helper.js');

module.exports = {
    name: 'osuset',
    description: "Sets your osu! username so you can use osu! commands without specifying a username.",
    async execute(userdatatags, interaction, options, Discord, currentDate, currentDateISO){
        const pickeduserX = options.getString('username')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - osu set")
        let consoleloguserweeee = interaction.member.user
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        //interaction.reply('...')

		try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			await userdatatags.create({
				name: interaction.member.user.id,
				description: pickeduserX,
				username: interaction.member.user.id,
			});

			return interaction.reply(`${pickeduserX} added.`);
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
                affectedRows = await userdatatags.update({ description: pickeduserX }, { where: { name: interaction.member.user.id } });
        
            if (affectedRows > 0) {
                return interaction.reply(`username updated.`);
            }
				//return interaction.reply('That username is already taken.');
			}

			return interaction.reply('Something went wrong with adding a username.');
		}
    }
}
