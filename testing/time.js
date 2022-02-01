let currentTime = new Date();
let expireTime = new Date('2022-02-01T06:34:50');

let minutes = (expireTime - currentTime) / (1000 * 60);

console.log(minutes);