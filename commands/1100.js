module.exports = {
    name: '1100',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        if(message.author.id == '503794887318044675'){
          message.delete();
          message.channel.send("1\n2\n3\n4\n5\n6\n8\n9\n10")
          message.channel.send("11\n12\n13\n14\n15\n16\n17\n18\n19\n20")
          message.channel.send("21\n22\n23\n24\n25\n26\n27\n28\n29\n30")
          message.channel.send("31\n32\n33\n34\n35\n36\n27\n38\n39\n40")
          message.channel.send("41\n42\n43\n44\n45\n46\n47\n48\n49\n50")
          message.channel.send("51\n52\n53\n54\n55\n56\n57\n58\n59\n60")
          message.channel.send("61\n62\n63\n64\n65\n66\n67\n68\n69\n70")
          message.channel.send("71\n72\n73\n74\n75\n76\n77\n78\n79\n80")
          message.channel.send("81\n82\n83\n84\n85\n86\n87\n88\n89\n90")
          message.channel.send("91\n92\n93\n94\n95\n96\n97\n98\n99\n100")
          console.group('--- COMMAND EXECUTION ---')
          console.log(`${currentDateISO} | ${currentDate}`)
          console.log("command executed - 1100")
          let consoleloguserweeee = message.author
          console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
          console.log("")
          console.groupEnd()
          }
  
          else {
            message.channel.send("no")
            console.group('--- COMMAND EXECUTION ---')
            console.log(`${currentDate}`)
            console.log("command executed - 1100")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("command failed - insufficient permissions")
            console.log("")
            console.groupEnd()
          }  
    }
}
//client.commands.get('').execute(message, args)