function generateCommands() {
    let gencmddiv = document.getElementById('generalcmd');
    let osucmddiv = document.getElementById('osucmd');
    let misccmddiv = document.getElementById('misccmd');
    let admincmddiv = document.getElementById('admincmd');

    for (let i = 0; i < generalcommands.length; i++) {
        let cmd = generalcommands[i];
        let cmddiv = document.createElement('div');
        cmddiv.classList.add('command');
        cmddiv.innerHTML =
            `
        
        <details>
        <summary class="divCommandName" id="osu-${cmd.name}">${cmd.name}</summary>
        <div class="divCommandDetails">
        <p>${cmd.description}
        </p>

        <pre>
        Command: sbr-${cmd.usage}
  Slash Command: /${cmd.slashusage}
       ${cmd.examples.length > 0 ?
                `\nExamples: \n` + cmd.examples.join(
                    `                \n`) :
                ''}
        </pre>

        ${cmd.options.length > 0 ?
                `<br><br>Options:
        <table>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Required</th>
            <th>Description</th>
            <th>Options</th>
            <th>Default Value</th>
        </tr>

        ${cmd.options ?
                    cmd.options.map(option => {
                        return `
                <tr>
                    <td>${option.name}</td>
                    <td>${option.type}</td>
                    <td>${option.required}</td>
                    <td>${option.description}</td>
                    <td>${option.options ? option.options.join(', ') : ''}</td>
                    <td>${option.defaultValue}</td>
                </tr>
                `
                    }).join('') : ''}
        </table>` : ''
            }
        </div>


        </details>
        </div>
        `

        gencmddiv.appendChild(cmddiv);
    }

    for (let i = 0; i < osucommands.length; i++) {
        let cmd = osucommands[i];
        let cmddiv = document.createElement('div');
        cmddiv.classList.add('command');
        cmddiv.innerHTML =
            `
        
        <details>
        <summary class="divCommandName" id="osu-${cmd.name}">${cmd.name}</summary>
        <div class="divCommandDetails">
        <p>${cmd.description}
        </p>

        <pre>
        Command: ${cmd.usage}
  Slash Command: ${cmd.slashusage}
       ${cmd.examples.length > 0 ?
                `\nExamples: \n` + cmd.examples.join(
                    `                \n`) :
                ''}
        </pre>

        ${cmd.options.length > 0 ?
                `<br><br>Options:
        <table>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Required</th>
            <th>Description</th>
            <th>Options</th>
            <th>Default Value</th>
        </tr>

        ${cmd.options ?
                    cmd.options.map(option => {
                        return `
                <tr>
                    <td>${option.name}</td>
                    <td>${option.type}</td>
                    <td>${option.required}</td>
                    <td>${option.description}</td>
                    <td>${option.options ? option.options.join(', ') : ''}</td>
                    <td>${option.defaultValue}</td>
                </tr>
                `
                    }).join('') : ''}
        </table>` : ''
            }
        </div>


        </details>
        </div>
        `
        osucmddiv.appendChild(cmddiv);
    }

    for (let i = 0; i < misccommands.length; i++) {
        let cmd = misccommands[i];
        let cmddiv = document.createElement('div');
        cmddiv.classList.add('command');
        cmddiv.innerHTML =
            `
        
        <details>
        <summary class="divCommandName" id="osu-${cmd.name}">${cmd.name}</summary>
        <div class="divCommandDetails">
        <p>${cmd.description}
        </p>

        <pre>
        Command: ${cmd.usage}
  Slash Command: ${cmd.slashusage}
       ${cmd.examples.length > 0 ?
                `\nExamples: \n` + cmd.examples.join(
                    `                \n`) :
                ''}
        </pre>

        ${cmd.options.length > 0 ?
                `<br><br>Options:
        <table>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Required</th>
            <th>Description</th>
            <th>Options</th>
            <th>Default Value</th>
        </tr>

        ${cmd.options ?
                    cmd.options.map(option => {
                        return `
                <tr>
                    <td>${option.name}</td>
                    <td>${option.type}</td>
                    <td>${option.required}</td>
                    <td>${option.description}</td>
                    <td>${option.options ? option.options.join(', ') : ''}</td>
                    <td>${option.defaultValue}</td>
                </tr>
                `
                    }).join('') : ''}
        </table>` : ''
            }
        </div>


        </details>
        </div>
        `
        misccmddiv.appendChild(cmddiv);
    }

    for (let i = 0; i < admincommands.length; i++) {
        let cmd = admincommands[i];
        let cmddiv = document.createElement('div');
        cmddiv.classList.add('command');
        cmddiv.innerHTML =
            `
        
        <details>
        <summary class="divCommandName" id="osu-${cmd.name}">${cmd.name}</summary>
        <div class="divCommandDetails">
        <p>${cmd.description}
        </p>

        <pre>
        Command: ${cmd.usage}
  Slash Command: ${cmd.slashusage}
       ${cmd.examples.length > 0 ?
                `\nExamples: \n` + cmd.examples.join(
                    `                \n`) :
                ''}
        </pre>

        ${cmd.options.length > 0 ?
                `<br><br>Options:
        <table>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Required</th>
            <th>Description</th>
            <th>Options</th>
            <th>Default Value</th>
        </tr>

        ${cmd.options ?
                    cmd.options.map(option => {
                        return `
                <tr>
                    <td>${option.name}</td>
                    <td>${option.type}</td>
                    <td>${option.required}</td>
                    <td>${option.description}</td>
                    <td>${option.options ? option.options.join(', ') : ''}</td>
                    <td>${option.defaultValue}</td>
                </tr>
                `
                    }).join('') : ''}
        </table>` : ''
            }
        </div>


        </details>
        </div>
        `
        admincmddiv.appendChild(cmddiv);
    }
}
generateCommands();