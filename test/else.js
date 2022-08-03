/**
 * 
 * @param {*} str string
 * @returns x
 */
function toAlphaNum(str){
    let newstr;
    newstr = str.replace(/([^A-Za-z 0-9])/g, '')
    return newstr;
}
console.log(toAlphaNum('owo no im from the me..---'))