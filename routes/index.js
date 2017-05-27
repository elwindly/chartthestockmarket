require('./../config/config');
const express = require('express');
const router = express.Router();
const yahooFinance = require('yahoo-finance');
const {Stock} = require('./../models/stocks');

const StockController = require('./../controllers/stockController');

const stockController = new StockController();

/* GET home page. */
router.get('/', stockController.getHomePage);

//send the stock symbols
router.get('/stockList', stockController.getStocksFromDb);

//get stocks data from Yahoo finance
router.get('/stocks', stockController.getStocksData);

//get induvidual stocks data from Yahoo finance
router.get('/stock', stockController.getOneStockData);

module.exports = router;
