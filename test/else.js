

let timestr1 = '1h 5m3s';

let timestr2 = '33.065';

function timeToMs(str) {
    if (str.includes('d') || str.includes('h') || str.includes('m') || str.includes('s')) {
        let daysstr = '0'
        let hoursstr = '0'
        let minutesstr = '0'
        let secondsstr = '0'

        if (str.includes('d')) {
            daysstr = str.split('d')[0];
            if (str.includes('h')) {
                hoursstr = str.split('d')[1].split('h')[0];
                if (str.includes('m')) {
                    minutesstr = str.split('d')[1].split('h')[1].split('m')[0];
                }
                if (str.includes('s')) {
                    secondsstr = str.split('d')[1].split('h')[1].split('m')[1].split('s')[0];
                }
            }
            if (str.includes('m') && !str.includes('h')) {
                minutesstr = str.split('d')[1].split('m')[0];
                if (str.includes('s')) {
                    secondsstr = str.split('d')[1].split('m')[1].split('s')[0];
                }
            }
            if (str.includes('s') && !str.includes('m') && !str.includes('h')) {
                secondsstr = str.split('d')[1].split('s')[0];
            }
        }
        if (str.includes('h') && !str.includes('d')) {
            hoursstr = str.split('h')[0];
            if (str.includes('m')) {
                minutesstr = str.split('h')[1].split('m')[0];
                if (str.includes('s')) {
                    secondsstr = str.split('h')[1].split('m')[1].split('s')[0];
                }
            }
            if (str.includes('s') && !str.includes('m')) {
                secondsstr = str.split('h')[1].split('s')[0];
            }
        }
        if (str.includes('m') && !str.includes('h') && !str.includes('d')) {
            minutesstr = str.split('m')[0];
            if (str.includes('s')) {
                secondsstr = str.split('m')[1].split('s')[0];
            }
        }
        if (str.includes('s') && !str.includes('m') && !str.includes('h') && !str.includes('d')) {
            secondsstr = str.split('s')[0];
        }


        let days = parseInt(daysstr);
        let hours = parseInt(hoursstr);
        let minutes = parseInt(minutesstr);
        let seconds = parseInt(secondsstr);
        //convert to milliseconds
        let ms = (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);

        return ms;
    } else if (str.includes(':') || str.includes('.')) {
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        let milliseconds = 0;
        let coloncount = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === ':') {
                coloncount++;
            }
        }
        if (coloncount === 2) {
            hours = parseInt(str.split(':')[0]);
            minutes = parseInt(str.split(':')[1]);
            seconds = parseInt(str.split(':')[2]);
        }
        if (coloncount === 1) {
            minutes = parseInt(str.split(':')[0]);
            seconds = parseInt(str.split(':')[1]);
        }
        if (str.includes('.')) {
            milliseconds = parseInt(str.split('.')[1]);
            if(coloncount === 0){
                seconds = parseInt(str.split('.')[0]);
            }
        }
        let ms = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
        return ms;

    } else {
        return NaN;
    }
}

console.log(timeToMs(timestr1))
console.log(timeToMs(timestr2))