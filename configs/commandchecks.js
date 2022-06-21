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
module.exports = { isOwner }