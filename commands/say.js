module.exports = {
    name: 'say',
    description: "say",
    execute(message, args, currentDate, currentDateISO) {
        const saythis = args.splice(0,1000).join(" ");
        message.delete();
        message.channel.send(saythis)
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - say")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}