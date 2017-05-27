const {Stock} = require('./../models/stocks');
const express = require('express');
const yahooFinance = require('yahoo-finance');


function StockController() {

    this.getHomePage  = ((req, res) => {
        res.render('index');
    });

    this.getStocksFromDb = ((req, res) => {
        Stock.find({}).then((stocks)=>{
            let stockList = stocks.map((stock)=>{
                return stock.symbol;
            });
            res.send(stockList);
        });
    });

    this.getStocksData = ((req, res) => {
        let symbols = req.query.symbols;

        let to = new Date();
        let temp = new Date();
        let from = new Date(temp.setFullYear(temp.getFullYear()-1));

        yahooFinance.historical({
            symbols: symbols,
            from: from,
            to: to,
        }, function (err, quotes) {
            if (err) {return res.status(400).send();}
            res.status(200).send(quotes);
        });
    });

    this.getOneStockData = ((req, res) => {
        let symbol = req.query.stock;

        let to = new Date();
        let temp = new Date();
        let from = new Date(temp.setFullYear(temp.getFullYear()-1));

        yahooFinance.historical({
            symbol: symbol,
            from: from,
            to: to,
        }, function (err, quotes) {
            if (err) {return res.status(400).send();}

            let quote = quotes.map((elem)=>{
                return [Date.parse(elem.date), elem.adjClose];
             });
        
            quote.sort(function(a, b) {
                return a[0] - b[0];
            });

            res.status(200).send({name:symbol, data: quote});
        });
    });
}

module.exports = StockController;