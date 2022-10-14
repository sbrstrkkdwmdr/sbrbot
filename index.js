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
        <summary class="divCommandName" id="general-${cmd.name}">${cmd.name}</summary>
        <div class="divCommandDetails">
        <p>${cmd.description}
        </p>

        <pre>
        <div>Command:</div> <div class="codeblock">sbr-${cmd.usage}</div>
                            <div class="codeblock">/${cmd.slashusage}</div>
        ${cmd.examples.length > 0 ?
                `\nExamples: \n` +
                `<table class="cmdexample">
                                <tr>
                                <th> </th>
                                <th> </th>
                                </tr>
                                
                                ` +
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
        <div>Command:</div> <div class="codeblock">sbr-${cmd.usage}</div>
                            <div class="codeblock">/${cmd.slashusage}</div>
       ${cmd.examples.length > 0 ?
                `\nExamples: \n` +
                `<table class="cmdexample">
                <tr>
                <th> </th>
                <th> </th>
                </tr>
                
                ` +
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
        <summary class="divCommandName" id="misc-${cmd.name}">${cmd.name}</summary>
        <div class="divCommandDetails">
        <p>${cmd.description}
        </p>

        <pre>
        <div>Command:</div> <div class="codeblock">sbr-${cmd.usage}</div>
                            <div class="codeblock">/${cmd.slashusage}</div>
        ${cmd.examples.length > 0 ?
                `\nExamples: \n` +
                `<table class="cmdexample">
                                <tr>
                                <th> </th>
                                <th> </th>
                                </tr>
                                
                                ` +
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
        <summary class="divCommandName" id="admin-${cmd.name}">${cmd.name}</summary>
        <div class="divCommandDetails">
        <p>${cmd.description}
        </p>

        <pre>
        <div>Command:</div> <div class="codeblock">sbr-${cmd.usage}</div>
                            <div class="codeblock">/${cmd.slashusage}</div>
        ${cmd.examples.length > 0 ?
                `\nExamples: \n` +
                `<table class="cmdexample">
                                <tr>
                                <th> </th>
                                <th> </th>
                                </tr>
                                
                                ` +
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
