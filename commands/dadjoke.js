module.exports = {
    name: 'dadjoke',
    description: '',
    execute(message, args, currentDate) {
        let rdm = ["I'm not shellfish! I only crab what I need", "I like to tell dad jokes. He laughs at them",
    "What did the tomato say to the slower tomato? Ketchup!", "YOUR MOM", "Time flies like an arrow. Fruit flies like a banana", 
    "To the guy who invented zero, thanks for nothing!", "Did you hear about the restaurant on the moon? It tastes good, but there's no atmosphere",
    "I don't trust stairs. THey're always up to something", 
    "I accidentally swallowed paint yesterday. The doctor says it's fine but I think I'm dying",
    "I was wondering where this bat was coming from, then it hit me",
    "I don't trust atoms, they make up everything!",
    "you matter. unless you're multiplied by the speed of light, then you energy",
    "I heard to put alcohol in an elevator. Really lifts your spirits",
    "A cheese factory exploded one day. Nothing left except de-brie",
    "I got into a heated argument with a snowman. He lost his cool and had a meltdown",
    ""
    
];
        let dadjoke = rdm[Math.floor(Math.random() * rdm.length)];
        message.channel.send(`${dadjoke}`)   
        console.log(`${currentDate}`)
        console.log("command executed - dadjoke")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}