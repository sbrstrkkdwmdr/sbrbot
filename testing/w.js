let args = ['your', 'mum', '"among', 'us"']
let strtest = args.splice(0,1000).join(" ");
let str = strtest.toString()
let other = 'among us'

if(str.includes('"')){
            let str1 = str.indexOf('"') + 1
            let str2 = str.lastIndexOf('"')
            pickeduserX = str.substring(
                str1, str2
            )
        }
       /* if(!args.includes('"')){
        pickeduserX = str//.splice(0,1000).join(" "); //if it was just args 0 it would only take the first argument, so spaced usernames like "my angel lumine" wouldn't work
        }*/
        console.log(pickeduserX)
        //console.log(strtest)
        //console.log(str)

const arrayOfStrings = ['abc', 'def', 'xyz'];
const str1 = 'abc';
const found = arrayOfStrings.find(v => (str1 === v));
console.log(found)