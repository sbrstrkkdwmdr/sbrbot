module.exports = {
    name: 'noperms',
    async execute(commandType, obj, type) {

        switch (type) {
            case 'user': {
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
                break;
            case 'bot': {
                switch (commandType) {
                    case 'message': {
                        obj.reply({
                            content: 'I am missing permissions to use this command.',
                            embeds: [],
                            files: [],
                            ephemeral: true,
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        })
                            .catch();
                    }
                        break;
                    //==============================================================================================================================================================================================
                    case 'interaction': {
                        obj.reply({
                            content: 'I am missing permissions to use this command.',
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
    }
}