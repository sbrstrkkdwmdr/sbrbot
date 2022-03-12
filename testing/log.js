const { LoggerAdaptToConsole } = require('console-log-json')
LoggerAdaptToConsole();
CONSOLE_LOG_JSON_NO_FILE_NAME="true" 
CONSOLE_LOG_JSON_NO_PACKAGE_NAME="true" 
var pp = 2
console.log('w', pp)
console.error('ee', "hello", pp)

//console.warn('hey')
for (var i=0; i<5; i++) {
    console.log("Hello, %s. You've called me %d times.", "Bob", i+1);
  }