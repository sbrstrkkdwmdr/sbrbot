import * as helpinfo from './helpinfo.js';

/**
 *         {
            category: "category",
            subTitle: "subTitle",
            categoryId: "category-id", // No spaces or special characters
            image: "<img src='link to image'>",
            hideAlias: false, // Optional - Default: false - Hides the alias from all commands in the category
            hideDescription: false, // Optional - Default: false - Hides the description from all commands in the category
            hideSidebarItem: false, // Optional - Default: false - Hides the category from the sidebar
            list: [
                {
                    commandName: "cmdname",
                    commandUsage: "usage",
                    commandDescription: "Command description",
                    commandAlias: "alias"
                }
            ]
        }
 */
type cmdDbd = {
    category: string;
    subTitle: string;
    categoryId: string;
    image: string;
    hideAlias: boolean;
    hideDescription: boolean;
    hideSidebarItem: boolean;
    list: [{
        commandName: string;
        commandUsage: string;
        commandDescription: string;
        commandAlias: string;
    }];
};
const cmds: {
    category: string;
    subTitle: string;
    categoryId: string;
    image: string;
    hideAlias: boolean;
    hideDescription: boolean;
    hideSidebarItem: boolean;
    list: [{
        commandName: string;
        commandUsage: string;
        commandDescription: string;
        commandAlias: string;
    }];
}[] = [];

function toDBD(category: helpinfo.commandInfo[],
    info: {
        category: string;
        subTitle: string;
        categoryId: string;
        image: string;
    }) {
    const list: {
        commandName: string;
        commandUsage: string;
        commandDescription: string;
        commandAlias: string;
    }[] = [];
    for (const command of category) {
        list.push({
            commandName: command.name,
            commandUsage: command.usage,
            commandAlias: command.aliases.join(', '),
            commandDescription: command.description
        });
    }
    return {
        category: info.category,
        subTitle: info.subTitle,
        categoryId: info.categoryId,
        image: info.image,
        hideAlias: false,
        hideDescription: false,
        hideSidebarItem: false,
        list
    } as cmdDbd;
}

cmds.push(
    toDBD(helpinfo.cmds,
        {
            category: 'General',
            categoryId: '01',
            subTitle: 'General help-related commands',
            image: null
        }
    )
);
cmds.push(
    toDBD(helpinfo.osucmds,
        {
            category: 'osu!',
            categoryId: '02',
            subTitle: 'osu! related commands',
            image: null
        }
    ));
cmds.push(
    toDBD(helpinfo.othercmds,
        {
            category: 'Miscellaneous',
            categoryId: '03',
            subTitle: 'Miscellaneous commands',
            image: null
        }
    ));
cmds.push(toDBD(helpinfo.admincmds,
    {
        category: 'Admin',
        categoryId: '04',
        subTitle: 'Admin related commands',
        image: null
    }
));

export const exCmds = cmds as [cmdDbd]
