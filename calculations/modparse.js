function ModStringToInt(mods) {
    let modInt = 0;

    if (mods.toUpperCase().includes('NF')) {
        modInt += 1
    }
    if (mods.toUpperCase().includes('EZ')) {
        modInt += 2
    }
    if (mods.toUpperCase().includes('TD')) {
        modInt += 4
    }
    if (mods.toUpperCase().includes('HD')) {
        modInt += 8
    }
    if (mods.toUpperCase().includes('HR')) {
        modInt += 16
    }
    if (mods.toUpperCase().includes('SD')) {
        modInt += 32
    }
    if (mods.toUpperCase().includes('DT')) {
        modInt += 64
    }
    if (mods.toUpperCase().includes('RX') || mods.toUpperCase().includes('RL') || mods.toUpperCase().includes('RLX')) {
        modInt += 128
    }
    if (mods.toUpperCase().includes('HT')) {
        modInt += 256
    }
    if (mods.toUpperCase().includes('NC')) {
        modInt += 64//512
    }
    if (mods.toUpperCase().includes('FL')) {
        modInt += 1024
    }
    if (mods.toUpperCase().includes('AT')) {
        modInt += 2048
    }
    if (mods.toUpperCase().includes('SO')) {
        modInt += 4096
    }
    if (mods.toUpperCase().includes('AP')) {
        modInt += 8192
    }
    if (mods.toUpperCase().includes('PF')) {
        modInt += 16384
    }
    if (mods.toUpperCase().includes('1K')) {
        modInt += 67108864
    }
    if (mods.toUpperCase().includes('2K')) {
        modInt += 268435456
    }
    if (mods.toUpperCase().includes('3K')) {
        modInt += 134217728
    }
    if (mods.toUpperCase().includes('4K')) {
        modInt += 32768
    }
    if (mods.toUpperCase().includes('5K')) {
        modInt += 65536
    }
    if (mods.toUpperCase().includes('6K')) {
        modInt += 131072
    }
    if (mods.toUpperCase().includes('7K')) {
        modInt += 262144
    }
    if (mods.toUpperCase().includes('8K')) {
        modInt += 524288
    }
    if (mods.toUpperCase().includes('9K')) {
        modInt += 16777216
    }
    if (mods.toUpperCase().includes('FI')) {
        modInt += 1048576
    }
    if (mods.toUpperCase().includes('RDM')) {
        modInt += 2097152
    }
    if (mods.toUpperCase().includes('CN')) {
        modInt += 4194304
    }
    if (mods.toUpperCase().includes('TP')) {
        modInt += 8388608
    }
    if (mods.toUpperCase().includes('KC')) {
        modInt += 33554432
    }
    if (mods.toUpperCase().includes('SV2') || mods.toUpperCase().includes('S2')) {
        modInt += 536870912
    }
    if (mods.toUpperCase().includes('MR')) {
        modInt += 1073741824
    }
    return modInt;
}

function ModIntToString(modInt) {
    let modString = '';
    if (modInt & 1) {
        modString += 'NF'
    }
    if (modInt & 2) {
        modString += 'EZ'
    }
    if (modInt & 4) {
        modString += 'TD'
    }
    if (modInt & 8) {
        modString += 'HD'
    }
    if (modInt & 16) {
        modString += 'HR'
    }
    if (modInt & 32) {
        modString += 'SD'
    }
    if (modInt & 64) {
        modString += 'DT'
    }
    if (modInt & 128) {
        modString += 'RX'
    }
    if (modInt & 256) {
        modString += 'HT'
    }
    if (modInt & 512) {
        modString += 'NC'
    }
    if (modInt & 1024) {
        modString += 'FL'
    }
    if (modInt & 2048) {
        modString += 'AT'
    }
    if (modInt & 4096) {
        modString += 'SO'
    }
    if (modInt & 8192) {
        modString += 'AP'
    }
    if (modInt & 16384) {
        modString += 'PF'
    }
    if (modInt & 67108864) {
        modString += '1K'
    }

    if (modInt & 268435456) {
        modString += '2K'
    }
    if (modInt & 134217728) {
        modString += '3K'
    }
    if (modInt & 32768) {
        modString += '4K'
    }
    if (modInt & 65536) {
        modString += '5K'
    }
    if (modInt & 131072) {
        modString += '6K'
    }
    if (modInt & 262144) {
        modString += '7K'
    }
    if (modInt & 524288) {
        modString += '8K'
    }
    if (modInt & 16777216) {
        modString += '9K'
    }
    if (modInt & 1048576) {
        modString += 'FI'
    }
    if (modInt & 2097152) {

        modString += 'RDM'
    }
    if (modInt & 4194304) {
        modString += 'CN'
    }
    if (modInt & 8388608) {
        modString += 'TP'
    }
    if (modInt & 33554432) {
        modString += 'KC'
    }
    if (modInt & 536870912) {
        modString += 'SV2'
    }
    if (modInt & 1073741824) {
        modString += 'MR'
    }
    if (modString.includes('DT') && modString.includes('NC')) {
        modString = modString.replace('DT', '')
    }
    if (modString.includes('SD') && modString.includes('PF')) {
        modString = modString.replace('SD', '')
    }

    return modString;
}
function OrderMods(modString) {
    let ModsOrder = ['AT', 'RX', 'AP', 'TP', 'SO', 'EZ', 'HD', 'HT', 'DT', 'NC', 'HR', 'SD', 'PF', 'FL', 'NF']
    let modStringArray = modString.replace(/(.{2})/g, "$1 ").split(' ')
    let modStringArrayOrdered = []
    for (let i = 0; i < ModsOrder.length; i++) {
        for (let j = 0; j < modStringArray.length; j++) {
            if (ModsOrder[i] === modStringArray[j]) {
                modStringArrayOrdered.push(modStringArray[j])
            }
        }
    }
    return modStringArrayOrdered.join('')
}

module.exports = { ModStringToInt, ModIntToString, OrderMods }