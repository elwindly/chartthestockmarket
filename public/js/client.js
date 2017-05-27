var baseUrl = location.origin;


$(document).ready(function(){

    var socket = io();

    socket.on('connect', function(){
        console.log('Hello');
        ajaxRequest(`${baseUrl}/stockList`, 'GET', {}, getData);
    });

    socket.on('disconnect',function(){
        console.log('Bye');
    });

    socket.on('add', function(stocks){
        console.log('added');
        symbolNames.push(stocks.stock);
        createStockPanel(stocks.stock)
        ajaxRequest(`${baseUrl}/stock`, 'GET', {stock: stocks.stock}, function(err, data) {
            seriesOptions.push(data);
            createChart(seriesOptions);
        });
    });

    socket.on('delete', function(stocks){
        let id = `#${stocks.stock}`;
        $(id).remove();
        seriesOptions.splice(symbolNames.indexOf(stocks.stock), 1);
        symbolNames.splice(symbolNames.indexOf(stocks.stock), 1);
        createChart(seriesOptions);
    });


///// Send request to the server
    //send delete request to the server
    jQuery('#stocks').on('click', 'span', function(e){
        let stockId = $(this).parent().attr("id");
        socket.emit('deleteSymbol', {stock:stockId});
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