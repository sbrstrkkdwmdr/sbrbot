let str = '"among us" -mods'

var name =  str.substring(
  str.indexOf('"') + 1, 
  str.lastIndexOf('"')
);
console.log(name)