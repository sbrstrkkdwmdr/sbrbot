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
        <p>${cmd.description}
        </p>
    
        <pre>
        <div>Command:</div> <div class="codeblock">sbr-${arrToAscii(cmd.usage)}</div>
                            <div class="codeblock">/${arrToAscii(cmd.slashusage)}</div>
    
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
                            return `
                <tr>
                    <td class="tdOpts">${option.name}</td>
                    <td class="tdOpts">${option.type}</td>
                    <td class="tdOpts">${option.required}</td>
                    <td class="tdOpts">${option.description}</td>
                    <td class="tdOpts">${option.options ? option.options.join(', ') : ''}</td>
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

<pre>
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
${cmd.imagesrc.length > 0 ? `<img src="${cmd.imagesrc}" alt="${cmd.name}" style="height:10%;width:10%">` : ''}
${cmd.emojisrc.length > 0 ?
                `<p style="font-size:50px">${cmd.emojisrc}</p>` : ''
            }
</div>


</details>
</div>
`
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
