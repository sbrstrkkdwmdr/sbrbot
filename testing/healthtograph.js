const ChartJsImage = require('chartjs-to-image');
lifebar = "3855|1,5907|1,8118|1,10328|1,12349|1,14400|1,16644|1,18648|1,21065|0.99,23276|1,35324|1,37644|1,39698|1,41907|1,43960|1,46004|1,48223|1,50273|1,52311|1,54539|1,56749|1,58960|1,60971|1,63065|1,65100|1,67170|1,69208|0.98,71592|1,73644|1,75697|1,77907|1,80118|1,82148|1,84223|0,84539|0,"

lifebar2 = (lifebar.replaceAll('|', ' ')).split(/ +/)
//console.log(lifebar2)
lifebarFULL1 = ''
for(i = 1; i<lifebar2.length; i++){
    text = lifebar2[i]
    lifebarFULL1 += text.substring(0, text.indexOf(',')) + " "
}
lifebarFULL = lifebarFULL1.split(/ +/).map(function(item) {
    return parseInt(item, 10);
});
console.log(lifebarFULL)
const chart = new ChartJsImage();
                chart.setConfig({
                    type: 'line',
                    data: {
                        //labels: ['Health'],
                    datasets: [{
                      label: 'Health',
                      data: lifebarFULL,
                      fill: false,
                      borderColor: 'rgb(75, 192, 192)',
                    }],
                    },
                  });

                //for some reason min and max values are ignored  
                chart.toFile('./files/penis.png').then( w => {

                })