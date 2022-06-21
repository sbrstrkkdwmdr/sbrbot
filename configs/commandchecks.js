const fs = require('fs')
//if user id is owner
const owners = require('./config.json').ownerusers

/**
 * 
 * @param {integer} userid 
 * @returns whether or not the user id is an owner
 */
function isOwner(userid){
    for(let i = 0; i < owners.length; i++){
        if(owners[i] == userid){
            return true
        }
    }
    return false
}
function exec(cmd, handler = function (error, stdout, stderr) { console.log(stdout); if (error !== null) { console.log(stderr) } }) {
    const childfork = require('child_process');
    return childfork.exec(cmd, handler);
}
module.exports = { isOwner, exec }