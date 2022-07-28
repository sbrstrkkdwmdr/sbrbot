/* let lifebar = ('1252|1,3527|1,6001|1,8034|1,10276|1,12371|1,14627|1,16721|1,18856|1,20889|0.97,23026|1,25128|0.97,27377|1,29480|1,31566|0.93,33976|1,36376|1,38626|0.87,40651|0.78,42695|0.99,42991|1,')
.split('|')

let lifebarF:any[] = []
//split per | but only keep the first part
for (let i = 0; i < lifebar.length; i++) {
    lifebarF.push(lifebar[i].split(',')[0])
}
lifebarF.shift()
console.log(lifebarF) */