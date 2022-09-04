function commandLog(commandname: string, baseCommandType: string, absoluteID, commanduser) {
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
function optsLog(absoluteID, options) {
    let firstlog = `
----------------------------------------------------
cmd ID: ${absoluteID}
Options: `
    for (let i = 0; i < options.length; i++) {
        firstlog += `${options[i].name}: ${options[i].value}
`
    }
    firstlog += `\n----------------------------------------------------`
    return firstlog;
}

export { commandLog, optsLog };

