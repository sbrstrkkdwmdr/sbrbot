module.exports = {
    name: 'noperms',
    async execute(commandType, obj) {

        switch (commandType) {
            //==============================================================================================================================================================================================
            case 'interaction': {
                obj.reply({
                    content: 'You do not have permission to use this command.',
                    embeds: [],
                    files: [],
                    ephemeral: true,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }

        }
    }
}