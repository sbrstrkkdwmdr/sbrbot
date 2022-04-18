function findHCF(x, y) {
    if(isNaN(x, y)) return NaN;
                    
    while (Math.max(x, y) % Math.min(x, y) != 0) {
       if (x > y) {
          x %= y;
       }
       else {
          y %= x;
       }
    }
    return Math.min(x, y);
}
function findLCM (n1, n2) {
    if(isNaN(n1, n2)) return NaN;
    let lar = Math.max(n1, n2);
    let small = Math.min(n1, n2);
    
    
    let i = lar;
    while(i % small !== 0){
      i += lar;
    }
    
    
    return i;
  }
function pythag (a,b){
    if(isNaN(a,b)) return NaN;
    let cp = (a**2)+(b**2);
    c = Math.sqrt(cp)
    return(c)
}
function sigfig (a, b){
    if(isNaN(a)) return NaN;
    let s = a/(10**(a.toString().length - 1))
    if(parseInt(b)){
      s = (a/(10**(a.toString().length - 1))).toFixed(parseInt(b))
    }
    let c = s + ' x 10^' + (a.toString().length - 1)
    return c;
}
module.exports = { findHCF, findLCM, pythag, sigfig }