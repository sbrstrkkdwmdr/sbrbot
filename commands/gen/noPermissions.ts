module.exports = {
    name: 'noperms',
    async execute(commandType, obj) {

        switch (commandType) {
            // case 'message': {
            //     obj.reply({
            //         content: '',
            //         embeds: [],
            //         files: [],
            //         allowedMentions: { repliedUser: false },
            //         failIfNotExists: true
            //     })
            //         .catch();
            // }
            //     break;
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