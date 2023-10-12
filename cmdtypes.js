function conv() {
    const dat = [];
    for (const key in conversionData) {
        let cat = key.split('_')[0];
        let display = conversionData[key][0];
        if (conversionData[key][1] && conversionData[key][1] != null) {
            display += ` (${conversionData[key][1]})`
        }
        dat.push({ id: key, cat, display })
    }
    for (const elem of dat) {
        const tempData = document.getElementById("conv_" + elem.cat);
        tempData.innerHTML += elem.display + ', ';
    }
}

conv();