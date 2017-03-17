require('./config/config');

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const hbs = require('hbs')
const {mongoose} = require('./db/mongoose');


const {Stock} = require('./models/stocks');

const index = require('./routes/index');
const port = process.env.PORT || 3000;


var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials')
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);

io.on('connection',(socket)=>{
  
  socket.on('deleteSymbol',(symbol)=>{
    Stock.findOneAndRemove({symbol:symbol.stock}).then((stock)=>{

    }).catch((e)=>{

    });
     io.emit('delete', { stock:symbol.stock } );
  });

  socket.on('addSymbol',(symbol)=>{
    Stock.findOne( {symbol:symbol.stock }).then((stock)=>{
      if(stock == null) {
        let stock = new Stock({symbol:symbol.stock});
        stock.save();
        io.emit('add', { stock:symbol.stock } );
      }
    });

  });

  socket.on('disconnect',()=>{
    console.log('User left');
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(port, ()=>{
  console.log(`The server is running on ${port}`);
});
