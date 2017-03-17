var baseUrl = location.origin;
var seriesOptions = [];
var seriesCounter = 0;

/**
 * Create the chart when all data is loaded
 * @returns {undefined}
 */
function createChart() {
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
    let html = `<div id="${stock}" class="panel panel-default">`;
    html += `<span class="pull-right ${stock}">X</span>`;
    html += `<div class="panel-body">${stock}</div>`;
    html += `</div>`;
   // jQuery(`#${stock}`).on('click',handleClick(`${stock}`));
   
    stocks.append(html);
}
function getData (symbols) {
    $.each(symbols, function (i, name) {
        createStockPanel(name) ;
        $.getJSON(baseUrl + '/stock/' + name.toLowerCase(), function (data) {
            //console.log(JSON.stringify(data,'',2));
            seriesOptions[i] = {
                name: name,
                data: data
            };
            // As we're loading the data asynchronously, we don't know what order it will arrive. So
            // we keep a counter and create the chart when all the data is loaded.
            seriesCounter += 1;

            if (seriesCounter === symbols.length) {
                createChart();
            }
        });
    });
}

$(document).ready(function(){

    var socket = io();

    socket.on('connect', function(){
        console.log('Hello');
    });

    socket.on('disconnect',function(){
        console.log('Bye');
    });

    socket.on('add', function(stocks){
        console.log('added');
        var stock = stocks.stock;
        pollOptions.push(stock);
        createStockPanel(stock);
        seriesCounter++;
        $.getJSON(baseUrl + '/stock/' + stock.toLowerCase(), function (data) {
                seriesOptions[seriesOptions.length] = {
                    name: stock,
                    data: data
                };
                createChart();
            });
    });

    socket.on('delete', function(stocks){
        let id = '#' +stocks.stock;
        jQuery(id).remove();
        var pos = pollOptions.indexOf(stocks.stock);
        pollOptions.splice(pos,1);
        seriesOptions.splice(pos,1);
        seriesCounter--;
        createChart();

    });
    function handleClick(stock) {
        socket.emit('deleteSymbol',{
            stock:stock
        },function(){

        });
    }

    jQuery('#stocks').on('click', 'span', function(e){
        let classList = $(this).attr('class').split(' ');
        let classToDelete = classList[1];
        socket.emit('deleteSymbol', {stock:classToDelete})
    });


    //send new symbol to the server
    jQuery('#stockForm').on('submit',function(e){
        e.preventDefault();
        var stock = jQuery('#stock').val();
        if(stock === "") { 
            return alert('Provide a Symbol!');
        }
        let id = '#' + stock;;
        if (jQuery(id).length > 0 ) { return alert('This symbol already exists!'); }
        socket.emit('addSymbol',{
            stock:stock
        },function(){
            jQuery('#stock').val('');
        });
        jQuery('#stock').val('');
        
    });
});




























// var x = location.origin;
// console.log(x);
// console.log(`${x}/api/getPools`);
// fetch(`${x}/api/getPools`)
//   .then((res)=>{
//     //console.log(JSON.stringify(result,'',2));
//     return res.json();
//   })
//   .then((polls)=>{
//       console.log(polls);
//   })
//   .catch((err)=>{
//     console.log(err);
//   });