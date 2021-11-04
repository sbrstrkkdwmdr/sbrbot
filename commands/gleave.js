module.exports = {
    name: 'gleave',
    description: '',
    execute(message, args, client) {
        if(message.author.id = 503794887318044675){
        let guildID = client.guilds.cache.get(args[0]);
        if(!guildID){ return(false) }
        return guildID.leave()
    }
        }
    }