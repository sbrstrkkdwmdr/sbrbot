const ChartJsImage = require('chartjs-to-image');

// Generate the chart
const chart = new ChartJsImage();
chart.setConfig({
    type: 'line',
    data: {
        datasets: [{
            label: 'First dataset',
            data: [0, 20, 40, 50]
        }],
        labels: ['January', 'February', 'March', 'April']
    },
    options: {
        scales: {
            yAxes: {
                min: 50,
                max: 100
            }
        }
    }
});

// Save it
chart.toFile('./tmp/mychart.png');
/*
let chart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'First dataset',
            data: [0, 20, 40, 50]
        }],
        labels: ['January', 'February', 'March', 'April']
    },
    options: {
        scales: {
            y: {
                suggestedMin: 50,
                suggestedMax: 100
            }
        }
    }
});*/
