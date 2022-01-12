let currentDate = new Date();
let currentDateISO = new Date().toISOString();
module.exports = {
    name: 'say',
    description: "say",
    execute(message, args) {
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