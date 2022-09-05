function commandLog(commandname: string, baseCommandType: string, absoluteID: number, commanduser) {
    const currentDate = new Date();
    return `
----------------------------------------------------
COMMAND EVENT - ${commandname} (${baseCommandType})
${currentDate} | ${currentDate.toISOString()}
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`;
}
function optsLog(absoluteID: number, options: { name: string, value: string }[]) {
    const currentDate = new Date();
    let firstlog = `
----------------------------------------------------
${currentDate} | ${currentDate.toISOString()}
cmd ID: ${absoluteID}
Options: \n`;
    let optslog = ''
    for (let i = 0; i < options.length; i++) {
        optslog += `${options[i].name}: ${options[i].value}\n`
    }
    if (options.length < 1) {
        optslog = '\nNo options provided'
    }
    firstlog += optslog
    firstlog += `\n----------------------------------------------------`
    return firstlog;
}

export { commandLog, optsLog };

