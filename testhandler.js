const { Constants } = require('discord.js');
const { testguild } = require('./config.json');
module.exports = (Tags, client, Discord, osuauthtoken, osuapikey, osuclientid, osuclientsecret, trnkey, ytdl, monitorEventLoopDelay, setInterval, token) => {
    const guildid = testguild
    const guild = client.guilds.cache.get(guildid)
    let commands 
    
    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }
    commands?.create({
        name: 'addtag',
        description: 'adds a tag',
        options:[
            {
                name: 'tagname',
                description: 'tag name',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name: 'tagdescription',
                description: 'description',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    })
    commands?.create({
        name: 'tag',
        description: 'fetch tag',
        options:[
            {
                name: 'tagname',
                description: 'tag name',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            },
        ]
    })
    commands?.create({
        name: 'edittag',
        description: 'edit tag',
        options:[
            {
                name: 'tagname',
                description: 'tag name',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name: 'tagdescription',
                description: 'description',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    })
    commands?.create({
        name: 'taginfo',
        description: 'replies with pong.',
        options:[
            {
                name: 'tagname',
                description: 'tag name',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            },
        ]
    })
    commands?.create({
        name: 'showtag',
        description: 'shows a tag',
    })
    commands?.create({
        name: 'deltag',
        description: 'deletes a tag',
        options:[
            {
                name: 'tagname',
                description: 'tag name',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            },
        ]
    })
    client.on('interactionCreate', async (interaction) =>{
        if (!interaction.isCommand()) return
        const { commandName, options} = interaction
switch(commandName){
    case 'addtag':
        tagname = interaction.options.getString('tagname');
		tagdescription = interaction.options.getString('tagdescription');

		try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			tag = await Tags.create({
				name: tagname,
				description: tagdescription,
				username: interaction.user.username,
			});

			return interaction.reply(`Tag ${tag.name} added.`);
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('That tag already exists.');
			}

			return interaction.reply('Something went wrong with adding a tag.');
		}
        break;
        case 'tag':
            tagname = interaction.options.getString('tagname');

            // equivalent to: SELECT * FROM tags WHERE name = 'tagname' LIMIT 1;
            tag = await Tags.findOne({ where: { name: tagname } });
        
            if (tag) {
                // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagname';
                tag.increment('usage_count');
        
                return interaction.reply(tag.get('description'));
            }
        
            return interaction.reply(`Could not find tag: ${tagname}`);
            break;  
        case 'edittag':
            tagname = interaction.options.getString('tagname');
            tagdescription = interaction.options.getString('tagdescription');
        
            // equivalent to: UPDATE tags (description) values (?) WHERE name='?';
            affectedRows = await Tags.update({ description: tagdescription }, { where: { name: tagname } });
        
            if (affectedRows > 0) {
                return interaction.reply(`Tag ${tagname} was edited.`);
            }
        
            return interaction.reply(`Could not find a tag with name ${tagname}.`);
            break;
        case 'taginfo':
            tagname = interaction.options.getString('tagname');

            // equivalent to: SELECT * FROM tags WHERE name = 'tagname' LIMIT 1;
            tag = await Tags.findOne({ where: { name: tagname } });
        
            if (tag) {
                return interaction.reply(`${tagname} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
            }
        
            return interaction.reply(`Could not find tag: ${tagname}`);
            break;
        case 'showtag':
            	// equivalent to: SELECT name FROM tags;
            tagList = await Tags.findAll({ attributes: ['name'] });
            tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';

            return interaction.reply(`List of tags: ${tagString}`);
        case 'deletetag':
            tagname = interaction.options.getString('tagname');
            // equivalent to: DELETE from tags WHERE name = ?;
            rowCount = await Tags.destroy({ where: { name: tagname } });
        
            if (!rowCount) return interaction.reply("That tag doesn't exist.");
        
            return interaction.reply('Tag deleted.');
            break;

        default:
            break;
}
});
}