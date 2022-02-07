const ChartJsImage = require('chartjs-to-image');

// Generate the chart
const chart = new ChartJsImage();
chart.setConfig({
  type: 'bar',
  data: { labels: ['Hello world', 'Foo bar'], datasets: [{ label: 'Foo', data: [1, 2] }] },
});

// Save it
chart.toFile('./tmp/mychart.png');