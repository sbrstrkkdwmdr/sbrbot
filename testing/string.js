let str = 'wee "among us" -mods'

var name =  str.substring(
  str.indexOf('"') + 1, 
  str.lastIndexOf('"')
);
console.log(name)
var name2 =  str.substring(
  str.indexOf('"') + 1, 
  str.lastIndexOf('')
);
console.log(name2)