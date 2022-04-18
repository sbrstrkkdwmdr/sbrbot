function getStackTrace () {

    var stack;
  
    try {
      throw new Error('');
    }
    catch (error) {
      stack = error.stack || '';
    }
  
    stack = stack.split('\n').map(function (line) { return line.trim(); });
    return stack.splice(stack[0] == 'Error' ? 2 : 1);
  }
module.exports = { getStackTrace }