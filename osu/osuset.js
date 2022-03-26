module.exports = {
    name: 'osuset',
    description: "Sets your osu! username so you can use osu! commands without specifying a username.",
    async execute(userdatatags, interaction, options, Discord, currentDate, currentDateISO){
        const pickeduserX = options.getString('username')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - osu set")
        console.log("category - osu (no api usage)")
        let consoleloguserweeee = interaction.member.user
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        //interaction.reply('...')
        let type = options.getString('type')
        console.log(type + '|')
        if(!type || type == 'username' || type == 'name' || type == 'user' || type == null || type == 'null'){
		try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			await userdatatags.create({
				name: interaction.member.user.id,
				description: pickeduserX,
				username: interaction.member.user.id,
                mode: 'osu'
			});

			interaction.reply(`${pickeduserX} added.`)
            console.log("sent")
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
                affectedRows = await userdatatags.update({ description: pickeduserX }, { where: { name: interaction.member.user.id } });
        
            if (affectedRows > 0) {
                return interaction.reply(`username updated.`);
            }
				//return interaction.reply('That username is already taken.');
			}

			interaction.reply('Something went wrong with adding a username.');
            return console.log(error);
		}}
        else if(type == 'mode'){
            try {
                // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
                await userdatatags.create({
                    name: interaction.member.user.id,
                    username: interaction.member.user.id,
                    mode: pickeduserX
                });
    
                interaction.reply(`${pickeduserX} added.`)
                console.log("sent")
            }
            catch (error) {
                //console.log(error)
                if (error.name === 'SequelizeUniqueConstraintError') {
                    affectedRows = await userdatatags.update({ mode: pickeduserX }, { where: { name: interaction.member.user.id } });
            
                if (affectedRows > 0) {
                    return interaction.reply(`mode updated.`);
                }
                    //return interaction.reply('That username is already taken.');
                }
                
                interaction.reply('Something went wrong with editing mode.');
                return console.log(error);
            }}
        else if(type == 'haloinfiniteprofile' || type == 'xbox' || type == 'xboxlive' || type == 'xbx'){
            try {
                // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
                await userdatatags.create({
                    name: interaction.member.user.id,
                    username: interaction.member.user.id,
                    xboxlive: pickeduserX
                });
    
                interaction.reply(`${pickeduserX} added to xbox live username.`)
                console.log("sent")
            }
            catch (error) {
                //console.log(error)
                if (error.name === 'SequelizeUniqueConstraintError') {
                    affectedRows = await userdatatags.update({ xboxlive: pickeduserX }, { where: { name: interaction.member.user.id } });
            
                if (affectedRows > 0) {
                    return interaction.reply(`xbox live username updated.`);
                }
                    //return interaction.reply('That username is already taken.');
                }
                
                interaction.reply('Something went wrong with editing xbox live username.');
                return console.log(error);
            }}
else if(type == 'steam'){
            try {
                // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
                await userdatatags.create({
                    name: interaction.member.user.id,
                    username: interaction.member.user.id,
                    steamusername: pickeduserX
                });
    
                interaction.reply(`${pickeduserX} added to steam username.`)
                console.log("sent")
            }
            catch (error) {
                //console.log(error)
                if (error.name === 'SequelizeUniqueConstraintError') {
                    affectedRows = await userdatatags.update({ steamusername: pickeduserX }, { where: { name: interaction.member.user.id } });
            
                if (affectedRows > 0) {
                    return interaction.reply(`steam username updated.`);
                }
                    //return interaction.reply('That username is already taken.');
                }
                
                interaction.reply('Something went wrong with editing steam username.');
                return console.log(error);
            }}
        else{
            //return interaction.channel.send("error - can only update mode or username")
        }
    }
}
