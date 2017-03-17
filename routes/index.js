require('./../config/config');
var express = require('express');
var router = express.Router();
const yahooFinance = require('yahoo-finance');
const {Stock} = require('./../models/stocks');

/* GET home page. */
router.get('/', (req,res)=> {
  Stock.find({}).then((stocks)=>{
    let stockList = stocks.map((stock)=>{
      return stock.symbol;
    });
    res.render('index', { 
      title: 'Stock Market',
      stockList:stockList
    });
  }).catch((e)=>{
    res.render('index', { 
      title: 'Stock Market',
      error:"Something is wrong"
    });
  });
});

router.get('/stock/:symbol', (req,res)=> {
  let symbol = req.params.symbol;
  let to = new Date();
  let temp = new Date();
  let from = new Date(temp.setFullYear(temp.getFullYear()-1));

  yahooFinance.historical({
    symbol: symbol,
    from: from,
    to: to,
  }, function (err, quotes) {
    let quote = quotes.map((elem)=>{
      return [elem.date.getTime(), elem.adjClose];
    });
    res.status(200).send(quote);
  });

});



module.exports = router;
