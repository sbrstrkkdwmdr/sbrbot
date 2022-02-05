module.exports = {
    name: 'psr',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        let playerguess = args[0];
        let botguesses = ["paper", "scissors", "rock"];
        let botguess = botguesses[Math.floor(Math.random() * botguesses.length)];

        
        if(playerguess == "paper" && botguess == "paper") return message.reply("I picked " + String(`${botguess}`) + " | We tied");
        if(playerguess == "paper" && botguess == "scissors") return message.reply("I picked " + String(`${botguess}`) + " | I win");
        if(playerguess == "paper" && botguess == "rock") return message.reply("I picked " + String(`${botguess}`) + " | You win");
        if(playerguess == "scissors" && botguess == "paper") return message.reply("I picked " + String(`${botguess}`) + " | You win");
        if(playerguess == "scissors" && botguess == "scissors") return message.reply("I picked " + String(`${botguess}`) + " | We tied");
        if(playerguess == "scissors" && botguess == "rock") return message.reply("I picked " + String(`${botguess}`) + " | I win");
        if(playerguess == "rock" && botguess == "paper") return message.reply("I picked " + String(`${botguess}`) + " | I win");
        if(playerguess == "rock" && botguess == "scissors") return message.reply("I picked " + String(`${botguess}`) + " | You win");
        if(playerguess == "rock" && botguess == "rock") return message.reply("I picked " + String(`${botguess}`) + " | We tied");
        if(!playerguess) return message.reply("please pick rock, paper, or scissors");
        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - paper scissors rock")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)