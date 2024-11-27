export function jankenConvert(str: string) {
    let out = 'INVALID';
    switch (str) {
        case 'paper': case 'p': case '✂': case 'パー':
            out = 'paper';
            break;
        case 'scissors': case 's': case '📃': case 'チョキ':
            out = 'scissors';
            break;
        case 'rock': case 'r': case '🪨': case 'グー':
            out = 'rock';
            break;
    }
    return out;
}