function generateCommands() {
    let gencmddiv = document.getElementById('generalcmd');
    let osucmddiv = document.getElementById('osucmd');
    let misccmddiv = document.getElementById('misccmd');
    let admincmddiv = document.getElementById('admincmd');
    let buttondiv = document.getElementById('buttondiv');

    toList(generalcommands, gencmddiv, 'generalcmd');
    toList(osucommands, osucmddiv, 'osucmd');
    toList(misccommands, misccmddiv, 'misccmd');
    toList(admincommands, admincmddiv, 'admincmd');
    toListButtons(buttons, buttondiv, 'buttons');

    function arrToAscii(string) {
        return string.replaceAll('<', '&lt').replaceAll('>', '&gt');
    }

    function toList(commands, div, name) {
        // console.log('Generating command list for ' + name ?? 'null name');
        for (let i = 0; i < commands.length; i++) {
            let cmd = commands[i];
            let cmddiv = document.createElement('div');
            cmddiv.classList.add('command');
            cmddiv.innerHTML =
                `
        
        <details>
        <summary class="divCommandName" id="${name}-${cmd.name}">${cmd.name}</summary>
        <div class="divCommandDetails">
        <p>${cmd.description.includes('http') ?
                    urlToHTML(cmd.description) : cmd.description}
        </p>
    
        <pre>
        <div>Command:</div>
<div class="codeblock">sbr-${arrToAscii(cmd.usage)}</div>
${cmd?.slashusage ? `<div class="codeblock">/${arrToAscii(cmd.slashusage)}</div>` : ''}
${cmd?.linkusage && cmd.linkusage.length > 0 ?
                    cmd.linkusage.map(x => `<div class="codeblock">${arrToAscii(x)}</div>`).join('\n') :
                    ''}
    
        ${cmd.aliases.length > 0 ? `<div>Aliases:</div> ${cmd.aliases.map(x => `<div class="codeblock">${x}</div>`).join('\n')}` : ''}
    
       ${cmd.examples.length > 0 ?
                    `\nExamples:` +
                    `<table class="cmdexample">` +
                    cmd.examples.map(x =>
                        `<tr>
                    <td class="tdEx"><div class="extxt">${x.text.replace('PREFIXMSG', 'sbr-')}</div></td>
                    <td class="tdEx"><div class="exdesc">${x.descriptor}</div></td>
                    </tr>
                    `

                    ).join(`\n`) + '</table>' :
                    ''}
        </pre>
    
        ${cmd.options.length > 0 ?
                    `<br><br>Options:
        <table class="table">
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Required</th>
            <th>Description</th>
            <th>Options</th>
            <th>Default Value</th>
            <th>Examples</th>
            <th>Command Types</th>
        </tr>
    
        ${cmd.options ?
                        cmd.options.map(option => {
                            let opStr = ''
                            for (const opt of option.options) {
                                if (opt.includes('[') && opt.includes(']') && opt.includes('(') && opt.includes(')')) {
                                    opStr += markdownURLtoHTML(opt) + ', '
                                } else {
                                    opStr += opt + ', '
                                }
                            }
                            let optDesc = ''
                            if (option.description.includes('[') && option.description.includes(']') && option.description.includes('(') && option.description.includes(')')) {
                                optDesc = markdownURLtoHTML(opt) + ', '
                            } else if (option.description.includes('http')) {
                                optDesc = urlToHTML(option.description)
                            } else {
                                optDesc = option.description
                            }


                            return `
                <tr>
                    <td class="tdOpts">${option.name}</td>
                    <td class="tdOpts">${option.type}</td>
                    <td class="tdOpts">${option.required}</td>
                    <td class="tdOpts">${optDesc}</td>
                    <td class="tdOpts">${opStr}</td>
                    <td class="tdOpts">${option.defaultValue}</td>
                    <td class="tdOpts">${option.examples ? option.examples.join('\n') : ''}</td>
                    <td class="tdOpts">${option.commandTypes ? option.commandTypes.join(', ') : ''}</td>
                </tr>
                `
                        }).join('') : ''}
        </table>` : ''
                }
        </div>
    
    
        </details>
        </div>
        `
            div.appendChild(cmddiv);
        }
    }
}

