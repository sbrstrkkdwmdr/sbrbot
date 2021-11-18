module.exports = {
    name: 'madhav is gay',
    description: 'like, very very very gay',
    execute(message, args){
/*        let rdm = ["TRUTHQ", "DAREQ"]
        let TRUTHQ = ["thing1", "thing2"]
        let DAREQ = ["thing1", "thing2"]
        let bb = [Math.floor(Math.random() * rdm.length)]
        if(bb == TRUTHQ){
            let a = [Math.floor(Math.random() * TRUTHQ.length)]
            message.channel.send(a)
        }
        if(bb == DAREQ){
            let a = [Math.floor(Math.random() * DAREQ.length)]
            messagre.channel.send(a)
        }*/
        let TRUTHQ = ["on a scale of 1-10, what is your favourite colour of the alphabet", "ERROR CANNOT THINK OF TRUTH", 
        "who do you have a crush on?", "are you a lolicon", 
        "have you understood it's content, grasped it's wisdom, and implemented it?", "favourite colour?", ""]
        //
        let DAREQ = ["lick a shoe or sock", "ERROR CANNOT THINK OF DARE", 
        "get a nohit run on 15 in touhou legacy of lunatic kingdom no point device mode", 
        "pass the big black", "get 500 passes on harumachi clover [fiery's extreme] +EZ",
        "win a halo infinite match using only plasma pistol (no bot matches and no vehicles)", 
        "make a discord bot that gives random hentai (nhentai)", 
        "speak in only (preferred second language) for 12 hours. loan words (like カメラ) are allowed"]
        //
        if(args[0] == TRUTHQ){
            let a = [Math.floor(Math.random() * TRUTHQ.length)]
            message.channel.send(a)
        }
        if(args[0] == DAREQ){
            let a = [Math.floor(Math.random() * DAREQ.length)]
            message.channel.send(a)
        }
        }
}