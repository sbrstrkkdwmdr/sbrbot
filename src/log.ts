function commandLog(commandname: string, baseCommandType: string, absoluteID: number, commanduser) {
    const currentDate = new Date();
    return `
----------------------------------------------------
COMMAND EVENT - ${commandname} (${baseCommandType})
${currentDate} | ${currentDate.toISOString()}
recieved COMMANDNAME command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`;
}
function optsLog(absoluteID: number, options) {
    let firstlog = `
----------------------------------------------------
cmd ID: ${absoluteID}
Options: `
    let optslog = ''
    for (let i = 0; i < options.length; i++) {
        optslog += `${options[i].name}: ${options[i].value}
`
    }
    if (options.length < 1) {
        optslog = '\nNo options provided'
    }
    firstlog += optslog
    firstlog += `\n----------------------------------------------------`
    return firstlog;
}

export { commandLog, optsLog };

