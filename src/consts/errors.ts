
export function noUser(name: string) {
    return `Error - could not find user "${name}"`;
}

export const genError = `Bot skill issue - something went wrong.`;

export const apiError = `Something went wrong with the osu! api.`;

export const osuTrackApiError = `Something went wrong with the osu!track api.`;

export function anyError() {
    const errs = [
        'Bot is having a skill issue lol.',
        'Error - AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        'Error - something went wrong.',
        'Error - ????????!?!??!',
    ];

    return errs[Math.floor(Math.random() * errs.length)];
}