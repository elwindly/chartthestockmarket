var seriesOptions = [];
var symbolNames = [];

function createChart(seriesOptions) {
    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 4
        },

        yAxis: {
            labels: {
                formatter: function () {
                    return (this.value > 0 ? ' + ' : '') + this.value + '%';
                }
            },
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
        },

        plotOptions: {
            series: {
                compare: 'percent',
                showInNavigator: true
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            valueDecimals: 2,
            split: true
        },

        series: seriesOptions
    });
}
function createStockPanel(stock) {
    let stocks = jQuery('#stocks');
    let html = `<div id="${stock}" class="alert info">`;
    html += `<span class="pull-right closebtn">&times;</span>`;  
    html += `<strong>${stock}</strong>`;
    html += `</div>`; 
    stocks.append(html);
}
function getData (err, symbols) {      
        var counter = 0;
        seriesOptions = [];
        $.getJSON(baseUrl + '/stocks',{ symbols: symbols, }, function (data) {
            $.each( data, function( name, quoteDatas ) {
                createStockPanel(name) ;
                var quoteData = quoteDatas.map((elem)=>{
                   return [Date.parse(elem.date), elem.adjClose];
                 });
                 quoteData.sort(function(a, b) {
                    return a[0] - b[0];
                 });
                 symbolNames.push(name);
                seriesOptions[counter] = {
                    name: name,
                    data: quoteData
                };
                counter++;
            });
            if (symbols.length === counter) {
                createChart(seriesOptions); 
            }
                    
        });
}