function markdownURLtoHTML(str) {
    const int = str.split('[')[0]
    const fin = str.split(')')[1]
    const namae = str.split('[')[1].split(']')[0]
    const url = str.split('(')[1].split(')')[0]
    return `${int} <a class="minA" href=${url}>${namae}</a> ${fin}`
}

/**
 * 
 * @param {string} str 
 * @returns 
 */
function urlToHTML(str) {
    //split 
    const args = str.split(' ')
    //get index of URL
    let i = 0
    for (null; i < args.length; i++) {
        console.log(args[i])
        if (args[i].includes('http')) break;
    }
    const init = args.slice(0, i-1).join(' ');
    const fin = args.slice(i+1, args.length).join(' ');
    console.log(`${init} <a class="minA" href=${args[i]}>url</a> ${fin}`)
    return `${init} <a class="minA" href=${args[i]}>url</a> ${fin}`
}


function toListButtons(commands, div, name) {
    // console.log('Generating command list for ' + name ?? 'null name');
    for (let i = 0; i < commands.length; i++) {
        let cmd = commands[i];
        let cmddiv = document.createElement('div');
        cmddiv.classList.add('command');
        cmddiv.innerHTML =
            `
<details>
<summary class="divCommandName" id="${name}-${cmd.name}">${cmd.name}</summary>
<div class="divCommandDetails">
<p>${cmd.description}
</p>

${cmd.emoji.length > 0 ? `<img src="${cmd.emoji}" alt="${cmd.name}" style="height:10%;width:10%">` : ''}
</div>
</details>
</div>
`
        //name,desc, emoji
        div.appendChild(cmddiv);
    }
}

generateCommands();

//https://css-tricks.com/how-to-animate-the-details-element/
class smoothOpen {
    constructor(el) {
        this.el = el;
        this.summary = el.querySelector('summary');
        this.content = el.querySelector('.divCommandDetails');

        this.animation = null;
        this.isClosing = false;
        this.isExpanding = false;
        this.summary.addEventListener('click', (e) => this.onClick(e));
    }

    onClick(e) {
        e.preventDefault();
        this.el.style.overflow = 'hidden';
        if (this.isClosing || !this.el.open) {
            this.open();
        } else if (this.isExpanding || this.el.open) {
            this.shrink();
        }

    }

    shrink() {
        this.isClosing = true;

        const startHeight = `${this.el.offsetHeight}px`;
        const endHeight = `${this.summary.offsetHeight}px`;

        if (this.animation) {
            this.animation.cancel();
        }

        this.animation = this.el.animate({
            height: [startHeight, endHeight]
        }, {
            duration: 400,
            easing: 'ease-out'
        });

        this.animation.onfinish = () => this.onAnimationFinish(false);
        this.animation.oncancel = () => this.isClosing = false;
    }

    open() {
        this.el.style.height = `${this.el.offsetHeight}px`;
        this.el.open = true;
        window.requestAnimationFrame(() => this.expand());
    }

    expand() {
        this.isExpanding = true;
        const startHeight = `${this.el.offsetHeight}px`;
        const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

        if (this.animation) {
            this.animation.cancel();
        }

        this.animation = this.el.animate({
            height: [startHeight, endHeight]
        }, {
            duration: 400,
            easing: 'ease-out'
        });
        this.animation.onfinish = () => this.onAnimationFinish(true);
        this.animation.oncancel = () => this.isExpanding = false;
    }

    onAnimationFinish(open) {
        this.el.open = open;
        this.animation = null;
        this.isClosing = false;
        this.isExpanding = false;
        this.el.style.height = this.el.style.overflow = '';
    }
}

document.querySelectorAll('details').forEach((el) => {
    new smoothOpen(el);
});
