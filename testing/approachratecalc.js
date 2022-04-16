function doubletime(ar){
let ms;

if (ar > 5) {
    ms = 200 + (11 - ar) * 100;
}
else {
    ms = 800 + (5 - ar) * 80;
}

if (ms < 300) {
    newAR = 11
}
else if (ms < 1200) {
    newAR = Math.round((11 - (ms - 300) / 150) * 100) / 100;
}
else {
    newAR = Math.round((5 - (ms - 1200) / 120) * 100) / 100;
}
return newAR;
}
//^above function is copied from someone else
function halftime(ar){
    let ms;
    if(ar>5){
        ogtoms = 1200 - (((ar-5)*10) * 15)
    }
    else{
        ogtoms = 1800 - (((ar)*10) * 12)
    }
    ms = ogtoms * (4/3);
    //ms = (800 - (5 - ar) * 80) / 2; < works for AR10 only
    
    if (ms < 300) {
        newAR = 11
    }
    else if (ms < 1200) {
        newAR = Math.round((11 - (ms - 300) / 150) * 100) / 100;
    }
    else {
        newAR = Math.round((5 - (ms - 1200) / 120) * 100) / 100;
    }
    /*
    console.log(newAR);
    console.log(ms)
    console.log(ogtoms)*/
    return newAR
    }
    //800+(5*80)